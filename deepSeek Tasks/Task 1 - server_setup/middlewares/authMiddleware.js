const jwt = require("jsonwebtoken");
const userModel = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized! No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY)

    const user = await userModel.findById(decoded.id)

    if(!user){
      return res.status(401).json({
        success: false,
        error: "User no longer exists or token invalid"
      })
    }

    req.user = user
    next()

  } catch (err) {
    res.status(500).json(`Error occured in authMiddleware: ${err.name}`);
  }
};

module.exports = authMiddleware;
