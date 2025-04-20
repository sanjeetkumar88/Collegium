import React from "react";
import { Badge } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useClub } from "../../context/ClubContext";

const ClubCard = ({ coverImg, profileImg, name, tags, status, id }) => {
  const clubactions = useClub();

  const navigate = useNavigate();
  // Determine button color based on status
  const getStatusButtonClass = (status) => {
    switch (status) {
      case "Joined":
        return "bg-green-500 text-white border-green-600";
      case "Applied":
        return "bg-yellow-500 text-black border-yellow-600";
      default:
        return "bg-blue-500 text-white border-blue-600";
    }
  };

  return (
    <div className="max-w-sm rounded-2xl overflow-hidden shadow-lg bg-black">
      <div className="relative">
        <img className="w-full h-40 object-cover" src={coverImg} alt="Cover" />
        <div className="absolute inset-0 flex justify-center items-center -bottom-10">
          <img className="w-20 h-20 rounded-full border-4 border-white" src={profileImg} alt="Profile" />
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-2 mt-4 px-4">
        {tags.map((tag, index) => (
          <Badge key={index} color="pink">{tag}</Badge>
        ))}
      </div>
      <div className="pt-2 text-center pb-6">
        <h2 className="text-white text-xl font-bold">{name}</h2>
      </div>
      <div className="flex justify-center gap-4 pb-6">
        <button className="bg-gray-800 text-white py-2 px-4 rounded-md border border-gray-900 cursor-pointer" onClick={() => navigate(`/community/${id}`)}>About Us</button>
        <button className={`py-2 px-4 rounded-md border ${getStatusButtonClass(status)} cursor-pointer`}>{status}</button>
      </div>
    </div>
  );
};

export default ClubCard;