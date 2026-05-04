// routes/productRoutes.js
const express = require("express");
const upload = require("../config/multer");
const {
  createProduct,
  getProducts,
  getProductById,
  getProductBySlug,
  getProductsByType,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", getProducts);

router.get("/type/:typeId", getProductsByType);

router.get("/slug/:slug", getProductBySlug);

router.get("/:id", getProductById);

module.exports = router;
