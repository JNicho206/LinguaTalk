const dotenv = require("dotenv").config();
const express = require("express");
import { Request, Response} from 'express';
import { ValidateResult } from './services/user';
const path = require("path");
const youtube = require("./services/youtube-api");
const db = require("./services/db");
const user = require("./services/user");
const deepl = require("./services/deepl");
const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const session = require("express-session");
const app = express();

// Globals
const SESSION_SECRET = process.env["SESSION-SECRET"];

// Services
const dynamo = new db.MyDynamoClient();
const sql = new db.MySQLDB()
const translator = new deepl.DLTranslator("es");

//Middleware
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(session(
    {
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: true, // for HTTPS
          httpOnly: true,
          maxAge: 60 * 60 * 1000, // 1 hours
          sameSite: 'lax'
        },
        name: 'sessionId'
    }
))


// Endpoints

// Serve home page
// TODO protect by sending to login if not authenticated
app.get('/', (req: Request, res: Response ) => {
    res.sendFile(path.join(__dirname, '../public', 'views', 'index.html'));
});

// Serve login page
app.get('/login', (req: Request, res: Response) =>
{
    // If not authenticated
    // serve login
    res.sendFile(path.join(__dirname, '../public', 'views', 'index.html'));

    // else
    // redirect to home
});

// login endpoint
app.post('/api/login', async (req: Request, res: Response) =>
{
    const body = req.body;
    const name = body.username;
    const password = body.password;
    // Check for blank user and passwords

    // Authenticate user
    const authed = await sql.authenticateUser(name, password);
    if (authed == null)
    {
        // Error
    }
    else if (authed == false)
    {
        // User DNE
    }

    session.userid = 1;
    session.authenticated = true;
    res.status(200).send("Login Successful.");

});

// Serve register page
app.get('/register', (req: Request, res: Response) =>
{
    res.sendFile(path.join(__dirname, '../public', 'views', 'register.html'));
});

app.post('/api/register-user', express.json(), async (req: Request, res: Response) =>
{
    //TODO Refactor using User object and single function
    const data = req.body;
    const username = data.username;
    const password = data.password;
    const confirm_password = data.confirm_password;
    // Validate info
    const validationResult: ValidateResult = user.validateInfo(username, password, confirm_password);
    if (validationResult !== ValidateResult.VALID)
    {
        console.log("User info invalid.");
        res.status(500).send(validationResult);
        return;
    }

    // Username may already be registered
    if (sql.userExists(username))
    {
        console.log(username, "Already exists.");
        res.status(500).send("Username already exists.");
        return;
    }

    const created = await sql.createUser(username, password);
    if (!created)
    {
        res.status(501).send("Server error creating user.");
        return;
    }
    console.log("User List:", await sql.listUsers());

    session.authenticated = true;
    session.userid = 1;
    res.status(201).send("User created.");
    //res.status(200).send("Success");
});

app.post("/api/translate", async (req: Request, res: Response) =>
{
    const data = req.body.data;
    try
    {
        const translated = await translator.translate(data);
        res.status(200).send(translated);
    }
    catch (err)
    {
        console.error("Error translating data:", err);
        res.status(500).send("Server error.");
    }
});

// Save vocab term endpoint
app.post("/api/save-vocab", async (req: Request, res: Response) =>
{
    const term = req.body.term;
    const familiarity = req.body.familiarity;
    console.log(req.body)
    const familiarity_n = 1;
    const item = 
    {
        "userid": 
        {
            "N": "0"
        },
        "term":
        {
            "M":
            {
                "value": {S: String(term)},
                "familiarity": {N: String(familiarity_n)}
            }
        }
    }
    const put_result = await dynamo.putTerm(item);
    console.log("Received");
    if (put_result.$metadata.httpStatusCode == 200)
    {
        res.status(200).send("Term saved succssfully");
    }
    else
    {
        console.log(put_result);
        res.status(500).send("Error saving term");
    }
})

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});