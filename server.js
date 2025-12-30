// ICDMMCB - Import pckges, Create app, Definine port, Middleware, MongoDB connection, Calling D.B, Basic route
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

   // An DataBase Schema
   const DataSchema = new mongoose.Schema({
      name: {
         type: String,
         required: true,
         unique: true
      }, age: {
         type: Number,
         required: true,
      }, place: {
         type: String,
         required: true,
         // unique: true
      }
   }, { timestamps: true}) // Adds createdAt and updatedAt fields


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

// Creating a Model from the Schema
   const DataModel = mongoose.model('Data', DataSchema)

// 10. Basic test route to check server is working
app.get('/', (req, res) => {
   res.send('Server is running and MongoDB is connected');
})

// Get API
app.get('/data', async (req, res) => {
   try {
      const allData = await DataModel.find({}); // find({}) method, same as find({})
      res.status(200).json(allData);
   } catch (err) {
      res.status(500).json({ error: err.message })
   }
})

// Post API
app.post('/createData', async (req, res) => {
   try {
      const dataToInsert = req.body;
      const savedData = await DataModel.create(dataToInsert); // Create method, same as insertOne

      // Sending back the saved data as response
      res.status(201).json(savedData);
   } catch (err) {
      res.status(400).json({ error: err.message})
   }
})

// Patch API(Update single resource)
app.patch('/data/:id', async (req, res) => {
   try {
      const { id } = req.params;
      const updates = req.body;

      const updatedData = await DataModel.findOneAndUpdate(
         { _id: id},
         { $set: updates },      // Only update sent fields
         {
            new: true,           // Return updated document  
            runValidators: true  // Ensure schema rules
         }
      );

      if (!updatedData) {
         return res.status(404).json({ error: 'Data not found'});
      }

      // res.status(200).json(updatedData);
      res.status(200).send(`Data with ID ${id} upated successfully`);
   } catch (err) {
      res.status(400).json({ error: err.message })
   }
})

// Delete API
app.delete('/data/:id', async (req, res) => {
   try {
      const { id } = req.params;

      const deletedData = await DataModel.findByIdAndDelete(id);

      if (!deletedData) {
         return res.status(404).json({ message: "Data not found" });
      }

      res.status(200).json({
         message: `Data with ID ${id} deleted successfully`,
         deletedData
      })
   } catch (err) {
      res.status(400).json({ error: err.message })
   }
});

// Delete Many by condition(deleteMany is used)
app.delete('/data', async (req, res) => {
   try {
      const filter = req.body; // condition

      if (!filter || Object.keys(filter).length === 0) {
         return res.status(400).json({
            message: "Provide Delete details in request body"
         });
      }

      const result = await DataModel.deleteMany(filter);

      res.status(200).json({
         message: "Documents deleted successfully",
         deletedCount: result.deletedCount
      })
   } catch (err) {
      res.status(400).json({ error: err.message })
   }
});

app.put('/data/:id', async (req, res) => {
   try {
      const updatedData = await DataModel.findByIdAndUpdate(
         req.params.id,
         req.body,
         {
            new: true,          // return updated doc
            overwrite: true,    // Full replacement (PUT behavior)   
            runValidators: true // Ensure schema rules 
         }
      );

      if (!updatedData) {
         return res.status(404).json({ message: "no such Data found" })
      }

      res.status(200).json(updatedData);

   } catch (err) {
      res.status(500).json({ error: err.message})
   }
})


app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
