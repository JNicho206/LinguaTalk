const mysql = require("mysql");
const dotenv = require("dotenv").config();
const { DynamoDBClient, PutItemCommand, ContinuousBackupsUnavailableException } = require('@aws-sdk/client-dynamodb');

const MYSQL_HOST = process.env["MYSQL-HOST"];
const MYSQL_PWD = process.env["MYSQL-PWD"];
const MYSQL_DBNAME = process.env["MYSQL-DB"];
const MYSQL_USER = process.env["MYSQL-USER"];
const AWS_REGION = process.env["AWS-REGION"];
const DYNAMODB_TERMS = process.env["DYNAMODB-TERMS-TABLE"];
const AWS_ACCESS_KEY = process.env["AWS-SERVICE-ACCESS-KEY"];
const AWS_SECRET_KEY = process.env["AWS-SERVICE-SECRET-KEY"];

class MySQLDB
{
    constructor()
    {
        // this.pool = mysql.createPool({
        //     host: _host, 
        //     user: _user,
        //     password: _pwd,
        //     database: db,
        //     port: 3306,
        // });
    }

    async query(q)
    {
        // try
        // {
        //     const connection = await this.pool.getConnection();
        //     const [rows, fields] = await connection.query(q);
        //     connection.release();
        //     return [rows, fields];
        // }
        // catch (err)
        // {
        //     console.error(err);
        // }
        try
        {
            const connection = mysql.createConnection({
                host: MYSQL_HOST, 
                user: MYSQL_USER,
                password: MYSQL_PWD,
                database: "users",
                port: 3306,
            });
            connection.connect(function(err) {
                if (err) {
                  console.error('Database connection failed: ' + err.stack);
                  return;
                }
                console.log("Connection made!")
                connection.query(q, (err, results) =>
                {
                    if (err)
                    {
                        console.error("Query Error: ", err.stack);
                        connection.destroy();
                        return;
                    }
                    console.log(results);
                    connection.destroy();
                    console.log("Connection destroyed");
                });
            }
            );
            //console.log(res);
        }
        catch (err)
        {
            console.log(err);
        }
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