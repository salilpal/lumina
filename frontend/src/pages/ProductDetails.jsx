// src/pages/ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductBySlug } from "../services/productService";
import { FaWhatsapp, FaArrowLeft, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import Loader from "../components/common/Loader";

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setLoading(true);
    getProductBySlug(slug)
      .then((data) => {
        setProduct(data);
        setActiveImage(0);
      })
      .catch((err) => console.error("Error loading product", err))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleWhatsApp = () => {
    const phoneNumber = "91XXXXXXXXXX"; // Replace with your actual number
    const customText = product.whatsappText || `I'm interested in the ${product.name}. Please provide more details.`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(customText)}`;
    window.open(url, "_blank");
  };

  if (loading) return <Loader />;
  if (!product) return <div className="text-center py-20">Product not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Back Navigation */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition"
      >
        <FaArrowLeft size={14} /> Back to Collection
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 relative group">
            <img
              src={product.images[activeImage]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            
            {/* Gallery Navigation Arrows */}
            {product.images.length > 1 && (
              <>
                <button 
                  onClick={() => setActiveImage(prev => (prev === 0 ? product.images.length - 1 : prev - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  <FaChevronLeft />
                </button>
                <button 
                  onClick={() => setActiveImage(prev => (prev === product.images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  <FaChevronRight />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-4 overflow-x-auto pb-2">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                  activeImage === idx ? "border-blue-600" : "border-transparent"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col">
          <div className="border-b border-gray-100 pb-8">
            <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">
              {product.type?.name || "Collection Item"}
            </span>
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 mt-2 mb-4 tracking-tight">
              {product.name}
            </h1>
            <p className="text-3xl font-light text-gray-700">
              ${product.price?.toLocaleString()}
            </p>
          </div>

          <div className="py-8 space-y-6">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {product.description}
              </p>
            </div>

            <div className="flex items-center gap-4">
               <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                 product.countInStock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
               }`}>
                 {product.countInStock > 0 ? `${product.countInStock} in stock` : "Sold Out"}
               </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto pt-8 space-y-4">
            <button
              onClick={handleWhatsApp}
              className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-[#20ba5a] transition-all shadow-lg active:scale-[0.98]"
            >
              <FaWhatsapp size={24} />
              Inquire via WhatsApp
            </button>
            
            <p className="text-center text-gray-400 text-sm">
              Standard delivery within 3-5 business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;