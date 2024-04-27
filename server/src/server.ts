const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const app = express();
import { Request, Response } from "express";
import { ValidateResult } from "./services/user";
import * as deepl from "./services/deepl";
import * as db from "./services/db";
import { validateInfo as validateUserInfo } from "./services/user";
import { join as join_path } from "path";
import * as yt from "./services/youtube-api";

// Globals
const SESSION_SECRET = process.env["SESSION-SECRET"];

// Services
const dynamo = new db.MyDynamoClient();
const sql = new db.MySQLDB();
const translator = new deepl.DLTranslator("es");

//Middleware
app.use(cors());
app.use(express.static(join_path(__dirname, "../dist/client")));
app.use(express.json());
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true, // for HTTPS
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // 1 hours
      sameSite: "lax",
    },
    name: "sessionId",
  })
);

// login endpoint
app.post("/api/login", async (req: Request, res: Response) => {
  const body = req.body;
  const name = body.username;
  const password = body.password;
  // Check for blank user and passwords

  // Authenticate user
  const authed = await sql.authenticateUser(name, password);
  if (authed == null) {
    // Error
  } else if (authed == false) {
    // User DNE
  }

  session.userid = 1;
  session.authenticated = true;
  res.status(200).send("Login Successful.");
});

app.post(
  "/api/register-user",
  express.json(),
  async (req: Request, res: Response) => {
    //TODO Refactor using User object and single function
    const data = req.body;
    const username = data.username;
    const password = data.password;
    const confirm_password = data.confirm_password;
    // Validate info
    const validationResult: ValidateResult = validateUserInfo(
      username,
      password,
      confirm_password
    );
    if (validationResult !== ValidateResult.VALID) {
      console.log("User info invalid.");
      res.status(500).send(validationResult);
      return;
    }

    // Username may already be registered
    if (await sql.userExists(username)) {
      console.log(username, "Already exists.");
      res.status(500).send("Username already exists.");
      return;
    }

    const created = await sql.createUser(username, password);
    if (!created) {
      res.status(501).send("Server error creating user.");
      return;
    }
    console.log("User List:", await sql.listUsers());

    session.authenticated = true;
    session.userid = 1;
    res.status(201).send("User created.");
    //res.status(200).send("Success");
  }
);

app.post("/api/translate", async (req: Request, res: Response) => {
  const data = req.body.data;
  console.log(data);

  const config: deepl.TranslateConfig = {
    texts: data,
    target_lang: "en-US",
  };

  try {
    const translated = await translator.translate(config);
    console.log(translated);
    res.status(200).send(translated);
  } catch (err) {
    res.status(500).send("Server error.");
  }
});

// Save vocab term endpoint
app.post("/api/save-vocab", async (req: Request, res: Response) => {

  if (!req.body){
    res.status(400).send("Bad Request. No body.");
  }

  console.log(req);
  let term = req.body.term;
  let familiarity = req.body.familiarity;
  let translation = req.body.translation;
  let origin = "youtube";

  

  let missing: string[] = [];
  if (!term) missing.push("term");
  else if (!familiarity) missing.push("familiarity");
  else if (!translation) missing.push("translation");
  else if (!origin) missing.push("origin");
  if (missing.length !== 0)
  {
    res.status(400).json({
      error: "Bad Request.",
      specifics: {
        issue: "items",
        message: `Missing items ${missing}`
      }
    });

    return;
  }

  // Term validation
  if (typeof term !== "string") {
    res.status(400).json({
      error: "Bad Request.", 
      specifics: {
        issue: "term", 
        message: "Term must be a string." 
      }
    });
    return;
  }
  
  // Familiarity Validation
  if (typeof familiarity !== "number") {

    if (typeof familiarity !== "string") {
      res.status(400).json({
        error: "Bad Request.", 
        specifics: {
          issue: "familiarity", 
          message: "Familiarity must be a number or stringified number." 
        }
      });
      return;
    }
    else {
      // Convert to string if possible, else return error message.
      try {
        familiarity = String(familiarity);
      } catch (error) {
        res.status(400).json({
          error: "Bad Request",
          specifics: {
            issue: "familiarity",
            message: "Familiarity is a non-numerical string."
          }
        });
        return;
      }
    }
  }
  
  // Translation Validation
  if (typeof translation !== "string") {
    res.status(400).json({
      error: "Bad Request.", 
      specifics: {
        issue: "translation", 
        message: "Translation must be a string." 
      }
    });
    return;
  }

  // Check if term already exists
  const getResult = await dynamo.getTerm(0, term);
  if (getResult.item)
  {
    if (getResult.item.translation.S === translation)
    {
      res.status(200).send("Term already exists with given translation.");
    }
  }

  const date: Date = new Date();
  const item = {
    "userid": {"S": "0"}, //Primary Key
    "TERM#": {"S": term}, //Sort Key
    "familiarity": {"N": familiarity},
    "translations": {"L": [
      {"S": translation}
    ]},
    "origin": {"S": origin},
    "last seen": {"S": date.toISOString()}
  }

  try {
    const result = await dynamo.putTerm(item);
    if (result.$metadata.httpStatusCode !== 200)
    {
      console.log(result);
      throw new Error("Error saving term in DynamoDB");
    }
    res.status(200).send("Term Saved");
  } catch (error: any) {
    console.error(error);
    res.status(500).send("Server Error.");
  }
});

app.get("/api/list-vocab", async (req: Request, res: Response) => {
  try {
    const results = await dynamo.listTerms();
    console.log(results);
    res.status(200).send(results);
  } catch (err) {
    res.status(500).send("Error occurred when listing terms.");
  }
});

app.get("/api/get-youtube-videos", async (req: Request, res: Response) =>
{
  try {
    const n_to_get: number = Number(req.query.n); 
    const result = yt.search("How to spanish podcast", n_to_get);
    const videos = (await result)?.videos;
    res.status(200).send(videos);
  } catch (error) {
    console.error("Error searching youtube videos.", error);
    res.status(500).send("Error searching youtube videos."); 
  }
});
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

