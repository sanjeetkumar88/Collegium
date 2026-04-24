import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaTag } from "react-icons/fa";

const formatDate = (isoString) => {
  const dateObj = new Date(isoString);
  const day = dateObj.getUTCDate().toString().padStart(2, "0");
  const month = dateObj
    .toLocaleString("en-US", { month: "short" })
    .toUpperCase();
  const year = dateObj.getUTCFullYear();
  return { day, month, year };
};

const EventCard = ({ imageUrl, date, category, title, id }) => {
  const { day, month, year } = formatDate(date);

  return (
    <Link to={`/events/${id}`} className="block group">
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="relative h-[380px] bg-white rounded-[2rem] p-4 shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col overflow-hidden"
      >
        {/* Decorative Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Image Container */}
        <div className="relative w-full h-44 overflow-hidden rounded-[1.5rem] bg-slate-100">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Floating Date Badge (Glassmorphic) */}
          <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-md shadow-xl px-3 py-2 rounded-2xl text-center border border-white/50 min-w-[3.5rem]">
            <div className="text-xl font-black text-slate-900 leading-none">
              {day}
            </div>
            <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">
              {month} {year}
            </div>
          </div>

        </div>

        {/* Content Section */}
        <div className="mt-5 flex flex-col flex-1">
          {/* Tag */}
          <div className="mb-3">
            <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider">
              <FaTag size={10} />
              {category}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-slate-900 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>

          {/* Action Hint */}
          <div className="mt-auto pt-4 flex items-center justify-between">
             <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                <FaCalendarAlt size={12} />
                Details
             </div>
             <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
             </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default EventCard;

