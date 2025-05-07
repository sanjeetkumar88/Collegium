import React from "react";
import { Link } from "react-router-dom";

const formatDate = (isoString) => {
  const dateObj = new Date(isoString);
  const day = dateObj.getUTCDate().toString().padStart(2, '0');
  const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  return { day, month };
};

const EventCard = ({ imageUrl, date, category, title,id }) => {
  const { day, month } = formatDate(date);

  return (
    <Link to={`/events/${id}`} className="block  transition cursor-pointer">
    <div className="w-64 bg-gray-50 rounded-xl p-4 shadow-md space-y-3 relative">
      {/* Image */}
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-40 object-cover rounded-md"
      />

      {/* Date Badge */}
      <div className="absolute top-4 right-4 bg-white shadow-md px-2 py-1 rounded-md text-center">
        <div className="text-sm font-bold leading-tight">{day}</div>
        <div className="text-xs font-semibold text-gray-600">{month}</div>
      </div>

      {/* Tag */}
      <div>
        <span className="inline-block bg-white border border-gray-300 text-gray-700 text-xs px-3 py-1 rounded-md">
          {category}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-gray-900">{title}</h3>
    </div>
    </Link>
  );
};

export default EventCard;
