// controllers/categoryController.js
const Category = require("../models/Category");
const Type = require("../models/Type");
const Product = require("../models/Product");
const { cloudinary } = require("../config/cloudinary");

exports.getCategories = async (req, res) => {
  const { search } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  const total = await Category.countDocuments(filter);

  const categories = await Category.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    categories,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
};

exports.getCategoryById = async (req, res) => {
  const category = await Category.findById(req.params.id);
  res.json(category);
};

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    const category = new Category({ name, image: imageUrl });
    await category.save();

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    let imageUrl = category.image;

    if (req.file) {
      imageUrl = req.file.path;
    }

    category.name = name || category.name;
    category.image = imageUrl;

    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  const catId = req.params.id;
  const types = await Type.find({ category: catId });
  const typeIds = types.map((t) => t._id);
  await Product.deleteMany({ type: { $in: typeIds } });
  await Type.deleteMany({ category: catId });
  await Category.findByIdAndDelete(catId);
  res.json({ message: "Category, types, and related products deleted." });
};
