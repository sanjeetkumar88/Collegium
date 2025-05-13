import React from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt } from "react-icons/fa";

const EventCard = ({ event }) => {
  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl hover:border-blue-500 transition-transform"
      whileHover={{ scale: 1.05 }}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="bg-blue-100 p-3 rounded-full">
          <FaCalendarAlt className="text-blue-600 text-2xl" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{event.title}</h2>
          <p className="text-sm text-gray-500">Registered: {event.registeredCount}</p>
          <p className="text-sm text-gray-400">
            {new Date(event.startDate).toLocaleString()} -{" "}
            {new Date(event.endDate).toLocaleString()}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
