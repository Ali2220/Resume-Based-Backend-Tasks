const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const {
  getAllUsers,
  getUserById,
  updateProfile,
  changePassword,
  deleteAccount,
} = require("../controllers/userController");
const rateLimit = require("express-rate-limit");
const router = express.Router();

const passwordChangeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    error: "Too many password change attempts. Please try again after an hour.",
  },
});

const deleteAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    error:
      "Too many delete account attempts. Please try again after an hour.",
  },
});

router.get("/", authMiddleware, adminMiddleware, getAllUsers); // saray users sirf admin get kr skta hai, or koi nhi.
router.get("/:id", authMiddleware, getUserById);
router.put("/profile", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, passwordChangeLimiter, changePassword);
router.delete("/delete", authMiddleware, deleteAccountLimiter, deleteAccount);

module.exports = router;
