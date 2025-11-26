import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-white border-r p-4">
      <h2 className="text-xl font-bold mb-4">Admin</h2>
      <ul className="space-y-2">
        <li>
          <Link
            to="/admin/dashboard"
            className="block text-gray-700 hover:text-blue-600"
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/admin/users"
            className="block text-gray-700 hover:text-blue-600"
          >
            Users
          </Link>
        </li>
        <li>
          <Link
            to="/admin/categories"
            className="block text-gray-700 hover:text-blue-600"
          >
            Categories
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
