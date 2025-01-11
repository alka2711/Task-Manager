const mongoose = require('mongoose');

// Database connection function
const dbConnection = async () => {
  try {
    // console.log("MongoDB URI:", process.env.MONGODB_URI); // Log the URI for debugging
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB connection established");
  } catch (error) {
    console.error("DB Error: " + error);
  }

};

// Export the dbConnection function
module.exports = { dbConnection };