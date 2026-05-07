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

// Public Routes
router.get("/", getProducts);
router.get("/type/:typeId", getProductsByType);
router.get("/slug/:slug", getProductBySlug);
router.get("/:id", getProductById);

// Protected Routes (Require JWT)
// Note: We use upload.single("image") to handle the file from Postman
router.post("/", upload.array("images", 5), createProduct);
router.put("/:id", protect, upload.single("image"), updateProduct);
router.delete("/:id", protect, deleteProduct);

module.exports = router;