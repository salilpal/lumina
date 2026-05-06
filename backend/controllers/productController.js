// controllers/productController.js
const Product = require("../models/Product");
const { cloudinary } = require("../config/cloudinary");

exports.getProducts = async (req, res) => {
  const { search, category, type } = req.query;
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

  if (type) {
    filter.type = type;
  }

  const total = await Product.countDocuments(filter);

  const products = await Product.find(filter)
    .populate("category type")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    products,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
};

exports.getProductsByType = async (req, res) => {
  const { typeId } = req.params;
  const products = await Product.find({ type: typeId }).populate(
    "category type",
  );
  res.json(products);
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate("category type");
  res.json(product);
};

exports.getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ slug }).populate("category type");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      category,
      type,
      countInStock,
      whatsappText,
    } = req.body;

    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map((file) => file.path);
    } else if (req.file) {
      // Fallback if you used upload.single in the route
      imageUrls = [req.file.path];
    }

    const product = new Product({
      name,
      price: Number(price), // Ensure it's a number
      description,
      images: imageUrls,
      category,
      type,
      countInStock: Number(countInStock) || 0,
      whatsappText,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      category,
      type,
      countInStock,
      whatsappText,
    } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let imageUrls = product.images;

    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map((file) => file.path);
    } else if (req.file) {
      imageUrls = [req.file.path];
    }

    product.name = name || product.name;
    product.price = price !== undefined ? Number(price) : product.price;
    product.description = description || product.description;
    product.images = imageUrls;
    product.category = category || product.category;
    product.type = type || product.type;
    product.countInStock =
      countInStock !== undefined ? Number(countInStock) : product.countInStock;
    product.whatsappText = whatsappText || product.whatsappText;

    await product.save();

    res.json(product);
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
};
