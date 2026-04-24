import { FaXTwitter, FaLinkedin, FaFacebook } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="bg-slate-900 text-slate-400 px-6 py-24 relative overflow-hidden"
    >
      {/* Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/10 blur-[120px] rounded-full -ml-48 -mb-48" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-20">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="text-2xl font-black tracking-tighter text-white mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">C</div>
              COLLEGIUM
            </div>
            <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-sm mb-10">
              Empowering students through high-fidelity collaboration, resource sharing, and community engagement.
            </p>
            <div className="flex gap-4">
               {[FaXTwitter, FaLinkedin, FaFacebook].map((Icon, idx) => (
                 <a key={idx} href="#" className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-white hover:bg-blue-600 transition-all shadow-xl">
                   <Icon size={20} />
                 </a>
               ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Navigation</h4>
            <ul className="space-y-4">
              {['Home', 'About', 'Clubs', 'Events', 'Projects'].map(item => (
                <li key={item}>
                  <a href={`/${item === 'Home' ? '' : item.toLowerCase()}`} className="text-sm font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Resources</h4>
            <ul className="space-y-4">
              {['PYQ\'s', 'Lectures', 'Short Notes', 'Question Bank', 'Notes', 'Quantum'].map(item => (
                <li key={item}>
                  <a href="/resources" className="text-sm font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Newsletter</h4>
            <p className="text-slate-500 text-xs font-medium mb-6">Stay updated with the latest campus innovations.</p>
            <form className="relative">
              <input
                type="email"
                placeholder="EMAIL"
                className="w-full bg-slate-800 border-none rounded-xl px-6 py-4 text-[10px] font-black tracking-widest text-white placeholder-slate-600 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all"
              >
                <FaArrowRight size={14} />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
             &copy; {new Date().getFullYear()} COLLEGIUM PLATFORM. ALL RIGHTS RESERVED.
           </div>
           <div className="flex gap-8">
              <a href="#" className="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition-colors">Terms of Service</a>
           </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
