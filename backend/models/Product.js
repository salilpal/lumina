// models/Product.js
const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    description: String,
    images: [String],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    type: { type: mongoose.Schema.Types.ObjectId, ref: "Type" },
    whatsappText: String,
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  if (!this.isModified("name")) return next();
  this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

module.exports = mongoose.model("Product", productSchema);
