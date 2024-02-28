const dotenv = require("dotenv").config();
const express = require("express");
import { Request, Response} from 'express';
const path = require("path");
const youtube = require("./services/youtube-api");
const db = require("./services/db");
const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const session = require("express-session");
const app = express();

// Globals
const SESSION_SECRET = process.env["SESSION-SECRET"];

// Services
const dynamo = new db.MyDynamoClient();
const sql = new db.MySQLDB()

//Middleware
app.use(express.static(path.join(__dirname, 'public')));
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
    res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});

// Serve login page
app.get('/login', (req: Request, res: Response) =>
{
    // If not authenticated
    // serve login
    res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));

    // else
    // redirect to home
});

// login endpoint
app.post('/api/login', (req: Request, res: Response) =>
{

});

// Serve register page
app.get('/register', (req: Request, res: Response) =>
{
    res.sendFile(path.join(__dirname, 'public', 'views', 'register.html'));
});
app.post('/api/sql-create', async (req: Request, res: Response) =>
{
    const name = req.body.table;
    //const result = await sql.query(`CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL)`);
    const result = await sql.query("SHOW TABLES;");
    console.log(result);
});

app.get('/api/sql-list', (req: Request, res: Response) =>
{

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