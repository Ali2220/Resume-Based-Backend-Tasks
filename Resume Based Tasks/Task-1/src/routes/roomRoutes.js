const express = require("express");
const router = express.Router();
const { v4: uuid } = require("uuid");
const Room = require("../models/ChatRoom");

router.post("/create", async (req, res) => {
  try {
    const { name } = req.body;

    const newRoom = await Room.create({
      id: uuid().substring(0, 4),
      name: name,
    });

    res.status(201).json({
      message: "Room created",
      roomDetails: newRoom.name,
      roomId: newRoom.id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
