const mysql = require("mysql2");
const dotenv = require("dotenv").config();

const HOST = process.env("MYSQL-HOST");
const PWD = process.env("MYSQL-PWD");
const DBNAME = process.env("MYSQL-DB");
const USER = process.env("MYSQL-USER");

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

module.exports = {MySQLDB};