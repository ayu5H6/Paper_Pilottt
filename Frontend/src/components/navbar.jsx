"use client";

import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, LogIn, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track login state
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check authentication status
    const userToken = localStorage.getItem("authToken"); // Example: Check localStorage
    setIsAuthenticated(!!userToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove token
    setIsAuthenticated(false);
    navigate("/"); // Redirect to home after logout
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleServices = (e) => {
    e.stopPropagation();
    setIsServicesOpen(!isServicesOpen);
  };

  useEffect(() => {
    const closeDropdown = () => setIsServicesOpen(false);
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full transition-all duration-300 ${
        isScrolled ? "py-3 bg-charcoal shadow-lg" : "py-5 bg-gradient-to-r from-red-800 via-charcoal to-red-900"
      } z-50`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="text-xl font-bold text-white">
          <a href="/">AI STUDY MASTER</a>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-6 items-center">
          <li>
            <a href="/" className="text-white hover:text-red-400 transition">Home</a>
          </li>
          <li>
            <a href="/about" className="text-white hover:text-red-400 transition">About</a>
          </li>
          <li className="relative">
            <button onClick={toggleServices} className="flex items-center text-white hover:text-red-400 transition">
              Services <ChevronDown className="ml-1" size={16} />
            </button>
            <AnimatePresence>
              {isServicesOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="absolute left-0 w-48 bg-gray-900 shadow-md rounded-md"
                >
                  <li>
                    <a href="/services/text-summarization" className="block px-4 py-2 text-white hover:bg-red-600">
                      Text Summarization
                    </a>
                  </li>
                  <li>
                    <a href="/services/grammar-checker" className="block px-4 py-2 text-white hover:bg-red-600">
                      Grammar Checker
                    </a>
                  </li>
                </motion.ul>
              )}
            </AnimatePresence>
          </li>

          {/* Login / Logout Button */}
          <li>
           
              <nav>
              <div className="flex space-x-4">
  <button
    onClick={() => navigate("/login")}
    className="flex items-center bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
  >
    <LogIn size={16} className="mr-2" />
    Login
  </button>
  
  <button
    onClick={() => navigate("/login")}
    className="flex items-center bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
  >
    <LogOut size={16} className="mr-2" />
    Logout
  </button>
</div>

              </nav>
            
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={toggleMenu}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="h-full w-3/4 bg-gray-900 bg-opacity-95 shadow-lg p-6 flex flex-col space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={toggleMenu} className="self-end text-white">
                <X size={24} />
              </button>

              <ul className="space-y-4 text-left">
                <li>
                  <a href="/" className="block text-white hover:text-red-400">Home</a>
                </li>
                <li>
                  <a href="/about" className="block text-white hover:text-red-400">About</a>
                </li>
                <li>
                  <button onClick={toggleServices} className="w-full text-white hover:text-red-400 flex items-center">
                    Services <ChevronDown className="ml-1" size={16} />
                  </button>
                  {isServicesOpen && (
                    <ul className="mt-2 space-y-2 pl-4">
                      <li>
                        <a href="/services/text-summarization" className="block text-white hover:text-red-400">
                          Text Summarization
                        </a>
                      </li>
                      <li>
                        <a href="/services/grammar-checker" className="block text-white hover:text-red-400">
                          Grammar Checker
                        </a>
                      </li>
                    </ul>
                  )}
                </li>
                {/* Mobile Login / Logout Button */}
                <li>
                  {isAuthenticated ? (
                    <button
                      onClick={handleLogout}
                      className="block bg-red-700 text-white w-32 py-2 text-center rounded-lg hover:bg-red-600 transition"
                    >
                      Logout
                    </button>
                  ) : (
                    <a
                      href="/auth"
                      className="block bg-red-700 text-white w-32 py-2 text-center rounded-lg hover:bg-red-600 transition"
                    >
                      Login
                    </a>
                  )}
                </li>
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
