// src/layouts/UserLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const UserLayout = () => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-[#f2f2f2]">
      <Navbar />
      <main className="flex-grow flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
