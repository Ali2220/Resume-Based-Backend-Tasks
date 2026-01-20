const mongoose = require("mongoose");
const Channel = require("./Channel");

const messageSchema = new mongoose.Schema(
  {
    content: String,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      index: true,
    },
    parentMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    mentions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Message", messageSchema);
