/** @type {import("mongoose").Model<any>} */
const productModel = require("../models/Product");

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        error: "Name and price are required fields",
      });
    }

    const newProduct = await productModel.create({
      name,
      description,
      price,
      category,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: newProduct,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Interval Server Error",
    });
  }
};

const getMyProducts = async (req, res) => {
  try {
    const products = await productModel
      .find({ user: req.user.id })
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const findProduct = await productModel.findById(req.params.id);

    if (!findProduct) {
      return res.status(404).json({
        success: false,
        error: "Product Not found",
      });
    }

    res.status(200).json({
      success: true,
      product: findProduct,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product Not found",
      });
    }

    if (product.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: "You are not authorized to update this product",
      });
    }

    // field update krdo agr frontend se update ho rhi hai, wrna wohi rehne do.
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      updatedProduct: updatedProduct,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    if (product.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: "You are not authorized to delete this product",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product Delete successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

// public route
const getAllProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        error: "Page and limit cannot be negative",
      });
    }

    let filter = {};

    if (req.query.category) {
      let allowedCategories = ["electronics", "clothing", "books", "other"];

      if (allowedCategories.includes(req.query.category)) {
        filter.category = req.query.category;
      } else {
        return res.status(400).json({
          success: false,
          error: "Invalid Category",
        });
      }
    }

    if (req.query.search) {
      filter.name = {
        $regex: req.query.search,
        $options: "i",
      };
    }

    let sort = {};
    let sortBy = req.query.sort || "newest";

    switch (sortBy) {
      case "price_asc":
        sort = { price: 1 };
        break;
      case "price_desc":
        sort = { price: -1 };
        break;
      case "newest":
        sort = { createdAt: -1 };
        break;
      case "oldest":
        sort = { createdAt: 1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    const products = await productModel
      .find(filter)
      .sort(sort)
      .skip(skip)
      .populate("user", "name email");

    const total = await productModel.countDocuments(filter);

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    res.status(200).json({
      success: true,
      count: products.length,
      pagination: {
        total,
        page,
        pages: totalPages,
        limit,
        hasNext,
        hasPrev,
      },
      data: products,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

const uploadProductImage = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product Not found",
      });
    }

    if (product.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "You are not authorized to upload image for this product",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Please upload an image",
      });
    }

    let imageUrl = `/uploads/${req.file.filename}`;
    product.imageUrl = imageUrl;
    await product.save();

    res.status(200).json({
      success: true,
      message: "Image Uploaded Successfully",
      data: {
        product,
      },
    });
  } catch (err) {}
};

module.exports = {
  createProduct,
  getMyProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllProducts,
  uploadProductImage,
};
