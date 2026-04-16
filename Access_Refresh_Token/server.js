require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoutes = require('./routes/auth')

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes)

mongoose.connect("mongodb://127.0.0.1:27017/auth-demo")
  .then(() => console.log("MongoDB connected"));

app.listen(3000, () => console.log("Server running on 3000"));