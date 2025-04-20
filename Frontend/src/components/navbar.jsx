import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import { Send } from "lucide-react";

//present

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const location = useLocation();

  //blue
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    // Clear any auth tokens/data as needed
  };

  // Touch handlers for swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    const touchEnd = e.touches[0].clientX;
    const diff = touchStart - touchEnd;
    
    // Swipe left to open menu, swipe right to close
    if (diff > 50 && !isOpen) {
      setIsOpen(true);
      setIsSwiping(true);
    } else if (diff < -50 && isOpen) {
      setIsOpen(false);
      setIsSwiping(true);
    }
  };

  const handleTouchEnd = () => {
    setTimeout(() => setIsSwiping(false), 300);
  };

  // Services dropdown items
  const serviceItems = [
    //Paper
  

    { name: "Article Reader", path: "/article-reader" },
    { name: "PDF Uploader", path: "/pdf-uploader" },
    { name: "Grammar Checker", path: "/grammar-checker" },
    { name: "Realtime Editor", path: "/realtime-editor" },
    { name: "Citation Generator", path: "/citation-generator" }
  ];

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-blue-300/50 backdrop-blur-lg shadow-lg" : "bg-blue-300 text-white"
      }`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" >
        <div className="flex items-center justify-between h-16">
         {/* Logo & Brand */}
         <div className="flex items-center space-x-3">
  <Link to="/" className="flex items-center space-x-3">
    <Send className="w-8 h-8 text-white" />
    <span className="text-white font-bold text-3xl tracking-tight transition-colors">
      Paper Pilot
    </span>
  </Link>
</div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 text-lg font-medium ${
                  location.pathname === "/" 
                    ? "text-blue-600 border-b-2 border-blue-600" 
                    : "text-white hover:text-blue-600"
                } transition-all duration-200 hover:scale-105`}
              >
               Buy
              </Link>

              {isAuthenticated && (
                <>
                  {/* Services Dropdown */}
                  <div className="relative">
                    <button
                      className={`px-3 py-2 text-lg font-medium flex items-center ${
                        serviceItems.some(item => location.pathname === item.path)
                          ? "text-blue-600"
                          : "text-white hover:text-blue-600"
                      } transition-all duration-200 hover:scale-105`}
                      onClick={() => setServicesOpen(!servicesOpen)}
                    >
                      Services
                      {servicesOpen ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </button>

                    {servicesOpen && (
                      <div 
                        className="absolute z-10 mt-2 w-48 bg-gray-600/90 backdrop-blur-lg rounded-md shadow-lg py-1 ring-1 ring-blue ring-opacity-5 animate-fadeIn"
                        style={{transform: "translateY(4px)"}}
                      >
                        {serviceItems.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={`block px-4 py-2 text-sm ${
                              location.pathname === item.path
                                ? "text-white-400 bg-blue-700/50"
                                : "text-white hover:bg-sky-300/50 hover:text-white-300"
                            } transition-all duration-200`}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  <Link
                    to="/about"
                    className={`px-3 py-2 text-lg font-medium ${
                      location.pathname === "/about"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-white hover:text-blue-600"
                    } transition-all duration-200 hover:scale-105`}
                  >
                    About
                  </Link>

                  {/* Logout button for authenticated users */}
                  <button
                    onClick={handleLogout}
                    className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-md font-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
                  >
                    Logout
                  </button>
                </>
              )}

              {/* Login button for non-authenticated users */}
              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-blue-400 focus:outline-none"
              aria-expanded="false"
            >
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out transform ${
          isOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none"
        } ${isSwiping ? "transition-transform" : ""}`}
      >
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-40" onClick={() => setIsOpen(false)} />
        <div className="fixed top-0 right-0 bottom-0 w-64 bg-gray-900/95 backdrop-blur-lg z-50 shadow-xl transform transition-all duration-300">
          <div className="pt-20 pb-3 space-y-1 px-4">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === "/"
                  ? "text-blue-400 bg-gray-800/50"
                  : "text-white hover:bg-gray-800/50 hover:text-blue-300"
              } transition-all duration-200`}
            >
              Home
            </Link>

            {isAuthenticated && (
              <>
                {/* Services Section in Mobile */}
                <button
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-800/50 hover:text-blue-300 flex justify-between items-center"
                  onClick={() => setServicesOpen(!servicesOpen)}
                >
                  Services
                  {servicesOpen ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>

                {servicesOpen && (
                  <div className="pl-4 space-y-1 animate-fadeIn">
                    {serviceItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`block px-3 py-2 rounded-md text-sm font-medium ${
                          location.pathname === item.path
                            ? "text-blue-400 bg-gray-800/30"
                            : "text-gray-300 hover:bg-gray-800/30 hover:text-blue-300"
                        } transition-all duration-200`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}

                <Link
                  to="/about"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === "/about"
                      ? "text-blue-400 bg-gray-800/50"
                      : "text-white hover:bg-gray-800/50 hover:text-blue-300"
                  } transition-all duration-200`}
                >
                  About
                </Link>

                <button
                  onClick={handleLogout}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-base font-medium transition-all duration-300"
                >
                  Logout
                </button>
              </>
            )}

            {!isAuthenticated && (
              <Link
                to="/login"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-base font-medium transition-all duration-300 mt-4"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;