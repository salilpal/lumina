import React from "react";

const ProductFilter = ({ categories, selectedCategory, onChange }) => {
  return (
    <div className="mb-6">
      <label className="block font-medium mb-2">Filter by Category:</label>
      <select
        value={selectedCategory}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border px-3 py-2 rounded-md"
      >
        <option value="">All</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProductFilter;
