// controllers/typeController.js
const Type = require("../models/Type");
const Product = require("../models/Product");
const { cloudinary } = require("../config/cloudinary");

exports.getTypes = async (req, res) => {
  const { search, category } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  if (category) {
    filter.category = category;
  }

  const total = await Type.countDocuments(filter);

  const types = await Type.find(filter)
    .populate("category")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    types,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
};

exports.getTypeById = async (req, res) => {
  const type = await Type.findById(req.params.id).populate("category");
  res.json(type);
};

exports.getTypesByCategory = async (req, res) => {
  const { categoryId } = req.params;
  const types = await Type.find({ category: categoryId });
  res.json(types);
};

exports.createType = async (req, res) => {
  try {
    const { name, category } = req.body;
    
    // Multer handles the upload; we just grab the path
    const imageUrl = req.file ? req.file.path : null;

    const type = new Type({ 
      name, 
      category, // Ensure this is a 24-char Category ID from Postman
      image: imageUrl 
    });
    
    await type.save();
    res.status(201).json(type);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateType = async (req, res) => {
  try {
    const { name, category } = req.body;
    const type = await Type.findById(req.params.id);
    
    if (!type) return res.status(404).json({ message: "Type not found" });

    let imageUrl = type.image;
    if (req.file) {
      imageUrl = req.file.path; // Simply use the new path from Multer
    }

    type.name = name || type.name;
    type.category = category || type.category;
    type.image = imageUrl;

    await type.save();
    res.json(type);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteType = async (req, res) => {
  const typeId = req.params.id;
  await Product.deleteMany({ type: typeId });
  await Type.findByIdAndDelete(typeId);
  res.json({ message: "Type and associated products deleted" });
};
