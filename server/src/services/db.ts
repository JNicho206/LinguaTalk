const mysql = require("mysql");
const {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  ScanCommand,
} = require("@aws-sdk/client-dynamodb");
const bcrypt = require("bcrypt");

const MYSQL_HOST = process.env["MYSQL-HOST"];
const MYSQL_PWD = process.env["MYSQL-PWD"];
const MYSQL_DBNAME = process.env["MYSQL-DB"];
const MYSQL_USER = process.env["MYSQL-USER"];
const AWS_REGION = process.env["AWS-REGION"];
const DYNAMODB_TERMS = process.env["DYNAMODB-TERMS-TABLE"];
const AWS_ACCESS_KEY = process.env["AWS-SERVICE-ACCESS-KEY"];
const AWS_SECRET_KEY = process.env["AWS-SERVICE-SECRET-KEY"];

export class MySQLDB {
  pool: any;
  vocabTable: string = "vocab";
  constructor() {
    this.pool = mysql.createPool({
      host: MYSQL_HOST,
      user: MYSQL_USER,
      password: MYSQL_PWD,
      database: "main",
      port: 3306,
      connectionLimit: 10,
    });
  }

  query(q: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.pool.getConnection(async (err: Error, connection: any) => {
        if (err) {
          console.error("Database connection failed: " + err.stack);
          reject(new Error("Error connecting to the database."));
          return;
        }
        console.log("Connection made!");
        connection.query(q, (err: Error, results: any) => {
          if (err) {
            console.error("Query Error: ", err.stack);
            connection.release();
            reject(new Error("Error making query"));
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

  async saveTerm(
    term: string,
    definition: string,
    familiarity: number,
    userid: number = 0
  ) {
    try {
      term.trim();
      definition.trim();

      const columns = "term, definition, user_id, familiarity";
      const values = `${term}, ${definition}, ${userid}, ${familiarity}`;
      const res = await this.query(
        `INSERT INTO vocab (${columns}) VALUES (${values})`
      );
    } catch (error: any) {
      console.error("Error occurred when term was being saved: ", error);
      throw Error(error);
    }
  }

  async listTerms(
    term: string | string[] | null = null,
    definition: string | string[] | null = null,
    userid: number | number[] | null = null,
    familiarity: number | number[] | null = null
  ) {
    let query: string = `SELECT * FROM ${this.vocabTable}`;
    let conditions: string[] = [];

    if (userid !== null) {
      if (Array.isArray(userid)) {
        conditions.push(`userid IN (${userid.join(", ")})`);
      } else {
        conditions.push(`userid = ${userid}`);
      }
    }

    if (familiarity !== null) {
      if (Array.isArray(familiarity)) {
        conditions.push(`familiarity IN (${familiarity.join(", ")})`);
      } else {
        conditions.push(`familiarity = ${familiarity}`);
      }
    }

    if (term !== null) {
      if (Array.isArray(term)) {
        conditions.push(`term IN (${term.join(", ")})`);
      } else {
        conditions.push(`term = ${term}`);
      }
    }

    if (definition !== null) {
      if (Array.isArray(definition)) {
        conditions.push(`definition IN (${definition.join(", ")})`);
      } else {
        conditions.push(`definition = ${definition}`);
      }
    }

    // If there are any conditions, append them to the query
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    try {
      const response = await this.query(query);
      return response;
    } catch (error: any) {
      console.error("Error sending list terms query: ", error);
      throw Error(error);
    }
  }

  async createUser(name: string, password: string) {
    try {
      const hash = await bcrypt.hash(password, 10);
      const q_response = await this.query(
        `INSERT INTO users (username, password) VALUES ('${name}', '${hash}')`
      );
    } catch (err) {
      console.error("Query error creating user:", err);
      return false;
    }
    return true;
  }

  async getUser(name: string) {
    try {
      const response = await this.query(
        `SELECT * FROM users WHERE (username == ${name})`
      );
      return response;
    } catch (err) {
      console.error("Error when getting user:", err);
      return null;
    }
  }

  async userExists(name: string) {
    try {
      const res = await this.getUser(name);
      return res != null;
    } catch (err) {
      console.error("Error when checking if user exists:", err);
      return true;
    }
  }

  async listUsers() {
    try {
      return await this.query("SELECT * FROM users");
    } catch (err) {
      console.error("Error when listing users:", err);
    }
  }

  async authenticateUser(
    username: string,
    password: string
  ): Promise<boolean | null> {
    try {
      const user = await this.getUser(username);
      if (user == null) return false;
      const hash = await bcrypt.hash(10);
      return hash === user.password;
    } catch (err) {
      console.error("Error authenticating user:", err);
      return null;
    }
  }
}

export class MyDynamoClient {
  client: typeof DynamoDBClient;
  vocabSortKey: string = "LEVEL#ORIGIN#LASTSEEN";
  constructor() {
    const client_config: object = {
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY,
      },
    };
    this.client = new DynamoDBClient(client_config);
  }

  putTerm(item: object) {
    const config: object = {
      TableName: DYNAMODB_TERMS,
      Item: item,
    };
    const cmd: typeof PutItemCommand = new PutItemCommand(config);
    console.log("Sending");
    return this.client.send(cmd);
  }

  getTerm(userid: string | number, term: string)
  {
    if (typeof userid === "number")
    {
      userid = String(userid);
    }

    const item: object = {
      "userid": {"S": userid},
      "TERM#": {"S": term}
    };

    const config: object = {
      TableName: DYNAMODB_TERMS,
      Key: item
    };

    const cmd: typeof GetItemCommand = new GetItemCommand(config);
    return this.client.send(cmd);
  }

  listTerms(userid: string = "0") {
    const config: object = {
      TableName: DYNAMODB_TERMS,
    };
    const cmd: typeof ScanCommand = new ScanCommand(config);
    return this.client.send(cmd);
  }
}

