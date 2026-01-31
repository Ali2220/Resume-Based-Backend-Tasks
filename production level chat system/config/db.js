const mongoose = require("mongoose");

async function connectDB() {
  await mongoose
    .connect("mongodb://127.0.0.1:27017/chat_system_task")
    .then(function () {
      console.log("MongoDB Connected");
    })
    .catch(function (err) {
      console.log("Mongodb Connection Error");
      return res
        .status("500")
        .json({ message: `MongoDb Connection Error: ${err.message}` });
    });
}

module.exports = connectDB