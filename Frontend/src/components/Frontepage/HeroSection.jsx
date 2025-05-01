import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-20 overflow-hidden ">

     

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center max-w-3xl mx-auto"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-gray-800 tracking-tight">
          Build, Collaborate & Grow with <br />
          <span className="text-indigo-600 underline decoration-2 decoration-indigo-400">COLLEGIUM</span>
        </h1>

        <p className="text-gray-600 mt-6 text-lg md:text-xl leading-relaxed">
          Connect with like-minded peers, join clubs, explore events, and unlock tools to supercharge your college journey.
        </p>

        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-500 transition"
          >
            Get Started <FaArrowRight className="inline ml-2" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/about")}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl bg-white hover:bg-gray-100 transition shadow-sm"
          >
            Learn More
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
