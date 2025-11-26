// src/features/admin/ProductsByType.jsx
import React, { useEffect, useState } from "react";
import axios from "../../services/axios";
import { useParams, Link } from "react-router-dom";

const ProductsByType = () => {
  const { typeId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingProductId, setEditingProductId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", description: "" });

  const [creating, setCreating] = useState(false);

  // State to hold product creation form data
  const [form, setForm] = useState({
    name: "",
    description: "",
    whatsappText: "",
    images: [], // Files selected
  });

  // State to hold the Category ID automatically fetched
  const [categoryId, setCategoryId] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/products/type/${typeId}`);
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch products by type", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products for the type
  useEffect(() => {
    fetchProducts();
    fetchTypeCategory();
    // ... fetch categoryId as you already have
  }, [typeId]);

  // Fetch the type to get its Category ID
  const fetchTypeCategory = async () => {
    try {
      const res = await axios.get(`/types/${typeId}`);
      // Assuming backend returns a type with 'category' field as ObjectId or populated object
      const category = res.data.category;
      // Handle both populated or just ID string
      setCategoryId(
        typeof category === "string" ? category : category?._id || ""
      );
    } catch (error) {
      console.error("Failed to fetch type category", error);
    }
  };

  // Start editing
  const startEditing = (product) => {
    setEditingProductId(product._id);
    setEditForm({ name: product.name, description: product.description });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingProductId(null);
    setEditForm({ name: "", description: "" });
  };

  // Handle input change for edit form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit product update
  const handleUpdateSubmit = async (e, productId) => {
    e.preventDefault();
    if (!editForm.name.trim()) {
      alert("Product name is required");
      return;
    }

    try {
      await axios.put(`/products/${productId}`, {
        name: editForm.name,
        description: editForm.description,
        // Add other fields if needed
      });

      cancelEditing();
      fetchProducts();
    } catch (error) {
      console.error("Failed to update product", error);
      alert("Failed to update product");
    }
  };

  // Delete product
  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await axios.delete(`/products/${productId}`);
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product", error);
      alert("Failed to delete product");
    }
  };

  // Form input handlers (exclude category since it's automatic)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, images: e.target.files }));
  };

  // Submit handler includes automatic categoryId
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("Product name is required");
      return;
    }

    setCreating(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("whatsappText", form.whatsappText);
      formData.append("type", typeId);
      // Append category ID automatically:
      if (categoryId) formData.append("category", categoryId);

      for (let i = 0; i < form.images.length; i++) {
        formData.append("images", form.images[i]);
      }

      await axios.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Reset form
      setForm({
        name: "",
        description: "",
        whatsappText: "",
        images: [],
      });

      // Refresh products list
      const res = await axios.get(`/products/type/${typeId}`);
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to create product", error);
      alert("Error creating product");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Products</h2>

      <form
        onSubmit={handleSubmit}
        className="mb-6 max-w-md space-y-4"
        encType="multipart/form-data"
      >
        <div>
          <label className="block mb-1 font-semibold" htmlFor="name">
            Product Name <span className="text-red-600">*</span>
          </label>
          <input
            id="name"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={form.description}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">
            Category ID (auto-filled)
          </label>
          <input
            type="text"
            value={categoryId}
            readOnly
            disabled
            className="border p-2 rounded w-full bg-gray-100 cursor-not-allowed"
            placeholder="Category id auto-filled from Type"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold" htmlFor="whatsappText">
            WhatsApp Text (optional)
          </label>
          <input
            id="whatsappText"
            name="whatsappText"
            value={form.whatsappText}
            onChange={handleChange}
            placeholder="Enter WhatsApp message text"
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold" htmlFor="images">
            Product Images
          </label>
          <input
            id="images"
            name="images"
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full"
            accept="image/*"
          />
        </div>

        <button
          type="submit"
          disabled={creating}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {creating ? "Creating..." : "Add Product"}
        </button>
      </form>

      {/* Products List */}
      {loading ? (
        <div>Loading products...</div>
      ) : products.length === 0 ? (
        <div>No products found for this type.</div>
      ) : (
        <ul className="space-y-6">
          {products.map((product) => (
            <li key={product._id} className="border rounded p-4">
              {editingProductId === product._id ? (
                <form
                  onSubmit={(e) => handleUpdateSubmit(e, product._id)}
                  className="space-y-2"
                >
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    className="border p-2 rounded w-full"
                    required
                  />
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                    className="border p-2 rounded w-full"
                    rows={3}
                  />
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="bg-gray-400 text-white px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h3 className="text-lg font-semibold">
                    <Link
                      to={`/admin/products/${product._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {product.name}
                    </Link>
                  </h3>
                  <p className="text-gray-600">{product.description}</p>
                  <div className="mt-2 flex space-x-4">
                    <button
                      onClick={() => startEditing(product)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                  {product.images && product.images.length > 0 && (
                    <div className="mt-4 flex space-x-2 overflow-x-auto">
                      {product.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`${product.name} image ${idx + 1}`}
                          className="h-20 w-20 object-cover rounded border"
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductsByType;
