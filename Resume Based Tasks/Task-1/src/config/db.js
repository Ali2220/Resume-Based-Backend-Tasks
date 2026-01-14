const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/tasks");
    console.log("MongoDb connected");
  } catch (error) {
    console.log("Mongodb connection error", error.message);
  }
}

module.exports = connectDB;
