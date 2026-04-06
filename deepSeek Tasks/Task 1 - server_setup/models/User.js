const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
  },
  password: {
    type: String,
    required: true,
    minLength: [6, "Password must be 6 characters long"],
    select: false
  },
}, {timestamps: true});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
