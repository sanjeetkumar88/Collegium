import React from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaUsers, FaEnvelope } from "react-icons/fa";

const EventCard = ({ event, onClick }) => {
  return (
    <motion.div
      className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer relative overflow-hidden"
      whileHover={{ y: -5 }}
      onClick={() => onClick(event)}
    >
      {/* Hover Decor */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
            <FaCalendarAlt size={24} />
          </div>
          <div className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">
            {event.status || 'Active'}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors tracking-tight">
            {event.title}
          </h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
            {new Date(event.startDate).toLocaleDateString()} &bull; {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-50">
          {event?.registeredCount !== undefined && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl">
              <FaUsers className="text-blue-500" size={14} />
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{event.registeredCount} RSVPs</span>
            </div>
          )}

          {event?.requestCount !== undefined && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl">
              <FaEnvelope className="text-indigo-500" size={14} />
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{event.requestCount} Requests</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
