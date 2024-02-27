const mysql = require("mysql2");
const dotenv = require("dotenv").config();
const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');

const HOST = process.env["MYSQL-HOST"];
const PWD = process.env["MYSQL-PWD"];
const DBNAME = process.env["MYSQL-DB"];
const USER = process.env["MYSQL-USER"];
const AWS_REGION = process.env["AWS-REGION"];
const DYNAMODB_TERMS = process.env["DYNAMODB-TERMS-TABLE"];
const AWS_ACCESS_KEY = process.env["AWS-SERVICE-ACCESS-KEY"];
const AWS_SECRET_KEY = process.env["AWS-SERVICE-SECRET-KEY"];

class MySQLDB
{
    constructor(host = HOST, user=USER, pwd=PWD, db=DBNAME)
    {
        this.pool = mysql.createPool({
            host: host,
            user: user,
            password: pwd,
            database: db,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

    query(q)
    {
        this.pool.query(q, (error, results) =>
        {
            if (error) throw error;
            return results;
        });
    }

}

class MyDynamoClient
{
    constructor()
    {
        const client_config = { 
            region: AWS_REGION,
            credentials: {
                accessKeyId: AWS_ACCESS_KEY, 
                secretAccessKey: AWS_SECRET_KEY,
            }
        }
        this.client = new DynamoDBClient(client_config)
    }

    async putTerm(item)
    {
        const config = {
            "TableName": DYNAMODB_TERMS,
            "Item": item
        };
        const cmd = new PutItemCommand(config);
        console.log("Sending");
        return this.client.send(cmd);
    }
}

module.exports = {MySQLDB, MyDynamoClient};