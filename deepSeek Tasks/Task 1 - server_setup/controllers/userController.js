/** @type {import("mongoose").Model<any>} */
const userModel = require("../models/User");
const bcrypt = require("bcryptjs");

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await userModel.find();
    res.status(200).json({
      success: true,
      count: allUsers.length,
      data: allUsers,
    });
  } catch (err) {
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    if (req.user.id !== req.params.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "You cannot access someone else data",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fetch user data",
      data: user,
    });
  } catch (err) {}
};

const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: "Name or email is required",
      });
    }

    const existingUser = await userModel.findOne({
      email: email.toLowerCase(),
      _id: { $ne: req.user.id },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "Email already exits.",
      });
    }

    const updateUser = await userModel.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true, runValidators: true },
    );

    res.status(200).json({
      success: true,
      message: "User data updated",
      data: updateUser,
    });
  } catch (err) {
    res.status(200).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Please provide old-password and new-password",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: "New Password length must be atleast 6 characters long",
      });
    }

    const user = await userModel.findById(req.user.id).select("+password");

    const matchedPassword = await bcrypt.compare(oldPassword, user.password);

    if (!matchedPassword) {
      return res.status(400).json({
        success: false,
        error: "Old password incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        error: "Password is required to delete your account.",
      });
    }

    // get user with password field
    const user = await userModel
      .findByIdAndDelete(req.user.id)
      .select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "User not found!",
      });
    }

    // Verify password
    const matchedPassword = await bcrypt.compare(password, user.password);

    if (!matchedPassword) {
      return res.status(401).json({
        success: false,
        error: "Incorrect Password! Account deletion Cancelled.",
      });
    }

    // delete user
    await userModel.findByIdAndDelete(req.user.id);

    res.status(200).json({
      success: true,
      message: "User deleted Successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateProfile,
  changePassword,
  deleteAccount,
};
