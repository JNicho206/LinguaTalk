const express = require("express");
const path = require("path");
const youtube = require("./services/youtube-api");
const db = require("./services/db");
const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json())

const dynamo = new db.MyDynamoClient();
// Home page route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});

app.post("/api/save-vocab", async (req, res) =>
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