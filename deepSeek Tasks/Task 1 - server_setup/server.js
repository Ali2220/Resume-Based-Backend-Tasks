require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/db");
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute")
const cookieParser = require("cookie-parser");

connectDB();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
