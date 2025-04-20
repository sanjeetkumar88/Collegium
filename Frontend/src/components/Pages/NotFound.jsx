import React from 'react';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center text-white"
      >
        {/* Animated 404 */}
        <div className="flex justify-center items-center mb-4">
          <motion.div
            className="text-6xl font-bold mx-2"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            4
          </motion.div>

          <motion.div
            className="text-6xl font-bold mx-2"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.2 }}
          >
            0
          </motion.div>

          <motion.div
            className="text-6xl font-bold mx-2"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.4 }}
          >
            4
          </motion.div>
        </div>

        <motion.div
          className="text-xl font-medium mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Oops! Page Not Found.
        </motion.div>

        <motion.div
          className="text-lg mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          The page you are looking for might have been moved or deleted.
        </motion.div>

        <motion.a
          href="/"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block px-6 py-2 bg-purple-700 rounded-full text-white font-semibold transition duration-300 ease-in-out hover:bg-purple-800"
        >
          Go Back Home
        </motion.a>
      </motion.div>
    </div>
  );
};

export default NotFound;
