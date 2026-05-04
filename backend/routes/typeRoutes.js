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
const upload = require("../config/multer"); // your multer middleware

const router = express.Router();

router.get("/", getTypes);
router.get("/:id", getTypeById);

module.exports = router;
