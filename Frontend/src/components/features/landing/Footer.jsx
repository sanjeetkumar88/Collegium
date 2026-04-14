import { FaXTwitter, FaLinkedin, FaFacebook } from "react-icons/fa6";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      className="bg-white text-gray-700 px-6 py-10 text-sm border-t border-gray-200"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-8 md:flex-row justify-between">

        {/* Left: Subscription */}
        <div className="max-w-md">
          <h4 className="text-black font-semibold mb-1">Stay in the loop</h4>
          <p className="mb-4 text-sm">Subscribe for the latest news & updates.</p>
          <form className="flex">
            <input
              type="email"
              placeholder="your@email.com"
              className="px-4 py-2 rounded-l-md bg-gray-100 text-black outline-none border border-gray-300"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-r-md bg-black text-white font-medium hover:bg-gray-800"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Right: Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {/* Site Links */}
          <div>
            <h4 className="text-black font-semibold mb-2">SITE</h4>
            <ul className="space-y-1">
              <li><a href="/" className="hover:text-black">Home</a></li>
              <li><a href="/about" className="hover:text-black">About</a></li>
              <li><a href="/community" className="hover:text-black">Clubs</a></li>
              <li><a href="/events" className="hover:text-black">Events</a></li>
              <li><a href="/project/explore-projects" className="hover:text-black">Projects</a></li>
            </ul>
          </div>

          

          {/* Resources */}
          <div>
            <h4 className="text-black font-semibold mb-2">RESOURCES</h4>
            <ul className="space-y-1">
              <li><a href="/resources?type=pyq" className="hover:text-black">PYQ's</a></li>
              <li><a href="/resources?type=lecture" className="hover:text-black">Lectures</a></li>
              <li><a href="/resources?type=short-note" className="hover:text-black">Short Notes</a></li>
              <li><a href="/resources?type=question-bank" className="hover:text-black">Question Bank</a></li>
              <li><a href="/resources?type=notes" className="hover:text-black">Notes</a></li>
              <li><a href="/resources?type=quantum" className="hover:text-black">Quantum</a></li>
            </ul>
          </div>

          {/* Projects */}
          <div>
            <h4 className="text-black font-semibold mb-2">PROJECTS</h4>
            <ul className="space-y-1">
              <li><a href="/project/create-project" className="hover:text-black">Create Project</a></li>
              <li><a href="/project/find-project-partner" className="hover:text-black">Find Project Partner</a></li>
              <li><a href="/project/explore-projects" className="hover:text-black">Explore Projects</a></li>
            </ul>
          </div>

{/* Social Links */}
<div>
            <h4 className="text-black font-semibold mb-2">SOCIAL</h4>
            <ul className="space-y-1">
              <li><a href="https://x.com/YOUR_X" className="hover:text-black" target="_blank">X (Twitter)</a></li>
              <li><a href="https://linkedin.com/in/YOUR_LINKEDIN" className="hover:text-black" target="_blank">LinkedIn</a></li>
              <li><a href="https://facebook.com/YOUR_FB" className="hover:text-black" target="_blank">Facebook</a></li>
            </ul>
          </div>


        </div>
      </div>
      

      {/* Divider */}
      <div className="border-t border-gray-200 my-8" />

      {/* Bottom: Branding */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="bg-yellow-400 text-black font-bold px-2 py-1 rounded">C</div>
          <span>&copy; {new Date().getFullYear()} Collegium by SanjeetKumar</span>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0 text-lg text-gray-700">
          <a href="https://x.com/YOUR_X" target="_blank"><FaXTwitter className="hover:text-black" /></a>
          <a href="https://linkedin.com/in/YOUR_LINKEDIN" target="_blank"><FaLinkedin className="hover:text-black" /></a>
          <a href="https://facebook.com/YOUR_FB" target="_blank"><FaFacebook className="hover:text-black" /></a>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
