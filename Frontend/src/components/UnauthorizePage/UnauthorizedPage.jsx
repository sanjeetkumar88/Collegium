import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
  return (
    <motion.div
      className="h-screen w-full flex flex-col items-center justify-center bg-gray-100 text-center px-6"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.h1
        className="text-7xl font-bold text-red-600 mb-4"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        401
      </motion.h1>
      <motion.h2
        className="text-3xl font-semibold text-gray-800 mb-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Unauthorized Access
      </motion.h2>
      <motion.p
        className="text-gray-600 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        You do not have permission to view this page.
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <Link
          to="/"
          className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
        >
          Go Back Home
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default UnauthorizedPage;
