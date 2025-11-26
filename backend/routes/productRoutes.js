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
const { adminOnly } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", getProducts);

router.get("/type/:typeId", getProductsByType);

router.get("/slug/:slug", getProductBySlug);

router.get("/:id", getProductById);

router.post("/", protect, adminOnly, upload.array("images", 5), createProduct);
router.put(
  "/:id",
  protect,
  adminOnly,
  upload.array("images", 5),
  updateProduct
);
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;
