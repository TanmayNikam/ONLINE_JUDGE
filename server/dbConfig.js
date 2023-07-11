require("dotenv").config()
const mongoose = require("mongoose");


const DBConnection = async () => {
  const PASSWORD = process.env.DB_PASSWORD;
  const DB_URI = process.env.DB_URL.replace("<password>",PASSWORD);
  try {
    await mongoose.connect(DB_URI, { useNewUrlParser: true });
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Error while connecting with the database ", error.message);
  }
};

module.exports= DBConnection;
