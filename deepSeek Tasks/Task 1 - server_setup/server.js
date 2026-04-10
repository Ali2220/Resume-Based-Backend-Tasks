require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/db");
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute")
const productRoute = require("./routes/productRoute")
const cookieParser = require("cookie-parser");
const path = require('path')

connectDB();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/product", productRoute);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
