const mongoose = require('mongoose');

/**
 * Connect to MongoDB Database
 * Uses Mongoose ODM for MongoDB connection and schema management
 */
const connectDB = async () => {
  try {
    // Connect to MongoDB using connection string from environment variables
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      // Note: useNewUrlParser, useUnifiedTopology are no longer needed in Mongoose 6+
      // Connection options are automatically set
    });

    // Log successful connection with host information
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Log error and exit process if connection fails
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit with failure code
  }
};

module.exports = connectDB;
