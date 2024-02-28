"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv").config();
const express = require("express");
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
const sql = new db.MySQLDB();
//Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(session({
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
}));
// Endpoints
// Serve home page
// TODO protect by sending to login if not authenticated
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});
// Serve login page
app.get('/login', (req, res) => {
    // If not authenticated
    // serve login
    res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
    // else
    // redirect to home
});
// login endpoint
app.post('/api/login', (req, res) => {
});
// Serve register page
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'register.html'));
});
app.post('/api/sql-create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.table;
    //const result = await sql.query(`CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL)`);
    const result = yield sql.query("SHOW TABLES;");
    console.log(result);
}));
app.get('/api/sql-list', (req, res) => {
});
// Save vocab term endpoint
app.post("/api/save-vocab", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const term = req.body.term;
    const familiarity = req.body.familiarity;
    console.log(req.body);
    const familiarity_n = 1;
    const item = {
        "userid": {
            "N": "0"
        },
        "term": {
            "M": {
                "value": { S: String(term) },
                "familiarity": { N: String(familiarity_n) }
            }
        }
    };
    const put_result = yield dynamo.putTerm(item);
    console.log("Received");
    if (put_result.$metadata.httpStatusCode == 200) {
        res.status(200).send("Term saved succssfully");
    }
    else {
        console.log(put_result);
        res.status(500).send("Error saving term");
    }
}));
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
