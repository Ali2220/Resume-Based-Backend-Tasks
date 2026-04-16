/** @type {import("mongoose").Model<any>} */
const userModel = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");

// Set Http-Only Cookies.
const setTokenCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

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
      role,
    });

    // generate Token
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    // Set cookies
    setTokenCookies(res, accessToken, refreshToken);

    // Save refresh token to database
    newUser.refreshToken = refreshToken;
    await newUser.save();

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

    const userExists = await userModel.findOne({ email }).select("+password");

    if (!userExists) {
      return res.status(404).json({ error: "User does not exists" });
    }

    const comparePassword = await bcrypt.compare(password, userExists.password);

    if (!comparePassword) {
      return res.status(400).json({ error: "Email or password is incorrect" });
    }

    // generate Token
    const accessToken = generateAccessToken(userExists._id);
    const refreshToken = generateRefreshToken(userExists._id);

    // set token in cookies
    setTokenCookies(res, accessToken, refreshToken);

    // Save refresh token to database
    userExists.refreshToken = refreshToken;
    await userExists.save();

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
  try {
    const user = await userModel.findOne(req.user._id);

    res.status(200).json({
      user,
    });
  } catch (err) {}
};

// Ye API purana refresh token check karke naya access + refresh token bana rahi hai
const refreshToken = async (req, res) => {
  try {
    // Get refresh token from cookie
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, error: "No refresh token provided" });
    }

    // verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
    } catch (err) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid Refresh Token" });
    }

    // find user with refresh token
    const user = await userModel.findById({
      _id: decoded.id,
      refreshToken: refreshToken,
    });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Refresh Token not found" });
    }

    // generate new token
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // set token in cookies
    setTokenCookies(res, newAccessToken, newRefreshToken);

    // set new refresh-token in db
    user.refreshToken = newRefreshToken;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const logout = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");

    res.status(200).json({
      success: true,
      msg: "Logged out sucessfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

module.exports = { register, login, getMe, refreshToken, logout };
