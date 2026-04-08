const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const { createProduct, getMyProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController')
const router = express.Router()


router.post("/", authMiddleware, createProduct)
router.get("/me", authMiddleware, getMyProducts)
router.get("/:id", authMiddleware, getProductById)
router.put("/:id", authMiddleware, updateProduct)
router.delete("/:id", authMiddleware, deleteProduct)

module.exports = router