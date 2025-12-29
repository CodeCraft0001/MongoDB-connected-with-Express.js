const express = require("express");
const { MongoClient } = require("mongodb");


const app = express();
app.use(express.json());

const client = new MongoClient("mongodb://localhost:27017");// Connection String

let db;

// 1. Connect to MongoDB
client.connect().then(() => {
    db = client.db("mydatabase")
    console.log("MongoDB connected");
})

// 2. Create API
app.post("/users", async (req, res) => {
    const result = await db.collection("users").insertOne(req.body);
    res.json(result);
})

app.listen(5000, ()=> {
    console.log("Server is running on port 5000");
})