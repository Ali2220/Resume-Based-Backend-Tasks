const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const adminMiddleware = require('../middlewares/adminMiddleware')
const { getAllUsers, getUserById, updateProfile, changePassword, deleteAccount } = require('../controllers/userController')
const router = express.Router()

router.get("/", authMiddleware, adminMiddleware, getAllUsers) //saray users sirf admin get kr skta hai, or koi nhi.
router.get("/:id", authMiddleware, getUserById)
router.put("/profile", authMiddleware, updateProfile)
router.put("/change-password", authMiddleware, changePassword)
router.delete('/delete', authMiddleware, deleteAccount)

module.exports = router