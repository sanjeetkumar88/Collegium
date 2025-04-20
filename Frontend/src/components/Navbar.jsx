import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaChevronDown,
  FaChevronUp,
  FaUserCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../context/Authcontext";

const navItems = [
  { name: "Home", to: "/" },
  { name: "Events", to: "/events" },
  {
    name: "Resources",
    dropdown: true,
    items: [
      {
        name: "PYQ's",
        type: "pyq",
        description: "Previous Year papers of AKTU University",
      },
      {
        name: "Lectures",
        type: "lectures",
        description: "Online lectures sorted for you subject-wise",
      },
      {
        name: "Short Notes",
        type: "short-notes",
        description: "Short notes for quick revision",
      },
      {
        name: "Question Bank",
        type: "question-bank",
        description: "Subject-wise question banks",
      },
      {
        name: "Notes",
        type: "notes",
        description: "Chapter-wise notes for each year",
      },
      { name: "Quantum", type: "quantum", description: "Subject-wise quantum" },
    ],
  },
  { name: "Club", to: "/community" },
  { name: "About", to: "/about" },
];

function Navbar() {
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const resourcesRef = useRef(null);

  const handleResourceClick = (type) => {
    navigate(`/resources?type=${type}`);
    setIsResourcesOpen(false);
  };

  const handleLogout = () => {
    auth.logout();
    setIsProfileOpen(false);
    navigate("/");
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
      if (resourcesRef.current && !resourcesRef.current.contains(e.target)) {
        setIsResourcesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex justify-between items-center p-6 bg-gradient-to-r from-indigo-600 to-blue-500 shadow-md relative z-50">
      <div className="text-2xl font-bold text-white">Collegium</div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <button onClick={toggleMobileMenu} className="text-white">
          {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      <nav
        className={`lg:flex lg:space-x-6 lg:items-center space-y-4 lg:space-y-0 flex-col lg:flex-row transition-all duration-300 ${
          isMobileMenuOpen ? "block" : "hidden"
        }`}
      >
        {navItems.map((item, index) =>
          item.dropdown ? (
            <div
              key={index}
              ref={resourcesRef}
              className="relative"
              onMouseEnter={() => setIsResourcesOpen(true)}
              onMouseLeave={() => setIsResourcesOpen(false)}
            >
              <div className="text-white hover:text-gray-100 flex items-center cursor-pointer">
                {item.name}
                {isResourcesOpen ? (
                  <FaChevronUp className="ml-1 w-2.5 mt-1" />
                ) : (
                  <FaChevronDown className="ml-1 w-2.5 mt-1" />
                )}
              </div>
              {isResourcesOpen && (
                <div className="absolute top-full left-0 mt-0 w-72 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
                  <div className="grid grid-cols-2 gap-4">
                    {item.items.map((res, i) => (
                      <button
                        key={i}
                        onClick={() => handleResourceClick(res.type)}
                        className="hover:bg-gray-50 p-2 rounded block w-full text-left"
                      >
                        <h3 className="font-semibold text-gray-800">
                          {res.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {res.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              key={index}
              to={item.to}
              className="text-white hover:text-gray-100 transition-all duration-300"
            >
              {item.name}
            </Link>
          )
        )}
      </nav>

      {/* Auth Section */}
      <div className="relative" ref={profileRef}>
        {!auth.authUser ? (
          <Link
            to="/login"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all duration-300"
          >
            Sign In
          </Link>
        ) : (
          <div
            className="relative cursor-pointer"
            onClick={() => setIsProfileOpen((prev) => !prev)}
          >
            <FaUserCircle size={28} className="text-white" />
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md py-2 z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
