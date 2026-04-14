import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const buttonHover = {
  scale: 1.05,
  backgroundColor: "#2563eb",
  transition: { duration: 0.3 },
};

const buttonsConfig = [
  { key: "dashboard", label: "Dashboard", path: "/events/dashboard" },
  { key: "rsvp", label: "Rsvps", path: "/events/rsvp" },
  { key: "request", label: "Request", path: "/events/waitlist-users" },
  { key: "yourEvent", label: "Your Events", path: "/events/createdevent?page=1" },
];

const Header = ({ name, title, ...props }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
      <div>
        <h1 className="text-4xl font-bold text-gray-800">{name}</h1>
        <p className="text-gray-500 mt-1">{title}</p>
      </div>

      <div className="flex gap-4 flex-wrap">
        <motion.button
          whileHover={buttonHover}
          onClick={() => navigate("/events/createevent")}
          className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg cursor-pointer"
        >
          + Create Event
        </motion.button>

        {buttonsConfig.map(({ key, label, path }) => 
          props[key] && (
            <motion.button
              key={key}
              whileHover={buttonHover}
              onClick={() => navigate(path)}
              className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg cursor-pointer"
            >
              {label}
            </motion.button>
          )
        )}
      </div>
    </div>
  );
};

export default Header;
