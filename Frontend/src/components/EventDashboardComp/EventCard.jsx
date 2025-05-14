import React from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaUsers, FaEnvelope } from "react-icons/fa";

const EventCard = ({ event, onClick }) => {
  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl hover:border-blue-500 transition-transform cursor-pointer"
      whileHover={{ scale: 1.05 }}
      onClick={() => onClick(event)}
    >
      <div className="flex items-start gap-4 mb-4">
        {/* Icon */}
        <div className="bg-blue-100 p-3 rounded-full">
          <FaCalendarAlt className="text-blue-600 text-2xl" />
        </div>

        {/* Event Info */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-800">{event.title}</h2>
          <p className="text-sm text-gray-400 mb-2">
            {new Date(event.startDate).toLocaleString()} -{" "}
            {new Date(event.endDate).toLocaleString()}
          </p>

          {/* Registered Count */}
          {event?.registeredCount !== undefined && (
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <FaUsers className="text-blue-500" />
              <span>Registered: {event.registeredCount}</span>
            </div>
          )}

          {/* Request Count */}
          {event?.requestCount !== undefined && (
            <div className="flex items-center gap-2 text-gray-500">
              <FaEnvelope className="text-pink-500" />
              <span>Requests: {event.requestCount}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
