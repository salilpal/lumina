// src/features/admin/Dashboard.jsx
import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Link
          to="/admin/users"
          className="p-4 bg-blue-100 rounded shadow hover:bg-blue-200"
        >
          Manage Users
        </Link>
        <Link
          to="/admin/categories"
          className="p-4 bg-yellow-100 rounded shadow hover:bg-yellow-200"
        >
          Manage Categories
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
