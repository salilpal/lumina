// src/features/admin/CategoryManager.jsx
import React, { useEffect, useState } from "react";
import axios from "../../services/axios";
import { useNavigate } from "react-router-dom";

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);

  // Edit state
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState("");
  const [editFile, setEditFile] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const navigate = useNavigate();

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await axios.get("/categories");
      setCategories(res.data.categories);
    } catch (error) {
      console.error("Failed to fetch categories", error);
      alert("Failed to load categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  // Create with image
  const createCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setAddingCategory(true);
    const formData = new FormData();
    formData.append("name", name);
    if (selectedFile) formData.append("image", selectedFile);
    try {
      await axios.post("/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setName("");
      setSelectedFile(null);
      fetchCategories();
    } catch (error) {
      console.error("Failed to create category", error);
      alert("Failed to create category");
    } finally {
      setAddingCategory(false);
    }
  };

  // Edit modal open
  const handleEditCategoryClick = (category) => {
    setEditingCategory(category);
    setEditName(category.name);
    setEditFile(null);
    setShowEditModal(true);
  };

  // Update category
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editName.trim() || !editingCategory) return;
    const formData = new FormData();
    formData.append("name", editName);
    if (editFile) formData.append("image", editFile);
    try {
      await axios.put(`/categories/${editingCategory._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setShowEditModal(false);
      setEditingCategory(null);
      setEditName("");
      setEditFile(null);
      fetchCategories();
    } catch (error) {
      console.error("Failed to update category", error);
      alert("Failed to update category");
    }
  };

  // Delete (cascade on backend)
  const deleteCategory = async (id) => {
    if (
      window.confirm("Delete this category and all its types and products?")
    ) {
      try {
        await axios.delete(`/categories/${id}`); // Backend must cascade delete: types + products of those types!
        fetchCategories();
      } catch (error) {
        console.error("Failed to delete category", error);
        alert("Failed to delete category");
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Manage Categories</h2>
      {/* Add Category Form */}
      <form
        onSubmit={createCategory}
        className="mb-6 space-y-2 max-w-md"
        encType="multipart/form-data"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          className="border px-3 py-2 rounded w-full"
          disabled={addingCategory}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="border p-2 rounded w-full"
        />
        {selectedFile && (
          <p className="text-sm text-gray-600">
            Selected file: {selectedFile.name}
          </p>
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={!name.trim() || addingCategory}
        >
          {addingCategory ? "Adding..." : "Add"}
        </button>
      </form>

      {/* Category List */}
      {loadingCategories ? (
        <p>Loading categories...</p>
      ) : categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <ul className="space-y-4">
          {categories.map((cat) => (
            <li
              key={cat._id}
              className="border rounded p-4 flex items-center space-x-4"
            >
              {/* Image display */}
              {cat.image && (
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-12 w-12 rounded border object-cover"
                />
              )}

              <span
                className="flex-1 font-semibold cursor-pointer text-blue-600 hover:underline"
                onClick={() => navigate(`/admin/categories/${cat._id}/types`)}
              >
                {cat.name}
              </span>
              <button
                onClick={() => handleEditCategoryClick(cat)}
                className="bg-yellow-400 text-white px-3 py-1 rounded mr-1"
                title="Edit category"
              >
                Edit
              </button>
              <button
                onClick={() => deleteCategory(cat._id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                title="Delete category"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Edit Category Modal */}
      {showEditModal && editingCategory && (
        <div className="fixed inset-0 bg-black/25 flex justify-center items-center z-10">
          <div className="bg-white rounded p-6 w-full max-w-sm relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-2 right-3 text-xl font-bold"
              title="Close"
            >
              ×
            </button>
            <h3 className="font-bold mb-3">Edit Category</h3>
            <form onSubmit={handleUpdateCategory} className="space-y-4">
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Category name"
                className="border px-3 py-2 rounded w-full"
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setEditFile(e.target.files[0])}
                className="border p-2 rounded w-full"
              />
              {editFile && (
                <p className="text-sm text-gray-600">
                  Selected file: {editFile.name}
                </p>
              )}
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded w-full"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
