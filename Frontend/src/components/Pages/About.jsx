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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-gray-800">
      {/* Hero Section */}
      <motion.section
        className="relative text-center py-24 px-4"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <h1 className="text-5xl font-extrabold leading-tight text-gray-900">
          Hello!
          <br />
          <span className="text-indigo-500">We are Creative Builders of </span>
          <span className="text-gray-700 underline decoration-indigo-400 underline-offset-4">
            COLLEGIUM
          </span>
        </h1>
        <p className="mt-6 text-lg max-w-2xl mx-auto text-gray-600">
          A student-centric platform that empowers users to manage clubs, host
          events, build projects, and collaborate seamlessly.
        </p>
      </motion.section>

      {/* Workspace Image */}
      <motion.section
        className="overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <img
          src="https://cdn.pixabay.com/photo/2015/01/21/14/14/apple-606761_1280.jpg"
          alt="workspace"
          className="w-full object-cover"
        />
      </motion.section>

      {/* Merits Section */}
      <section className="py-20 px-6 text-center">
        <motion.h2
          className="text-3xl font-bold mb-10 text-indigo-700"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          KNOW OUR MERITS
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto text-left">
          {["CREATIVITY", "HONESTY", "COMMUNICATION", "TEAMWORK", "PASSION", "SCALABILITY"].map((title, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {title}
              </h3>
              <p className="text-gray-600">
                {["Each module is crafted with care, solving real problems with unique ideas.",
                  "Built fully by me — no shortcuts. Every component reflects time, thought, and purpose.",
                  "Collaboration flows easily with built-in chat, team requests, and friend systems.",
                  "Projects and clubs allow everyone to contribute and grow.",
                  "From UI/UX to server security, every detail was crafted with passion.",
                  "Designed with future growth in mind — modular architecture and clean codebase."][i]}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features List */}
      <section className="py-20 bg-gray-100 px-6 text-center">
        <motion.h2
          className="text-3xl font-bold mb-10 text-indigo-700"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          ALL FEATURES
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto text-left text-gray-700">
          {features.map((feat, idx) => (
            <motion.div
              key={idx}
              custom={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-white shadow-md p-4 rounded-xl border border-gray-200"
            >
              {feat}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer Contact */}
      <footer className="py-12 bg-indigo-600 text-white text-center">
        <h3 className="text-2xl font-bold mb-2">
          Created with ❤️ by Sanjeet Kumar
        </h3>
        <p className="mb-1">Full-Stack Developer | Builder of COLLEGIUM</p>
        <div className="flex justify-center gap-6 mt-4">
          <a href="https://twitter.com">
            <FaTwitter className="text-xl hover:text-white/80" />
          </a>
          <a href="https://facebook.com">
            <FaFacebookF className="text-xl hover:text-white/80" />
          </a>
          <a href="https://linkedin.com">
            <FaLinkedinIn className="text-xl hover:text-white/80" />
          </a>
          <a href="https://github.com/sanjeetkumar88">
            <FaGithub className="text-xl hover:text-white/80" />
          </a>
          <a href="mailto:sanjeetkumar88@gmail.com">
            <FaEnvelope className="text-xl hover:text-white/80" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default About;