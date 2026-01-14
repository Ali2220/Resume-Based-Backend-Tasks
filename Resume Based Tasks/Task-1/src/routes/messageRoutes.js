const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

router.get("/room/:id", async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.id }).sort({createdAt: -1}).limit(50)
  

    res.status(200).json({
     
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
