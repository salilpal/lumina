// models/Product.js
const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, "Please enter product name"], 
      trim: true 
    },
    slug: { 
      type: String, 
      unique: true 
    },
    description: { 
      type: String, 
      required: [true, "Please enter product description"] 
    },
    price: { 
      type: Number, 
      required: [true, "Please enter product price"],
      default: 0
    },
    countInStock: { 
      type: Number, 
      required: [true, "Please enter stock count"],
      default: 0 
    },
    images: [{ type: String }],
    category: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Category",
      required: [true, "Product must belong to a category"]
    },
    type: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Type" 
    },
    whatsappText: String,
  },
  { timestamps: true }
);

// Middleware to generate slug from name
productSchema.pre("save", function (next) {
  if (!this.isModified("name")) return next();
  this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

module.exports = mongoose.model("Product", productSchema);