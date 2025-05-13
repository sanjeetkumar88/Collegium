import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const buttonHover = {
  scale: 1.05,
  backgroundColor: "#2563eb",
  transition: { duration: 0.3 },
};

const Header = ({name,title}) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-10">
      <div>
        <h1 className="text-4xl font-bold text-gray-800">{name}</h1>
        <p className="text-gray-500 mt-1">{title}</p>
      </div>
      <motion.button
        whileHover={buttonHover}
        onClick={() => navigate("/events/createevent")}
        className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg"
      >
        + Create Event
      </motion.button>
    </div>
  );
};

export default Header;
