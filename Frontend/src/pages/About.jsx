import {
  FaTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaGithub,
  FaEnvelope,
} from "react-icons/fa";
import { motion } from "framer-motion";

const features = [
  "Project Collaboration & Team Building",
  "Role-based Club Management (Admin, Leader, Member)",
  "Event Creation & RSVP with QR Ticketing",
  "Student Collaboration & Friend Connections",
  "Find Partner System Based on Skills",
  "Project Showcasing & Inspiration Feed",
  "Profile Customization & Smart Suggestions",
  "Protected Routes with Role Guards & Token Refresh",
  "Fully Responsive & Beautiful UI with Framer Motion",
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2 },
  }),
};

const About = () => {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('/texture.svg')] opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50/50 blur-[120px] rounded-full -mr-96 -mt-96" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-cyan-50/50 blur-[120px] rounded-full -ml-96 -mb-96" />

      {/* Hero Section */}
      <motion.section
        className="relative text-center py-32 px-6"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8"
        >
          Our Story & Vision
        </motion.div>
        <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tight leading-[0.9]">
          The Creative <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Builders</span> of
        </h1>
        <div className="mt-6 flex justify-center">
           <span className="text-4xl md:text-6xl font-black text-slate-300 uppercase tracking-[0.2em] relative">
              Collegium
              <div className="absolute -bottom-4 left-0 right-0 h-2 bg-blue-600/10 rounded-full" />
           </span>
        </div>
        <p className="mt-12 text-xl max-w-2xl mx-auto text-slate-500 font-medium leading-relaxed">
          A high-performance student-centric platform designed to empower collaboration, 
          ignite creativity, and streamline campus engagement.
        </p>
      </motion.section>

      {/* Workspace Image / Visual Break */}
      <motion.section
        className="max-w-7xl mx-auto px-6 mb-32"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="relative rounded-[4rem] overflow-hidden shadow-2xl h-[500px]">
           <img
             src="https://cdn.pixabay.com/photo/2015/01/21/14/14/apple-606761_1280.jpg"
             alt="workspace"
             className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
        </div>
      </motion.section>

      {/* Merits Section */}
      <section className="py-32 px-6 bg-slate-50 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] mb-4">Core Principles</h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900">Our Professional <span className="text-blue-600">Merits</span></h3>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {["CREATIVITY", "HONESTY", "COMMUNICATION", "TEAMWORK", "PASSION", "SCALABILITY"].map((title, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="group bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                   <div className="text-lg font-black">{i + 1}</div>
                </div>
                <h3 className="text-xl font-black mb-4 text-slate-900 tracking-tight">
                  {title}
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  {["Each module is crafted with care, solving real problems with unique ideas.",
                    "Built with integrity — every component reflects deliberate thought and purpose.",
                    "Collaboration flows easily with built-in community and friend systems.",
                    "Projects and clubs allow everyone to contribute and grow together.",
                    "From UI/UX to server security, every detail was crafted with pure dedication.",
                    "Designed with future growth in mind — modular and clean architecture."][i]}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features List */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            className="mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Advanced <span className="text-blue-600">Features</span></h2>
            <p className="mt-4 text-slate-500 font-medium">A comprehensive suite of tools for the modern student.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feat, idx) => (
              <motion.div
                key={idx}
                custom={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-100 text-left flex items-center gap-4 hover:border-blue-200 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                <span className="text-sm font-black text-slate-700 uppercase tracking-wider">{feat}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Contact */}
      <footer className="relative py-24 bg-slate-900 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-500" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-black text-white mb-2">
            Created with ❤️ by Sanjeet Kumar
          </h3>
          <p className="text-blue-400 font-bold uppercase tracking-widest text-sm mb-12">Full-Stack Developer | Architect of COLLEGIUM</p>
          
          <div className="flex justify-center gap-10">
            {[FaTwitter, FaFacebookF, FaLinkedinIn, FaGithub, FaEnvelope].map((Icon, i) => (
              <a 
                key={i} 
                href="#" 
                className="text-slate-500 hover:text-white hover:scale-125 transition-all"
              >
                <Icon size={24} />
              </a>
            ))}
          </div>
          
          <div className="mt-20 pt-8 border-t border-slate-800 text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
             &copy; 2024 COLLEGIUM PLATFORM. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;