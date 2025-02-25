import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Import the arrow icons

function Navbar() {
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  // Function to navigate with query parameters
  const handleResourceClick = (type) => {
    navigate(`/resources?type=${type}`);
    setIsResourcesOpen(false); // Close dropdown after click
  };

  return (
    <div>
      <header className="flex justify-between items-center p-6 bg-white shadow-md">
        <div className="text-2xl font-bold text-gray-700">Collegium</div>

        <nav className="space-x-4 relative">
          <Link to="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <Link to="/events" className="text-gray-600 hover:text-gray-900">
            Events
          </Link>

          {/* Resources Dropdown */}
          <div
            className="inline-block relative"
            onMouseEnter={() => setIsResourcesOpen(true)}
            onMouseLeave={() => setIsResourcesOpen(false)}
          >
            <div className="text-gray-600 hover:text-gray-900 flex items-center">
              Resources
              {isResourcesOpen ? (
                <FaChevronUp className="ml-1 w-2.5 mt-1" /> // Upward arrow when open
              ) : (
                <FaChevronDown className="ml-1 w-2.5 mt-1" /> // Downward arrow when closed
              )}
            </div>

            {isResourcesOpen && (
              <div
                className="absolute top-full left-0 mt-0 w-96 bg-white rounded-lg shadow-xl border border-gray-200 p-4"
                onMouseEnter={() => setIsResourcesOpen(true)}
                onMouseLeave={() => setIsResourcesOpen(false)}
              >
                <div className="grid grid-cols-2 gap-4">
                  {/* Column 1 */}
                  <div className="space-y-4">
                    <button
                      onClick={() => handleResourceClick("pyq")}
                      className="hover:bg-gray-50 p-2 rounded block w-full text-left"
                    >
                      <h3 className="font-semibold text-gray-800">PYQ's</h3>
                      <p className="text-sm text-gray-500">
                        Previous Year papers of AKTU University
                      </p>
                    </button>
                    <button
                      onClick={() => handleResourceClick("lectures")}
                      className="hover:bg-gray-50 p-2 rounded block w-full text-left"
                    >
                      <h3 className="font-semibold text-gray-800">Lectures</h3>
                      <p className="text-sm text-gray-500">
                        Online lectures sorted for you subject-wise
                      </p>
                    </button>
                    <button
                      onClick={() => handleResourceClick("short-notes")}
                      className="hover:bg-gray-50 p-2 rounded block w-full text-left"
                    >
                      <h3 className="font-semibold text-gray-800">Short Notes</h3>
                      <p className="text-sm text-gray-500">
                        Short notes for quick revision
                      </p>
                    </button>
                  </div>

                  {/* Column 2 */}
                  <div className="space-y-4">
                    <button
                      onClick={() => handleResourceClick("question-bank")}
                      className="hover:bg-gray-50 p-2 rounded block w-full text-left"
                    >
                      <h3 className="font-semibold text-gray-800">Question Bank</h3>
                      <p className="text-sm text-gray-500">
                        Subject-wise question banks
                      </p>
                    </button>
                    <button
                      onClick={() => handleResourceClick("notes")}
                      className="hover:bg-gray-50 p-2 rounded block w-full text-left"
                    >
                      <h3 className="font-semibold text-gray-800">Notes</h3>
                      <p className="text-sm text-gray-500">
                        Chapter-wise notes for each year
                      </p>
                    </button>
                    <button
                      onClick={() => handleResourceClick("quantum")}
                      className="hover:bg-gray-50 p-2 rounded block w-full text-left"
                    >
                      <h3 className="font-semibold text-gray-800">Quantum</h3>
                      <p className="text-sm text-gray-500">Subject-wise quantum</p>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link to="/about" className="text-gray-600 hover:text-gray-900">
            About
          </Link>
        </nav>

        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500">
          Sign In
        </button>
      </header>
    </div>
  );
}

export default Navbar;
