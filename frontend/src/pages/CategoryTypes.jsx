// src/pages/CategoryTypes.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCategories } from "../services/categoryService";
// Ensure these are imported from your typeService or updated categoryService
import { 
  getTypesByCategory, 
  createType, 
  updateType, 
  deleteType 
} from "../services/typeService"; 
import { FaEdit, FaTrash, FaPlus, FaTimes, FaArrowLeft } from "react-icons/fa";

const CategoryTypes = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [types, setTypes] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [processing, setProcessing] = useState(false);

  const fetchTypes = async () => {
    try {
      setLoading(true);
      const catData = await getCategories();
      const found = catData.categories.find((cat) => cat.slug === slug);

      if (found) {
        setCurrentCategory(found);
        const typesData = await getTypesByCategory(found._id);
        setTypes(typesData.types || typesData);
      }
    } catch (err) {
      console.error("Error fetching types", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, [slug]);

  const handleOpenModal = (type = null) => {
    if (type) {
      setEditingType(type);
      setName(type.name);
    } else {
      setEditingType(null);
      setName("");
    }
    setImage(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    
    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", currentCategory._id); // Essential link
    if (image) formData.append("image", image);

    try {
      if (editingType) {
        await updateType(editingType._id, formData);
      } else {
        await createType(formData);
      }
      setIsModalOpen(false);
      fetchTypes();
    } catch (err) {
      alert("Action failed: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this type? All associated products will also be removed.")) {
      try {
        await deleteType(id);
        fetchTypes();
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  if (loading) return <div className="text-center py-20 font-light text-gray-500">Updating catalog...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Navigation Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate("/categories")}
          className="p-2 hover:bg-gray-100 rounded-full transition text-gray-600"
        >
          <FaArrowLeft />
        </button>
        <div>
          <h1 className="text-3xl font-light text-gray-900">
            {currentCategory?.name} <span className="text-gray-400">/ Types</span>
          </h1>
        </div>
      </div>

      <div className="flex justify-between items-center mb-10">
        <p className="text-gray-500">Manage sub-categories for {currentCategory?.name}</p>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-full hover:bg-gray-800 transition shadow-lg"
        >
          <FaPlus size={12} /> Add New Type
        </button>
      </div>

      {types.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-3xl">
          <p className="text-gray-400">No types found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {types.map((type) => (
            <div
              key={type._id}
              className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div 
                className="cursor-pointer"
                onClick={() => navigate(`/types/${type.slug}/products`)}
              >
                <img
                  src={type.image || "https://via.placeholder.com/300"}
                  alt={type.name}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="p-5">
                  <h2 className="text-lg font-bold text-gray-800">{type.name}</h2>
                  <p className="text-xs text-blue-600 font-bold uppercase mt-1 tracking-widest">View Products →</p>
                </div>
              </div>

              {/* Admin Actions */}
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); handleOpenModal(type); }}
                  className="p-2 bg-white/90 backdrop-blur text-blue-600 rounded-lg shadow hover:bg-blue-600 hover:text-white transition"
                >
                  <FaEdit size={14} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(type._id); }}
                  className="p-2 bg-white/90 backdrop-blur text-red-600 rounded-lg shadow hover:bg-red-600 hover:text-white transition"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Type Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">{editingType ? "Edit Type" : "Create New Type"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Type Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Modern Chandeliers"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Display Image</label>
                <div className="border-2 border-dashed border-gray-100 p-4 rounded-xl text-center hover:bg-gray-50 transition">
                  <input
                    type="file"
                    className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-gray-900 file:text-white hover:file:bg-gray-700"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={processing}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all active:scale-[0.98] disabled:bg-gray-300"
              >
                {processing ? "Saving..." : editingType ? "Update Type" : "Create Type"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryTypes;