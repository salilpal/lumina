// src/pages/AllCategories.jsx
import React, { useEffect, useState } from "react";
import { getCategories } from "../services/categoryService";
import { Link } from "react-router-dom";

const AllCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data.categories);
      } catch (err) {
        console.error("Failed to fetch all categories:", err);
      }
    };

    fetchAllCategories();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">All Categories</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Link
            to={`/categories/${category.slug}/types`}
            key={category._id}
            className="p-4 border rounded shadow hover:shadow-lg transition block text-center"
          >
            {/* The image here is added later. */}
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-28 object-cover rounded mb-2"
            />
            <p className="text-lg font-semibold">{category.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllCategories;
