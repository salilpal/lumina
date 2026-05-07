// src/pages/TypeProducts.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProductsByType,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";
import { getTypeBySlug } from '../services/typeService'
import { getTypeById } from "../services/typeService";
import ProductCard from "../components/product/ProductCard";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaTimes,
  FaArrowLeft,
  FaWhatsapp,
} from "react-icons/fa";

const TypeProducts = () => {
  const { typeSlug } = useParams(); // URL still has the slug
  const [products, setProducts] = useState([]);
  const [currentType, setCurrentType] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [images, setImages] = useState([]);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    countInStock: "",
    whatsappText: "I'm interested in this product!",
  });

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);

      // STEP 1: Get the Type details by the slug to find its _id
      const typeData = await getTypeBySlug(typeSlug); 
      setCurrentType(typeData);

      // STEP 2: Use that ID to fetch products from the new logic
      if (typeData?._id) {
        const prodData = await getProductsByType(typeData._id);
        setProducts(prodData);
      }
    } catch (error) {
      console.error("Error fetching products by type:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [typeSlug]);

  const handleOpenModal = (prod = null) => {
    if (prod) {
      setEditingProduct(prod);
      setForm({
        name: prod.name,
        price: prod.price,
        description: prod.description,
        countInStock: prod.countInStock,
        whatsappText: prod.whatsappText || "",
      });
    } else {
      setEditingProduct(null);
      setForm({
        name: "",
        price: "",
        description: "",
        countInStock: "",
        whatsappText: "",
      });
    }
    setImages([]);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // 1. Guard Clause: Prevent crash if currentType isn't loaded
  if (!currentType || !currentType._id) {
    alert("Error: Category/Type data is still loading. Please try again in a moment.");
    return;
  }

  setProcessing(true);

  const formData = new FormData();
  formData.append("name", form.name);
  formData.append("price", form.price);
  formData.append("description", form.description);
  formData.append("countInStock", form.countInStock);
  formData.append("whatsappText", form.whatsappText);
  
  // Now safe to access _id
  formData.append("type", currentType._id);
  
  // 2. Defensive check for category
  // If your Type model populates the category ID, use that.
  const categoryId = currentType.category?._id || currentType.category;
  formData.append("category", categoryId); 

  // Append multiple images
  if (images && images.length > 0) {
    Array.from(images).forEach((img) => formData.append("images", img));
  }

  try {
    if (editingProduct) {
      await updateProduct(editingProduct._id, formData);
    } else {
      await createProduct(formData);
    }
    
    // 3. Reset form states after success
    setIsModalOpen(false);
    setImages([]); // Clear files from memory
    fetchData(); 
    
  } catch (err) {
    // Provide better error feedback
    const errorMsg = err.response?.data?.message || err.message || "Failed to save product";
    alert("Error: " + errorMsg);
  } finally {
    setProcessing(false);
  }
};

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        fetchData();
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  if (loading)
    return (
      <div className="text-center py-20 font-light tracking-widest uppercase">
        Loading Inventory...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-4xl font-light tracking-tight text-gray-900 capitalize">
            {currentType?.name || typeSlug}
          </h1>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 transition flex items-center gap-2 w-fit"
        >
          <FaPlus /> Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 text-lg">
            No products found in this category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product) => (
            <div key={product._id} className="relative group">
              <ProductCard product={product} />

              {/* Overlay Management Buttons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleOpenModal(product)}
                  className="p-3 bg-white text-blue-600 rounded-full shadow-xl hover:bg-blue-600 hover:text-white transition"
                >
                  <FaEdit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="p-3 bg-white text-red-600 rounded-full shadow-xl hover:bg-red-600 hover:text-white transition"
                >
                  <FaTrash size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl my-auto">
            <div className="flex justify-between items-center p-8 border-b">
              <h2 className="text-2xl font-bold">
                {editingProduct ? "Update Product" : "New Lighting Product"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-800"
              >
                <FaTimes size={24} />
              </button>
            </div>
            <form
              onSubmit={handleSubmit}
              className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="md:col-span-2">
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  className="w-full border-b-2 border-gray-100 p-2 focus:border-blue-500 outline-none text-lg"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  className="w-full border-b-2 border-gray-100 p-2 focus:border-blue-500 outline-none"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  className="w-full border-b-2 border-gray-100 p-2 focus:border-blue-500 outline-none"
                  value={form.countInStock}
                  onChange={(e) =>
                    setForm({ ...form, countInStock: e.target.value })
                  }
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-blue-500 outline-none h-24"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                  Upload Images
                </label>
                <input
                  type="file"
                  multiple
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-gray-100 file:text-gray-700 file:font-bold border-2 border-dashed border-gray-100 p-4 rounded-2xl"
                  onChange={(e) => setImages(e.target.files)}
                />
              </div>

              <div className="md:col-span-2 pt-4">
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-black transition-all active:scale-[0.98] disabled:bg-gray-400"
                >
                  {processing
                    ? "Uploading to Catalog..."
                    : editingProduct
                      ? "Save Changes"
                      : "Publish Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TypeProducts;
