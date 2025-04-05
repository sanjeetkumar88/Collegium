import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function ClubDetail() {
    const { id } = useParams();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch club details from API
  useEffect(() => {
    const fetchClubDetails = async () => {
      try {
        
        const response = await axios.get(`/club/${id}`);

        console.log(response.data); // Log the response data

        // Set the 'club' object with the response data directly
        setClub(response.data);
      } catch (err) {
        // Handle errors
        setError(err.message);
      } finally {
        // Set loading to false after the request is completed
        setLoading(false);
      }
    };

    fetchClubDetails();
  }, []); 

  // If loading, display a loading message
  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  // If there's an error, display an error message
  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  // Render club details once they are loaded
  return (
    <div className="bg-gray-900 text-white min-h-screen p-6 max-w-[56rem] ml-auto mr-auto">
      {/* First Section: Club Cover & Logo */}
      <div className="relative w-full h-64 mb-20">
        <img
          src={club.coverImg}
          alt="Cover"
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute top-35 left-4">
          <img
            src={club.logo}
            alt="Club Logo"
            className="w-40 h-40 rounded-full border-4 border-white shadow-lg"
          />
        </div>
      </div>

      {/* Club Name & Status Button */}
      <div className="flex justify-between items-center mt-4">
        <h1 className="text-3xl font-bold">{club.name}</h1>
        <button className="bg-yellow-400 text-black px-4 py-2 rounded-lg shadow">
          {club.status}
        </button>
      </div> 

      {/* Club Details Section */}
      <div className="bg-gray-800 p-6 mt-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Club Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <p><strong>Leader:</strong> {club.leader}</p>
          <p><strong>Mentor:</strong> {club.mentor}</p>
          <p><strong>Total Members:</strong> {club.totalMembers}</p>
          <p><strong>Visibility:</strong> {club.visibility}</p>
          <p className="col-span-2"><strong>Tags:</strong> {club.tags.join(", ")}</p>
        </div>
      </div>

      {/* Description Section */}
      <div className="bg-gray-800 p-6 mt-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p>{club.description}</p>
      </div>
    </div>
  );
}
