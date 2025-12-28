// 1. Importing required core packages
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// 2. Creating an Express application instance
const app = express();

// 3. Defining the port from environment variables or defaulting to 4040
const PORT = process.env.PORT || 4040;

// 4. Middleware to parse incoming JSON requests
   // This allows req.body to work
app.use(express.json());


// 5. MongoDB connection function
const connectDB = async ()=> {
   try {
      // 6. Connecting to MongoDB using Mongoose
      await mongoose.connect(process.env.MONGO_URI)

      // 7. Logging a success message upon successful connection
      console.log("MongoDB connected successfully");
   } catch (error) {
      // 8. Log error and stop the server if DB fails
      console.log("MongoDB connection failed:", error.message);
      process.exit(1);
   }
}

// 9. Calling the database connection function
connectDB();

// 10. Basic test route to check server is working
app.get('/', (req, res) => {
   res.send('Server is running and MongoDB is connected');
})


app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
