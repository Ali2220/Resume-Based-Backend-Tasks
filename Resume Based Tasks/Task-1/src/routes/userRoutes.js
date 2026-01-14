const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/create", async (req, res) => {
  try {
    const { name } = req.body;

    const newUser = await User.create({
      name,
    });

    res.status(201).json({
      message: "User created",
      userName: newUser.name,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
