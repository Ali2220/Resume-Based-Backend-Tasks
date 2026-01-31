const mongoose = require("mongoose");

// Right now We give the roomId and userId hardcoded
const messageSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 500
    },
    status: {
      type: String,
      enum: ["pending", "delivered"],
      default: 'pending'
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Message', messageSchema)