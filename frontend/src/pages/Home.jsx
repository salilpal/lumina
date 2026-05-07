// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import heroVideo from "../assets/video2.mp4";
import { getCategories } from "../services/categoryService";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        // Limit to top 5 categories
        setCategories(data.categories.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="w-full bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[80vh] w-full overflow-hidden">
        <video
          src={heroVideo}
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
        {/* Overlay for better text visibility if you add any */}
        <div className="absolute inset-0 bg-black/20 flex flex-col justify-center items-center text-white">
          <h1 className="text-5xl md:text-7xl font-light tracking-tighter mb-4">LUMINA</h1>
          <p className="text-lg md:text-xl font-light opacity-90 tracking-widest uppercase">Illuminating Your Space</p>
        </div>
      </div>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-12 border-b border-gray-200 pb-6">
          <div>
            <h2 className="text-4xl font-light text-gray-900 tracking-tight">Collections</h2>
            <p className="text-gray-500 mt-2">Explore our curated lighting categories</p>
          </div>
          <button
            onClick={() => navigate("/categories")}
            className="text-sm font-bold uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors border-b-2 border-blue-600 pb-1"
          >
            Show All Categories
          </button>
        </div>

        {/* Categories Grid - Responsive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, idx) => (
            <div
              key={category._id}
              className={`group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer ${
                idx === 0 ? "lg:col-span-2 lg:row-span-2 h-[600px]" : "h-[300px]"
              }`}
              onClick={() => navigate(`/categories/${category.slug}/types`)}
            >
              {/* Image with Zoom Effect */}
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No Image Available</span>
                </div>
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

              {/* Category Name */}
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <h3 className="text-white text-2xl font-semibold tracking-wide transform group-hover:-translate-y-2 transition-transform duration-300">
                  {category.name}
                </h3>
                <p className="text-blue-300 text-sm font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Explore Collection →
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Footer-like Spacer */}
      <div className="h-20 bg-white"></div>
    </div>
  );
};

export default Home;