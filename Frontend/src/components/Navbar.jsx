import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaChevronDown,
  FaChevronUp,
  FaUserCircle,
  FaBars,
  FaTimes,
  FaHome,
  FaBook,
  FaUsers,
  FaInfoCircle,
  FaFolderOpen,
  FaProjectDiagram,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { name: "Home", to: "/", icon: <FaHome /> },
  { name: "Events", to: "/events", icon: <FaBook /> },
  {
    name: "Resources",
    key: "resources",
    dropdown: true,
    icon: <FaFolderOpen />,
    items: [
      { name: "PYQ's", type: "pyq", description: "Previous Year papers of AKTU University" },
      { name: "Lectures", type: "lecture", description: "Online lectures sorted for you subject-wise" },
      { name: "Short Notes", type: "short-note", description: "Short notes for quick revision" },
      { name: "Question Bank", type: "question-bank", description: "Subject-wise question banks" },
      { name: "Notes", type: "notes", description: "Chapter-wise notes for each year" },
      { name: "Quantum", type: "quantum", description: "Subject-wise quantum" },
    ],
  },
  { name: "Club", to: "/community", icon: <FaUsers /> },
  { name: "About", to: "/about", icon: <FaInfoCircle /> },
  {
    name: "Projects",
    dropdown: true,
    key: "projects",
    icon: <FaProjectDiagram />,
    items: [
      { name: "Create Project", type: "create-project", description: "Showcase your work by adding a new project" },
      { name: "Find Project Partner", type: "find-project-partner", description: "Collaborate with peers on exciting projects" },
      { name: "Explore Projects", type: "explore-projects", description: "See what others have built and get inspired" },
    ],
  },
];

function Navbar() {
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isProjectOpen, setIsProjectOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const profileRef = useRef(null);
  const resourcesRef = useRef(null);
  const projectRef = useRef(null);

  const handleResourceClick = (type) => {
    navigate(`/resources?type=${type}`);
    setTimeout(() => {
      setIsResourcesOpen(false);
      setIsMobileMenuOpen(false);
    }, 100);
  };

  const handleProjectClick = (type) => {
    navigate(`/project/${type}`);
    setTimeout(() => {
      setIsProjectOpen(false);
      setIsMobileMenuOpen(false);
    }, 100);
  };

  const handleLogout = () => {
    auth.logout();
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setIsProfileOpen(false);
      if (resourcesRef.current && !resourcesRef.current.contains(e.target)) setIsResourcesOpen(false);
      if (projectRef.current && !projectRef.current.contains(e.target)) setIsProjectOpen(false);
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

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex space-x-6 items-center">
        {navItems.map((item, index) =>
          item.dropdown ? (
            <div
              key={index}
              ref={item.key === "resources" ? resourcesRef : projectRef}
              className="relative"
              onMouseEnter={() =>
                item.key === "resources"
                  ? setIsResourcesOpen(true)
                  : setIsProjectOpen(true)
              }
              onMouseLeave={() =>
                item.key === "resources"
                  ? setIsResourcesOpen(false)
                  : setIsProjectOpen(false)
              }
            >
              <div className="text-white hover:text-gray-100 flex items-center gap-2 cursor-pointer transition-all">
                {item.icon}
                {item.name}
                {(item.key === "resources" ? isResourcesOpen : isProjectOpen) ? (
                  <FaChevronUp className="w-2.5 mt-1" />
                ) : (
                  <FaChevronDown className="w-2.5 mt-1" />
                )}
              </div>
              {(item.key === "resources" ? isResourcesOpen : isProjectOpen) && (
                <div className="absolute top-full left-0 mt-0 w-72 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
                  {item.items.map((option, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        item.key === "resources"
                          ? handleResourceClick(option.type)
                          : handleProjectClick(option.type)
                      }
                      className="hover:bg-gray-50 p-2 rounded block w-full text-left"
                    >
                      <h3 className="font-semibold text-gray-800">
                        {option.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {option.description}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link
              key={index}
              to={item.to}
              className="flex items-center gap-2 text-white hover:text-gray-100 transition-all"
            >
              {item.icon}
              {item.name}
            </Link>
          )
        )}
      </nav>

      {/* Profile Menu (Desktop) */}
      <div className="hidden lg:block relative" ref={profileRef}>
        {!auth.authUser ? (
          <Link
            to="/login"
            className="px-4 py-2 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition-all"
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
                <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Profile
                </Link>
                <Link to="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
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

      {/* Mobile Sidebar Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-20 left-0 w-64 h-screen bg-white shadow-lg p-6 z-40 flex flex-col space-y-4 lg:hidden">
          {navItems.map((item, index) =>
            item.dropdown ? (
              <div
                key={index}
                ref={item.key === "resources" ? resourcesRef : projectRef}
                className="relative"
              >
                <div className="flex items-center gap-2 text-black cursor-pointer"
                  onClick={() =>
                    item.key === "resources"
                      ? setIsResourcesOpen((prev) => !prev)
                      : setIsProjectOpen((prev) => !prev)
                  }
                >
                  {item.icon}
                  {item.name}
                  {(item.key === "resources" ? isResourcesOpen : isProjectOpen) ? (
                    <FaChevronUp className="w-2.5 mt-1" />
                  ) : (
                    <FaChevronDown className="w-2.5 mt-1" />
                  )}
                </div>
                {(item.key === "resources" ? isResourcesOpen : isProjectOpen) && (
                  <div className="mt-2 bg-white rounded-lg shadow-md border border-gray-200 p-3 z-50">
                    {item.items.map((option, i) => (
                      <button
                        key={i}
                        onClick={() =>
                          item.key === "resources"
                            ? handleResourceClick(option.type)
                            : handleProjectClick(option.type)
                        }
                        className="hover:underline cursor-pointer p-2 rounded block w-full text-left"
                      >
                        <h3 className="font-semibold text-gray-800">{option.name}</h3>
                        <p className="text-sm text-gray-500">{option.description}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={index}
                to={item.to}
                className="flex items-center gap-2 text-black hover:underline"
              >
                {item.icon}
                {item.name}
              </Link>
            )
          )}

          {/* Auth Section (Mobile) */}
          {!auth.authUser ? (
            <Link
              to="/login"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign In
            </Link>
          ) : (
            <>
              <Link
                to="/profile"
                className="text-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </Link>
              <Link
                to="/settings"
                className="text-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Settings
              </Link>
              <button onClick={handleLogout} className="text-red-600 text-left">
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
