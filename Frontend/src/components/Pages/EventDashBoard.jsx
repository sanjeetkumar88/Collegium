import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AiOutlineCalendar, AiOutlineLock, AiOutlineGlobal, AiOutlineVideoCamera, AiOutlineLaptop } from "react-icons/ai";
import Header from "../EventDashboardComp/Header";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const buttonHover = {
  scale: 1.05,
  backgroundColor: "#2563eb",
  transition: { duration: 0.3 },
};

const icons = {
  "Total Events": <AiOutlineCalendar className="text-4xl text-blue-500" />,
  "Private Events": <AiOutlineLock className="text-4xl text-indigo-500" />,
  "Public Events": <AiOutlineGlobal className="text-4xl text-green-500" />,
  "Offline Events": <AiOutlineVideoCamera className="text-4xl text-yellow-500" />,
  "Online Events": <AiOutlineLaptop className="text-4xl text-purple-500" />,
};

function EventDashBoard() {
  const [date, setDate] = useState(new Date());
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/devevent/dashboard");
        const data = res.data;

        setStats([
          { label: "Total Events", value: data.total, nav: "/events/createdevent" },
          { label: "Private Events", value: data.private, nav: "/events/createdevent?privacy=private&page=1" },
          { label: "Public Events", value: data.public, nav: "/events/createdevent?privacy=public&page=1" },
          { label: "Offline Events", value: data.offline, nav: "/events/createdevent?mode=offline&page=1" },
          { label: "Online Events", value: data.online, nav: "/events/createdevent?mode=online&page=1" },
        ]);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-gray-600 text-lg">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 px-8 py-10">
      
      <Header 
      rsvp={true}
      request={true}
      yourEvent={true}
      name="Dashboard"
      title={date.toLocaleString()}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            onClick={() => navigate(stat.nav)}
            className="bg-white bg-opacity-80 backdrop-blur-lg p-6 rounded-lg shadow-lg border border-gray-300 cursor-pointer hover:shadow-xl hover:border-blue-500 hover:bg-opacity-90 transition-transform transform hover:scale-105"
          >
            <div className="flex flex-col items-center">
              {icons[stat.label]}
              <div className="text-5xl font-bold text-blue-600 mt-2">{stat.value}</div>
              <div className="mt-2 text-lg font-medium text-gray-700">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default EventDashBoard;
