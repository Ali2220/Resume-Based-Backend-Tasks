const jwt = require("jsonwebtoken");
const userModel = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        error: "No token. Unauthorized!",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await userModel.findById(decoded.id);

    req.user = user;
    next();
  } catch (err) {
    res.status(500).json(`Error occured in authMiddleware: ${err.name}`);
  }
};

module.exports = authMiddleware;
