const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function authMiddleware(req, res, next) {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, "shh");
    const user = await User.findById(decoded.id);
    req.user = user;
    console.log(user);
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
module.exports = authMiddleware