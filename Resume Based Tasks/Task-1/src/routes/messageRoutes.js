const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

async function getRecentMessages(userId) {
  const messages = await Message.find({ user: userId }).sort({createdAt: 1}).limit(5);
  return messages.map(msg => msg.text);
}

router.get("/get-messages/:id", async (req, res) => {
  try {
    const messages = await getRecentMessages(req.params.id.toString());

    res.json(messages);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
