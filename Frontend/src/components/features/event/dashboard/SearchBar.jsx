import React from "react";

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search events by title"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full sm:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default SearchBar;
