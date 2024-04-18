const dotenv = require("dotenv").config();
const express = require("express");
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
app.use(express.static(join_path(__dirname, "../public")));
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

// Endpoints

// Serve home page
// TODO protect by sending to login if not authenticated
app.get("/", (req: Request, res: Response) => {
  res.sendFile(join_path(__dirname, "../public", "views", "index.html"));
});

// Serve login page
app.get("/login", (req: Request, res: Response) => {
  // If not authenticated
  // serve login
  res.sendFile(join_path(__dirname, "../public", "views", "index.html"));

  // else
  // redirect to home
});

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

// Serve register page
app.get("/register", (req: Request, res: Response) => {
  res.sendFile(join_path(__dirname, "../public", "views", "register.html"));
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
  console.log(req.body);
  const term = req.body.term;
  const familiarity = req.body.familiarity;
  const definition = req.body.definition;

  if (false) {
    // Invalid term
    res.status(400).json({ issue: "term", message: "Term is invalid." });
    return;
  }
  if (false) {
    // Invalid familiarity
    res
      .status(400)
      .json({ issue: "familiarity", message: "familiarity is invalid" });
    return;
  }

  try {
    const response = sql.saveTerm(term, definition, familiarity);
  } catch (error: any) {
    res.status(500).send("Server Error.");
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/api/list-vocab", async (req: Request, res: Response) => {
  try {
    const results = await sql.listTerms();
    console.log(results[0].term);
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