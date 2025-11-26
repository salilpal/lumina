// src/features/admin/TypesByCategory.jsx
import React, { useEffect, useState } from "react";
import axios from "../../services/axios";
import { useParams, useNavigate } from "react-router-dom";

const TypesByCategory = () => {
  const { categoryId } = useParams();
  const [types, setTypes] = useState([]);
  const [newTypeName, setNewTypeName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [category, setCategory] = useState(null);

  const [editingType, setEditingType] = useState(null);
  const [editTypeName, setEditTypeName] = useState("");
  const [editFile, setEditFile] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await axios.get(`/types?category=${categoryId}`);
        setTypes(res.data.types);
      } catch (error) {
        console.error("Failed to fetch types:", error);
        setTypes([]);
      }
    };

    const fetchCategory = async () => {
      try {
        const res = await axios.get(`/categories/${categoryId}`);
        setCategory(res.data);
      } catch (error) {
        console.error("Failed to fetch category:", error);
        setCategory(null);
      }
    };

    fetchTypes();
    fetchCategory();
  }, [categoryId]);

  // Add a type
  const handleCreateType = async (e) => {
    e.preventDefault();
    if (!newTypeName.trim()) return;

    const formData = new FormData();
    formData.append("name", newTypeName);
    formData.append("category", categoryId);
    if (selectedFile) formData.append("image", selectedFile);

    try {
      await axios.post("/types", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setNewTypeName("");
      setSelectedFile(null);
      const res = await axios.get(`/types?category=${categoryId}`);
      setTypes(res.data.types);
    } catch (error) {
      console.error("Failed to create type with image:", error);
      alert("Failed to create type");
    }
  };

  // Delete a type (backend should cascade and delete products!)
  const handleDeleteType = async (typeId) => {
    if (!window.confirm("Delete this type and all its products?")) return;
    try {
      await axios.delete(`/types/${typeId}`); // Backend: should handle cascading deletion
      const updated = await axios.get(`/types?category=${categoryId}`);
      setTypes(updated.data.types);
    } catch (error) {
      console.error("Failed to delete type (and its products):", error);
      alert("Failed to delete type");
    }
  };

  // Open Edit Type Modal
  const handleEditTypeClick = (type) => {
    setEditingType(type);
    setEditTypeName(type.name);
    setEditFile(null);
    setShowEditModal(true);
  };

  // Update Type handler
  const handleUpdateType = async (e) => {
    e.preventDefault();
    if (!editTypeName.trim() || !editingType) return;

    const formData = new FormData();
    formData.append("name", editTypeName);
    if (editFile) formData.append("image", editFile);
    formData.append("category", categoryId);

    try {
      await axios.put(`/types/${editingType._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setShowEditModal(false);
      setEditingType(null);
      setEditTypeName("");
      setEditFile(null);

      // Refresh type list
      const updated = await axios.get(`/types?category=${categoryId}`);
      setTypes(updated.data.types);
    } catch (error) {
      console.error("Failed to update type:", error);
      alert("Failed to update type");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">
        Types in Category: {category?.name || "Loading..."}
      </h2>

      {/* Add New Type Form */}
      <form onSubmit={handleCreateType} className="mb-6 space-y-3">
        <input
          value={newTypeName}
          onChange={(e) => setNewTypeName(e.target.value)}
          placeholder="New Type name"
          className="border px-3 py-2 rounded w-full"
          required
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
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Add Type
        </button>
      </form>

      {/* Type List */}
      <ul className="space-y-2">
        {types.length === 0 ? (
          <p className="italic text-gray-500">No types found.</p>
        ) : (
          types.map((type) => (
            <li
              key={type._id}
              className="border p-3 rounded flex items-center space-x-3"
            >
              {/* Show image if present */}
              {type.image && (
                <img
                  src={type.image}
                  alt={type.name}
                  className="h-12 w-12 rounded border object-cover"
                />
              )}

              {/* Type Name links to products */}
              <span
                className="flex-1 cursor-pointer hover:underline"
                onClick={() => navigate(`/admin/types/${type._id}/products`)}
                title={`View products in ${type.name}`}
              >
                {type.name}
              </span>

              {/* Edit button */}
              <button
                onClick={() => handleEditTypeClick(type)}
                className="bg-yellow-400 text-white px-3 py-1 rounded mr-1"
                title="Edit Type"
              >
                Edit
              </button>

              {/* Delete button */}
              <button
                onClick={() => handleDeleteType(type._id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
                title="Delete Type"
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>

      {/* Edit Type Modal (simple implementation) */}
      {showEditModal && editingType && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-10">
          <div className="bg-white rounded p-6 w-full max-w-sm relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-2 right-3 text-xl font-bold"
              title="Close"
            >
              ×
            </button>
            <h3 className="font-bold mb-3">Edit Type</h3>
            <form onSubmit={handleUpdateType} className="space-y-4">
              <input
                value={editTypeName}
                onChange={(e) => setEditTypeName(e.target.value)}
                placeholder="Type name"
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

export default TypesByCategory;
