/** @type {import("mongoose").Model<any>} */
const userModel = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/generateToken");

const register = async (req, res) => {
  try {
    const { name, email, password, role} = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "All field (name, email, password) are required.",
      });
    }

    const alreadyExists = await userModel.findOne({ email });
    if (alreadyExists) {
      return res.status(409).json({
        error: "User already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    const token = generateToken(newUser._id);
    res.cookie("token", token);

    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };

    res.status(201).json(userResponse);
  } catch (err) {
    res.status(500).json({
      error: `Error occured while registering: ${err}`,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "All fields (email, password) are required" });
    }

    const userExists = await userModel.findOne({ email }).select('+password');

    if (!userExists) {
      return res.status(404).json({ error: "User does not exists" });
    }

    const comparePassword = await bcrypt.compare(password, userExists.password);

    if (!comparePassword) {
      return res.status(400).json({ error: "Email or password is incorrect" });
    }

    const token = generateToken(userExists._id);
    res.cookie("token", token);

    res.status(200).json({
      message: "loggedin sucessfully",
    });
  } catch (err) {
    res.status(500).json({
      error: `Error while login: ${err}`,
    });
  }
};

const getMe = async (req, res) => {
    try{
        const user = await userModel.findOne(req.user._id)

        res.status(200).json({
            user
        })
    } catch(err){

    }
}

module.exports = { register, login, getMe };
