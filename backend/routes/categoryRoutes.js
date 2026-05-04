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

// Import multer middleware (adjust path as per your project structure)
const upload = require("../config/multer");

const router = express.Router();

router.get("/", getCategories);
router.get("/:id", getCategoryById);

module.exports = router;
