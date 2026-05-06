const express = require("express");
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../config/multer");

const router = express.Router();

// Public Routes
router.get("/", getCategories);
router.get("/:id", getCategoryById);

// Protected Management Routes (Add these back!)
router.post("/", protect, upload.single("image"), createCategory);
router.put("/:id", protect, upload.single("image"), updateCategory);
router.delete("/:id", protect, deleteCategory);

module.exports = router;