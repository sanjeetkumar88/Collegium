import React from 'react';
import { motion } from 'framer-motion';

function UserCardSm({ logo, name, username, role }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="w-full bg-white p-3 rounded-2xl flex items-center gap-4 shadow-sm border border-slate-100 hover:shadow-lg transition-all"
    >
      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-sm border border-slate-50">
        <img src={logo} alt="avatar" className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-black text-slate-900 truncate">{name}</p>
          <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-widest shrink-0">
            {role}
          </span>
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">@{username}</p>
      </div>
    </motion.div>
  );
}

export default UserCardSm;
