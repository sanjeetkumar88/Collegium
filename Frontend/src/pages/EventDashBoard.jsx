import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import * as eventApi from "../api/event";
import { AiOutlineCalendar, AiOutlineLock, AiOutlineGlobal, AiOutlineVideoCamera, AiOutlineLaptop } from "react-icons/ai";
import Header from "../components/features/event/dashboard/Header";

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
        const res = await eventApi.getEventDashboard();
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
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('/texture.svg')] opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/50 blur-[120px] rounded-full -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-50/50 blur-[120px] rounded-full -ml-64 -mb-64" />

      <main className="relative z-10 max-w-7xl mx-auto px-8 py-16">
        <div className="mb-16">
          <Header 
            rsvp={true}
            request={true}
            yourEvent={true}
            name="Event Control Center"
            title={date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              onClick={() => navigate(stat.nav)}
              className="group bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer text-center relative overflow-hidden"
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-50 transition-all duration-500 text-blue-600">
                  {icons[stat.label]}
                </div>
                <div className="text-5xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {stat.value}
                </div>
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions (Future placeholder) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 p-12 bg-slate-900 rounded-[3rem] text-center relative overflow-hidden"
        >
           <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20" />
           <div className="relative z-10">
              <h3 className="text-3xl font-black text-white mb-4">Ready to host something amazing?</h3>
              <p className="text-slate-400 font-medium mb-8 max-w-lg mx-auto">Create and manage your events with ease. Track RSVPs, requests, and more in real-time.</p>
              <button 
                onClick={() => navigate("/events/createevent")}
                className="px-10 py-4 bg-white text-slate-900 font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                CREATE NEW EVENT
              </button>
           </div>
        </motion.div>
      </main>
    </div>
  );
}

export default EventDashBoard;
