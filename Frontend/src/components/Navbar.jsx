import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Import the arrow icons

function Navbar() {
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);

  return (
    <div>
      <header className="flex justify-between items-center p-6 bg-white shadow-md">
        <div className="text-2xl font-bold text-gray-700">Collegium</div>

        <nav className="space-x-4 relative">
          <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
          <Link to='/events' className="text-gray-600 hover:text-gray-900">Events</Link>

          {/* Resources Dropdown */}
          <div
            className="inline-block relative"
            onMouseEnter={() => setIsResourcesOpen(true)}
            onMouseLeave={() => setIsResourcesOpen(false)}
          >
            <div className="text-gray-600 hover:text-gray-900 flex items-center">
              Resources
              {/* Display the appropriate arrow based on the dropdown state */}
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
                    <Link to="/resources/pyqs" className="hover:bg-gray-50 p-2 rounded block">
                      <h3 className="font-semibold text-gray-800">PYQ's</h3>
                      <p className="text-sm text-gray-500">Previous Year papers of aktu university</p>
                    </Link>
                    <Link to="/resources/lectures" className="hover:bg-gray-50 p-2 rounded block">
                      <h3 className="font-semibold text-gray-800">Lectures</h3>
                      <p className="text-sm text-gray-500">Online lectures sorted for you subjectwise and topicwise</p>
                    </Link>
                    <Link to="/resources/short-notes" className="hover:bg-gray-50 p-2 rounded block">
                      <h3 className="font-semibold text-gray-800">Short Notes</h3>
                      <p className="text-sm text-gray-500">Short Notes for quick revision</p>
                    </Link>
                  </div>

                  {/* Column 2 */}
                  <div className="space-y-4">
                    <Link to="/resources/question-bank" className="hover:bg-gray-50 p-2 rounded block">
                      <h3 className="font-semibold text-gray-800">Question Bank</h3>
                      <p className="text-sm text-gray-500">Question banks subjectwise for each subjects</p>
                    </Link>
                    <Link to="/resources/notes" className="hover:bg-gray-50 p-2 rounded block">
                      <h3 className="font-semibold text-gray-800">Notes</h3>
                      <p className="text-sm text-gray-500">Subjectwise and chapterwise notes for each year</p>
                    </Link>
                    <Link to="/resources/quantum" className="hover:bg-gray-50 p-2 rounded block">
                      <h3 className="font-semibold text-gray-800">Quantum</h3>
                      <p className="text-sm text-gray-500">Subjectwise quantum</p>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link to='/about' className="text-gray-600 hover:text-gray-900">About</Link>
        </nav>

        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500">
          Sign In
        </button>
      </header>
    </div>
  );
}

export default Navbar;
