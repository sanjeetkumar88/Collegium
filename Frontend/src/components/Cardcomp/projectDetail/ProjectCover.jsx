import { motion } from "framer-motion";

export default function ProjectCover({ coverImage, logo }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl shadow-lg"
    >
      {/* Background Image */}
      <motion.img
        src={coverImage}
        alt="Cover"
        className="w-full h-48 object-cover"
        initial={{ scale: 1 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.5 }}
      />

      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

      {/* Optional logo */}
      {logo && (
        <div className="absolute bottom-4 left-4">
          <img src={logo} alt="Logo" className="h-12 w-12 object-contain rounded-full border-2 border-white shadow-md" />
        </div>
      )}
    </motion.div>
  );
}
