// routes/adminRoutes.js
const express = require("express");
const {
  getAllUsers,
  deleteUser,
  makeAdmin,
  getAdminDashboardData,
} = require("../controllers/adminController");
const { protect } = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");

const router = express.Router();

// Apply protect + admin check to all admin routes
router.use(protect, adminOnly);

// Dashboard data
router.get("/dashboard", getAdminDashboardData);

// GET all users
router.get("/users", getAllUsers);

// DELETE user by ID
router.delete("/users/:id", deleteUser);

// PUT promote user to admin
router.put("/users/:id/admin", makeAdmin);

module.exports = router;
