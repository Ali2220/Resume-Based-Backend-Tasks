const Message = require("../models/Message");
const Channel = require("../models/Channel");
const WorkSpace = require("../models/WorkSpace");
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const mongoose = require("mongoose");

router.get("/get-messages/:channelId", authMiddleware, async (req, res) => {
  try {
    const { channelId } = req.params;
    const findMessages = await Message.find({
      channel: channelId,
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("sender", "name avatar")
      .populate("parentMessage", "content")
      .populate("mentions", "name");

    res.status(200).json({
      findMessages,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
