// controllers/adminController.js
const User = require("../models/User");
const Product = require("../models/Product");
const Category = require("../models/Category");

exports.getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const total = await User.countDocuments();
  const users = await User.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select("-password");

  res.json({
    users,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
};

exports.makeAdmin = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  user.isAdmin = true;
  await user.save();
  res.json({ message: "User promoted to admin." });
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "User not found" });

  await user.deleteOne();
  res.json({ message: "User deleted successfully." });
};

exports.getAdminDashboardData = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();

    res.json({
      totalUsers,
      totalProducts,
      totalCategories,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
};
