import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-300 text-center text-sm text-gray-500 py-4 mt-8">
      &copy; {new Date().getFullYear()} Toushi. All rights reserved.
    </footer>
  );
};

export default Footer;
