const mongoose = require("mongoose");

async function connectDB() {
  await mongoose
    .connect("mongodb://localhost:27017/apiSecurityAndPerformance")
    .then(() => {
      console.log("MongoDB server connected");
    })
    .catch((error) => {
      console.log("MongoDB server error", error.message);
    });
}

module.exports = connectDB;
