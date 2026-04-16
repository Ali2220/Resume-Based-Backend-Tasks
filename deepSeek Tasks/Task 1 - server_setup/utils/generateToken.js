const jwt = require("jsonwebtoken");

const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_ACCESS_KEY, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE || "15m",
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_KEY, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE || "7d",
  });
};

module.exports = { generateAccessToken, generateRefreshToken };
