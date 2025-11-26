// models/Type.js
const mongoose = require("mongoose");
const slugify = require("slugify");

const typeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    image: { type: String }, // add this field for image URL
  },
  { timestamps: true }
);

typeSchema.pre("save", function (next) {
  if (!this.isModified("name")) return next();
  this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

module.exports = mongoose.model("Type", typeSchema);
