import React from 'react';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden flex items-center justify-center p-6 text-center">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('/texture.svg')] opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50/50 blur-[120px] rounded-full -mr-96 -mt-96" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-cyan-50/50 blur-[120px] rounded-full -ml-96 -mb-96" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-2xl"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8"
        >
          System Error 404
        </motion.div>
        
        <div className="flex justify-center items-baseline gap-2 mb-8">
           <h1 className="text-[12rem] font-black text-slate-900 leading-[0.8] tracking-tighter">4</h1>
           <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-blue-600 to-cyan-400 rotate-12 shadow-2xl shadow-blue-500/40" />
           <h1 className="text-[12rem] font-black text-slate-900 leading-[0.8] tracking-tighter">4</h1>
        </div>

        <h2 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tight">Lost in the <span className="text-blue-600">void</span>.</h2>
        <p className="text-slate-500 font-medium text-lg mb-12 max-w-md mx-auto">
          The coordinates you followed seem to lead nowhere. Let's get you back to safety.
        </p>

        <motion.a
          href="/"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block px-12 py-5 bg-slate-900 text-white font-black rounded-2xl uppercase tracking-[0.2em] text-xs shadow-2xl hover:bg-blue-600 transition-colors"
        >
          Return to Portal
        </motion.a>
      </motion.div>
    </div>
  );
};

export default NotFound;
