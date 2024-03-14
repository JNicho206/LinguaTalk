const mysql = require("mysql");
const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const bcrypt = require("bcrypt");

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
    pool: any;
    constructor()
    {
        this.pool = mysql.createPool({
            host: MYSQL_HOST, 
            user: MYSQL_USER,
            password: MYSQL_PWD,
            database: "main",
            port: 3306,
            connectionLimit: 10
        });
        // this.connection = mysql.createConnection({
        //     host: MYSQL_HOST, 
        //     user: MYSQL_USER,
        //     password: MYSQL_PWD,
        //     database: "main",
        //     port: 3306,
        // });
    }

    query(q: string) : Promise<any>
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
        return new Promise((resolve, reject) =>
        {
            this.pool.getConnection(async (err: Error, connection: any) => {
                if (err) {
                    console.error('Database connection failed: ' + err.stack);
                    reject(new Error("Error connecting to the database."));
                    return;
                }
                console.log("Connection made!");
                connection.query(q, (err: Error, results: any) =>
                {
                    if (err)
                    {
                        console.error("Query Error: ", err.stack);
                        connection.release();
                        reject (new Error("Error making query"));
                        return;
                    }
                    connection.release();
                    console.log("Connection destroyed");
                    resolve(results);
                    return;
                });
            });
        });
    }
    
    async createUser(name: string, password: string)
    {
        
        try
        {
            const hash = await bcrypt.hash(password, 10);
            const q_response = await this.query(`INSERT INTO users (username, password) VALUES ('${name}', '${hash}')`);
        }
        catch (err)
        {
            console.error("Error creating user.", err);
            return false;
        }
        return true;
    }

    async userExists(name: string)
    {
        return false;
    }

    async listUsers()
    {
        return await this.query("SELECT * FROM users");
    }
}



class MyDynamoClient
{
    client: typeof DynamoDBClient;
    constructor()
    {
        const client_config: object = { 
            region: AWS_REGION,
            credentials: {
                accessKeyId: AWS_ACCESS_KEY, 
                secretAccessKey: AWS_SECRET_KEY,
            }
        }
        this.client = new DynamoDBClient(client_config)
    }

    async putTerm(item: object)
    {
        const config: object = {
            "TableName": DYNAMODB_TERMS,
            "Item": item
        };
        const cmd: typeof PutItemCommand = new PutItemCommand(config);
        console.log("Sending");
        return this.client.send(cmd);
    }
}

module.exports = {MySQLDB, MyDynamoClient};