//1- Import required packages
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

//2- Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));
    
//3- Create a Schema (MongoDB structure)
const UserSchema = new mongoose.Schema({
    name: String,
    email: String
});

//4- Create a Model (this talks to the DB)
const User = mongoose.model('User', UserSchema); // Registering the UserSchema into Model using .model()

//5- API route to INSERT data into MongoDB
app.post("/users", async (req, res) => {
    try {
        const user = await User.create({
            name: req.body.name,
            email: req.body.email
        });
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message})
    }
});

//6- Start the Server
app.listen(5000, () => {
    console.log(`Server is running on port 5000`);
})