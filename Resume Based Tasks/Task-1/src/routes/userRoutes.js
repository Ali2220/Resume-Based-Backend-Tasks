const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Message = require("../models/Message");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken')

// I dont use much validation, and i dont use bcrytjs 
router.post("/register", async (req, res) => {
  try {
    const { name, email, avatar } = req.body;
    if (!name || !email || !avatar) {
      return res.status(400).json({ message: "Please provide all info." });
    }

    const newUser = await User.create({
      name,
      email,
      avatar
    });

    const token = jwt.sign({id: newUser._id}, 'shh')
    res.cookie('token', token)

    res.status(201).json({ newUser: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
