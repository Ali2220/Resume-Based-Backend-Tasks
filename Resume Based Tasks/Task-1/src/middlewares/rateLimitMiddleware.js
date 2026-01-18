const { rateLimit } = require("express-rate-limit");

function limit() {
  const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    limit: 5,
    keyGenerator: (req) => {
      return req.user?._id?.toString() || req.ip
    },
    message: {
      success: false,
      message: "Too many requests, please try again later",
    },
    standardHeaders: true,
    legacyHeaders: false
  });

  return limiter;
}

module.exports = limit;
