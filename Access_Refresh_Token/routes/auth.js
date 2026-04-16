const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    password: hashed,
  });

  res.json(user);
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(400).json({ msg: "user not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ msg: "Wrong Password" });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, { httpOnly: true });

  res.json({ accessToken });
});

router.post("/refresh", async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.sendStatus(401);
  }

  const user = await User.findOne({ refreshToken: token });

  if (!user) {
    return res.sendStatus(403);
  }

  jwt.verify(token, process.env.REFRESH_SECRET, (err) => {
    if (err) return res.sendStatus(403);

    const newAccessToken = generateAccessToken(user);

    res.json({ accessToken: newAccessToken });
  });
});

router.get("/profile", (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_SECRET, async (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    res.json({ msg: "Profile Data", user });
  });
});

router.post("/logout", async (req, res) => {
  const token = req.cookies.refreshToken;

  const user = await User.findOne({ refreshToken: token });

  if (user) {
    user.refreshToken = null;
    await user.save();
  }

  res.clearCookie("refreshToken");
  res.send("Logged Out");
});

module.exports = router;
