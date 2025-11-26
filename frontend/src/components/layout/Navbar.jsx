import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiHeart } from "react-icons/fi";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => navigate("/login");
  const profileHandleClick = () => navigate("/profile");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <nav className={`bg-white shadow-md p-4 flex flex-col`}>
      <div className="flex justify-between items-center">
        {/* Left: Logo */}
        <Link to="/" className="text-xl font-bold">
          Toushi Industries
        </Link>

        {/* Center: Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex mx-8 flex-grow max-w-md"
        >
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>

        {/* Right: Heart Icon + Profile */}
        <div className="flex items-center space-x-4 relative">
          <button
            onClick={() => navigate("/cart")}
            className="text-2xl text-gray-700 hover:text-red-500 transition"
          >
            <FiHeart />
          </button>

          {!user ? (
            <button
              onClick={handleClick}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Sign In
            </button>
          ) : (
            <div
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative"
            >
              <button
                onClick={profileHandleClick}
                className="text-2xl text-gray-700 hover:text-blue-600 focus:outline-none"
              >
                <FiUser />
              </button>
              {isHovered && (
                <div className="absolute right-0 mt-2 w-64 bg-white text-black rounded shadow-md p-4 z-10">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
