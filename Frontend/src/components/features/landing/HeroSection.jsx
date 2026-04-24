import { motion } from "framer-motion";
import { FaArrowRight, FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-6 md:px-12 lg:px-20 overflow-hidden bg-white">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('/texture.svg')] opacity-[0.03] pointer-events-none" />
      
      {/* Premium Blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/50 blur-[120px] rounded-full -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-50/50 blur-[120px] rounded-full -ml-64 -mb-64" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10 py-20">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-left"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            Ecosystem v2.0
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-black leading-[0.9] text-slate-900 tracking-tighter mb-10">
            Build the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Future</span> of <br />
            Campus Life.
          </h1>

          <p className="text-slate-500 text-xl font-medium leading-relaxed mb-12 max-w-lg">
            Connect with elite peers, join high-impact clubs, and access the tools needed to dominate your academic journey.
          </p>

          <div className="flex items-center gap-6 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/login")}
              className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-600 transition-all flex items-center gap-4"
            >
              Get Started <FaArrowRight />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/about")}
              className="px-10 py-5 bg-white text-slate-900 border border-slate-100 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center gap-4 shadow-sm"
            >
              Learn More
            </motion.button>
          </div>

          <div className="mt-16 flex items-center gap-4">
             <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Trusted by 5,000+ Students</div>
             <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                  </div>
                ))}
             </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative lg:block"
        >
          <div className="relative z-10 rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-100 bg-white/50 backdrop-blur-3xl p-4">
             <div className="aspect-video rounded-[2.5rem] bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center border border-slate-50 overflow-hidden relative group">
                <img 
                  src="https://cdn.pixabay.com/photo/2021/11/04/19/39/jellyfish-6769174_1280.jpg" 
                  alt="abstract" 
                  className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale group-hover:grayscale-0 transition-all duration-1000"
                />
                <div className="relative z-10 text-center">
                   <div className="w-20 h-20 rounded-3xl bg-white shadow-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
                      <FaPlay size={24} className="ml-1" />
                   </div>
                   <p className="font-black text-slate-900 uppercase tracking-widest text-xs">Watch the Vision</p>
                </div>
             </div>
          </div>
          
          {/* Floating Accent */}
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute -top-10 -right-10 w-48 h-48 bg-blue-100/50 blur-3xl rounded-full" 
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

