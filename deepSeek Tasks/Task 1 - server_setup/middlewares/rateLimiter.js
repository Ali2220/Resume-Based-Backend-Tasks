const rateLimit = require("express-rate-limit");

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each ip to 100 request in 15 mins
  message: {
    success: false,
    error: "Too many requests from this IP, please try again after 15 minutes",
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  skipSuccessfulRequests: false, // // Count all requests
});

const authLimiter = rateLimit({
  WindowMs: 5 * 60 * 60, // 5 minutes
  max: 5,
  message: {
    success: false,
    error: "Too many authentication attempts, please try again after 5 minutes",
  },
  skipSuccessfulRequests: true,
});

module.exports = { globalLimiter, authLimiter };
