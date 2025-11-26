// routes/categoryRoutes.js
const express = require("express");
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect } = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");

// Import multer middleware (adjust path as per your project structure)
const upload = require("../config/multer");

const router = express.Router();

router.get("/", getCategories);
router.get("/:id", getCategoryById);

// Add upload.single('image') middleware to handle single file upload with field name 'image'
router.post("/", protect, adminOnly, upload.single("image"), createCategory);
router.put("/:id", protect, adminOnly, upload.single("image"), updateCategory);

router.delete("/:id", protect, adminOnly, deleteCategory);

module.exports = router;
