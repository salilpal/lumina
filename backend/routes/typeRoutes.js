const express = require("express");
const {
  createType,
  getTypes,
  getTypeById,
  getTypesByCategory, // Add this
  updateType,
  deleteType,
} = require("../controllers/typeController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../config/multer");

const router = express.Router();

// Public Routes
router.get("/", getTypes);
router.get("/:id", getTypeById);
router.get("/category/:categoryId", getTypesByCategory); // Add this route

// Protected Management Routes (The missing piece causing the 404)
router.post("/", protect, upload.single("image"), createType);
router.put("/:id", protect, upload.single("image"), updateType);
router.delete("/:id", protect, deleteType);

module.exports = router;