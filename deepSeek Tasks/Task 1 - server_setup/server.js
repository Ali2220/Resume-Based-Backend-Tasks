require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/db");
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const path = require("path");
const morgan = require("morgan");
const config = require("./config/env");
const cors = require('cors');
const { authLimiter, globalLimiter } = require("./middlewares/rateLimiter");

connectDB();

// Middlewares
app.use(helmet());

app.use(cors({
  origin: config.clientUrl,
  credentials: true,  // Allow cookies to be sent
  optionsSuccessStatus: 200
}));

if (config.isDevelopment) {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(globalLimiter)

// Routes
app.use("/api/auth", authLimiter, authRoute);
app.use("/api/user", userRoute);
app.use("/api/product", productRoute);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
