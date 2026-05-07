// src/components/layout/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaXTwitter, FaGithub, FaLinkedinIn } from "react-icons/fa6";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-2xl font-light tracking-[0.2em] text-gray-900">
              Lumina
            </Link>
            <p className="mt-6 text-gray-500 leading-relaxed text-sm">
              Crafting atmospheres through light. Our curated collections bring architectural elegance and modern warmth to every space.
            </p>
          </div>

          {/* Collections Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-6">Collections</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link to="/categories" className="hover:text-black transition-colors">Indoor Residential</Link></li>
              <li><Link to="/categories" className="hover:text-black transition-colors">Modern Minimalism</Link></li>
              <li><Link to="/categories" className="hover:text-black transition-colors">Architectural Outdoor</Link></li>
              <li><Link to="/categories" className="hover:text-black transition-colors">Smart Illumination</Link></li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link to="/contact" className="hover:text-black transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping" className="hover:text-black transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/faq" className="hover:text-black transition-colors">Installation Guide</Link></li>
              <li><Link to="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Social & Contact Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-6">Connect</h4>
            <div className="flex space-x-5 mb-6">
              <a href="https://x.com/salilpal_" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-black transition-colors">
                <FaXTwitter size={18} />
              </a>
              <a href="https://www.linkedin.com/in/salil-pal-a1857b289/" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#0077b5] transition-colors">
                <FaLinkedinIn size={18} />
              </a>
              <a href="https://github.com/salilpal" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-black transition-colors">
                <FaGithub size={18} />
              </a>
              <a href="https://www.instagram.com/salilpal_/?hl=en" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#e1306c] transition-colors">
                <FaInstagram size={18} />
              </a>
            </div>
            <p className="text-sm text-gray-500">
              Questions? <br />
              <span className="text-gray-900 font-medium">salilp379@gmail.com</span>
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] uppercase tracking-widest text-gray-400">
            &copy; {currentYear} Lumina Lighting. All rights reserved.
          </p>
          <div className="flex gap-8">
            <span className="text-[10px] uppercase tracking-widest text-gray-400">Gurugram, India</span>
            <span className="text-[10px] uppercase tracking-widest text-gray-400">Global Shipping</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;