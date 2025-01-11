const dotenv = require('dotenv')
const express = require('express');
const mongoose = require('mongoose');
// const cors = require('cors'); 
const { dbConnection } = require("./utils/index.js"); 

// Load environment variables from .env file
dotenv.config();

// Establish database connection
dbConnection();

// Set the port from environment variable or default to 3000
const PORT = process.env.PORT || 3000;

// Create an instance of Express
const app = express();

// CORS configuration (uncomment if needed)
// app.use(
//   cors({
//     origin: ["http://localhost:3000", "http://localhost:3001"],
//     methods: ["GET", "POST", "DELETE", "PUT"],
//     credentials: true,
//   })
// );

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests

// Start the server
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));