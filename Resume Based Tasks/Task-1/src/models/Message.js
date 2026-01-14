const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  room: {
    type: String,
  },
});

module.exports = mongoose.model("Message", messageSchema);
