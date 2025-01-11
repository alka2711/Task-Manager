const dotenv = require('dotenv')
const express = require('express');
const mongoose = require('mongoose');
const { dbConnection } = require("./utils/index.js"); 

dotenv.config();

dbConnection();

const PORT = process.env.PORT || 3000;

const app = express();

// Middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));