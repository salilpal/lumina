// src/components/layout/Navbar.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiUser, FiHeart, FiSearch, FiShoppingBag } from "react-icons/fi";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-6 py-4 ${
        isScrolled 
          ? "bg-white/80 backdrop-blur-md shadow-sm py-3" 
          : "bg-white border-b border-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Left: Logo */}
        <Link 
          to="/" 
          className="text-2xl font-light tracking-[0.2em] text-gray-900"
        >
          Lumina
        </Link>

        {/* Center: Search Bar */}
        <div className="hidden md:flex flex-grow max-w-md mx-12 border-black border-2 rounded-2xl">
          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full group"
          >
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors " />
            <input
              type="text"
              placeholder="Search lighting..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2 bg-gray-50 border-none rounded-full focus:bg-white focus:ring-1 focus:ring-gray-200 outline-none transition-all text-sm"
            />
          </form>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-6">
          <button
            onClick={() => navigate("/cart")}
            className="relative p-2 text-gray-600 hover:text-black transition-colors"
            title="Wishlist"
          >
            <FiHeart size={20} />
          </button>

          {!user ? (
            <button
              onClick={() => navigate("/login")}
              className="text-xs font-bold uppercase tracking-widest bg-black text-white px-6 py-2.5 rounded-full hover:bg-gray-800 transition-all active:scale-95"
            >
              Sign In
            </button>
          ) : (
            <div
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative py-2"
            >
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 p-2 text-gray-600 hover:text-black transition-colors focus:outline-none"
              >
                <FiUser size={20} />
                <span className="hidden lg:inline text-xs font-bold uppercase tracking-widest">
                  Account
                </span>
              </button>
              
              {/* Dropdown Menu */}
              <div className={`absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 z-50 transition-all duration-300 ${
                isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
              }`}>
                <div className="border-b border-gray-50 pb-4 mb-4">
                  <p className="font-bold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <div className="space-y-3">
                  <Link to="/profile" className="block text-sm text-gray-600 hover:text-blue-600 transition">My Profile</Link>
                  <Link to="/admin/dashboard" className="block text-sm text-gray-600 hover:text-blue-600 transition">Dashboard</Link>
                  <button className="w-full text-left text-sm text-red-500 font-semibold pt-2 border-t border-gray-50">
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;