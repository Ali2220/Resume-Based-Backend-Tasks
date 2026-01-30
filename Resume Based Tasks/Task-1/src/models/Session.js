const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  language: {
    type: String,
    default: "javascript",
  },
  status: {
    type: String,
    enum: ["active", "ended", "idle"],
    default: "active",
  },
  participants: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      joinedAt: { type: Date, default: Date.now },
      role: {
        type: String,
        enum: ["read-only", "editor"],
        default: "read-only",
      },
    },
  ],
  participantCount: { type: Number, default: 0, max: 10 },

  // TTL Logic: Is field par index banayenge
  lastActivity: { type: Date, default: Date.now },
});

// TTL Index: 24 hours (86400 seconds) of inactivity
sessionSchema.index({ lastActivity: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model("Session", sessionSchema);
