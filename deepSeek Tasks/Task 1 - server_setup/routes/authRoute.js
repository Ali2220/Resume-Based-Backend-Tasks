const express = require("express");
const router = express.Router();
const { register, login, getMe, refreshToken, logout } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/getMe", authMiddleware, getMe);
router.post("/refresh-token", refreshToken);
router.post("/logout", authMiddleware, logout)
module.exports = router;
