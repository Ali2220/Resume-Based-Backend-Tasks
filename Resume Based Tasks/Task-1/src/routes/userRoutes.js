const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { register, login } = require("../middlewares/validationMiddleware");

// I dont use much validation, and i dont use bcrytjs
router.post("/register", register, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all info." });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const accessToken = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "15m",
      },
    );

    const refreshToken = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      },
    );

    newUser.refreshToken = refreshToken;
    await newUser.save();

    res.cookie("accessToken", accessToken, { httpOnly: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true });

    res.status(201).json({ message: "User registered Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", login, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please Provide Email and Password." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    console.log(checkPassword);

    if (!checkPassword) {
      return res
        .status(401)
        .json({ message: "Email or Password is incorrect" });
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      },
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("accessToken", accessToken, { httpOnly: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true });

    res.status(200).json({ message: "User loggedin Successfully" });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh Token missing" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);

    const user = await User.findById({ _id: decoded.id });
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid Refresh token" });
    }

    const newAccessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15m" },
    );
    res.cookie("accessToken", newAccessToken, { httpOnly: true });

    res.status(200).json({ message: "Access Token refreshed" });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.post("/logout", async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      const user = await User.findOne({ refreshToken });

      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({ message: "User loggedout successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// async function shouldStoreInLongTerm(message, userId){
//   const words = ['i like', 'i prefer', 'my name is', 'remember that']
//   if(message.incldues(words)){
//     const Messages = await Message.create({
//       user: new mongoose.Types.ObjectId(userId),
//       text: message,
//     })
//   }
// }

// router.post("/message", async (req, res) => {
//   try {
//     const { message, userId } = req.body;
//     if (!message || !userId) {
//       return res.status(400).json({ message: "Please send some message" });
//     }

//     const newMessage = await shouldStoreInLongTerm(message, userId)

//     res.status(201).json({
//       newMessage,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// });

module.exports = router;
