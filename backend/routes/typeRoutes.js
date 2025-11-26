// routes/typeRoutes.js
const express = require("express");
const {
  createType,
  getTypes,
  getTypeById,
  updateType,
  deleteType,
} = require("../controllers/typeController");
const { protect } = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");
const upload = require("../config/multer"); // your multer middleware

const router = express.Router();

router.get("/", getTypes);
router.get("/:id", getTypeById);
router.post("/", protect, adminOnly, upload.single("image"), createType);
router.put("/:id", protect, adminOnly, upload.single("image"), updateType);
router.delete("/:id", protect, adminOnly, deleteType);

module.exports = router;
