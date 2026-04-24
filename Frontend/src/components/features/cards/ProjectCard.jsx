import React from "react";
import { motion } from "framer-motion";
import { FaExternalLinkAlt, FaCode, FaCalendarAlt } from "react-icons/fa";

const ProjectCard = ({ imageUrl, title, badgeText, description, buttonText, timestamp, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 overflow-hidden flex flex-col h-full"
    >
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Floating Category */}
        <div className="absolute top-4 left-4">
          <span className="bg-white/80 backdrop-blur-md text-blue-600 text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest border border-white/50 shadow-lg">
            {badgeText}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-1">
          {title}
        </h3>
        
        <p className="text-slate-500 font-medium line-clamp-3 mb-8 leading-relaxed">
          {description}
        </p>

        {/* Footer */}
        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3 text-slate-400 font-bold text-xs uppercase tracking-widest">
            <FaCalendarAlt size={12} className="text-blue-400" />
            {timestamp}
          </div>

          <button
            onClick={onClick}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-black rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all hover:scale-105 active:scale-95"
          >
            {buttonText}
            <FaExternalLinkAlt size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
