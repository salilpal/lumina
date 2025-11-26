// src/features/products/ProductCreate.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createProduct } from "./productSlice";
import { useNavigate } from "react-router-dom";

const ProductCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    image: "",
    stock: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createProduct(form)).unwrap();
      navigate("/admin/products");
    } catch (err) {
      alert("Error creating product");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Create Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Product Name"
          className="w-full border p-2 rounded"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="price"
          placeholder="Price"
          type="number"
          className="w-full border p-2 rounded"
          value={form.price}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          className="w-full border p-2 rounded"
          value={form.description}
          onChange={handleChange}
        />
        <input
          name="category"
          placeholder="Category ID"
          className="w-full border p-2 rounded"
          value={form.category}
          onChange={handleChange}
        />
        <input
          name="stock"
          placeholder="Stock Quantity"
          type="number"
          className="w-full border p-2 rounded"
          value={form.stock}
          onChange={handleChange}
        />
        <input
          name="image"
          placeholder="Image URL"
          className="w-full border p-2 rounded"
          value={form.image}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          Create Product
        </button>
      </form>
    </div>
  );
};

export default ProductCreate;
