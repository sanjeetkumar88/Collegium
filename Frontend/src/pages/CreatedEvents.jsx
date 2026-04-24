import React, { useEffect, useState } from "react";
import * as eventApi from "../api/event";
import { motion } from "framer-motion";
import { Select, Button, Chip, Pagination } from "@mantine/core";
import { FiFilter } from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router-dom";
import EventCard from "../components/features/cards/EventCard";
import { useAuth } from "../context/AuthContext";

function CreatedEvents() {
  const [searchParams, setSearchParams] = useSearchParams();

  // States initialized from URL
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedType, setSelectedType] = useState(searchParams.get("privacy") || "");
  const [selectedStatus,setSelectedStatus] = useState(searchParams.get("status") || "")
  const [selectedMode, setSelectedMode] = useState(searchParams.get("mode") || "");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [showFilters, setShowFilters] = useState(false);
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;
  const user = useAuth();
  const navigate = useNavigate();

  const categories = [
    "Sports", "DSA", "MERN", "Cybersecurity", "JAVA Developer", "AI", "Data Science"
  ];

  const typeOptions = [
    { label: "All Upcoming Events", value: "" },
    { label: "Public", value: "public" },
    { label: "Private", value: "private" },
  ];

  const statusData = [
    { label: "All", value: "" },
    { label: "Past", value: "completed" },
    { label: "Upcoming", value: "upcoming" },
    { label: "Ongoing", value: "ongoing" },
  ];

  const modeOptions = [
    { label: "All Modes", value: "" },
    { label: "Online", value: "online" },
    { label: "Offline", value: "offline" },
  ];

  // Update URL when filters or page change
  useEffect(() => {
    const params = {
      category: selectedCategory,
      privacy: selectedType,
      status: selectedStatus,
      mode: selectedMode,
      search,
      page,
    };

    const cleanedParams = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        cleanedParams[key] = value;
      }
    });

    setSearchParams(cleanedParams);
  }, [selectedCategory, selectedType, selectedStatus, selectedMode, search, page]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await eventApi.getCreatedEvents({
          title: search,
          category: selectedCategory,
          privacy: selectedType,
          medium: selectedMode,
          status: selectedStatus,
          page,
          limit,
        });

        setEvents(res.data.data || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      }
    };

    fetchEvents();
  }, [search, selectedCategory, selectedType, selectedMode, selectedStatus, page]);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('/texture.svg')] opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50/50 blur-[120px] rounded-full -mr-96 -mt-96" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-cyan-50/50 blur-[120px] rounded-full -ml-96 -mb-96" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20">
        {/* Top Navigation / Actions */}
        {(user.authUser?.role === "admin" || user.authUser?.role === "teacher") && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-end mb-12 gap-3"
          >
            <Button
              onClick={() => navigate("/events/createevent")}
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan' }}
              radius="xl"
              size="md"
              className="font-black shadow-lg shadow-blue-500/20 px-8"
            >
              + Create Event
            </Button>

            <Button
              onClick={() => navigate("/events/dashboard")}
              variant="light"
              color="blue"
              radius="xl"
              size="md"
              className="font-black px-8"
            >
              Dashboard
            </Button>

            <Button
              onClick={() => navigate("/events/rsvp")}
              variant="light"
              color="blue"
              radius="xl"
              size="md"
              className="font-black px-8"
            >
              RSVPs
            </Button>
            
            <Button
              onClick={() => navigate("/events/request")}
              variant="light"
              color="blue"
              radius="xl"
              size="md"
              className="font-black px-8"
            >
              Requests
            </Button>
          </motion.div>
        )}

        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4"
          >
            Management Portal
          </motion.div>
          <motion.h1 
            className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Inventory</span>
          </motion.h1>
          <motion.p 
            className="text-lg text-slate-500 font-medium max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Comprehensive list of all curated events. Filter, manage, and monitor your community engagements.
          </motion.p>
        </div>

        {/* Search & Filters Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/70 backdrop-blur-xl p-6 rounded-[2.5rem] border border-slate-100 shadow-xl mb-12"
        >
          <div className="flex flex-col lg:flex-row items-center gap-6">
            {/* Search Input */}
            <div className="relative flex-1 w-full lg:w-auto">
               <input
                 type="text"
                 value={search}
                 placeholder="Search events by title..."
                 className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                 onChange={(e) => setSearch(e.target.value)}
               />
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
              <Select
                placeholder="Privacy"
                value={selectedType}
                data={typeOptions}
                radius="xl"
                size="md"
                className="w-full sm:w-44 font-bold"
                onChange={setSelectedType}
              />
              
              <Select
                placeholder="Status"
                value={selectedStatus}
                data={statusData}
                radius="xl"
                size="md"
                className="w-full sm:w-44 font-bold"
                onChange={setSelectedStatus}
              />

              <Button
                leftSection={<FiFilter />}
                onClick={() => setShowFilters(!showFilters)}
                variant={showFilters ? "filled" : "light"}
                color="blue"
                radius="xl"
                size="md"
                className="font-black px-6"
              >
                Filters
              </Button>
            </div>
          </div>

          {/* Advanced Filters Drawer */}
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="mt-6 pt-6 border-t border-slate-100 overflow-hidden"
            >
              <div className="flex flex-wrap gap-4 items-center">
                 <Select
                   placeholder="Attendance Mode"
                   value={selectedMode}
                   data={modeOptions}
                   radius="xl"
                   className="w-full sm:w-48 font-bold"
                   onChange={setSelectedMode}
                 />

                 <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Quick Tags:</span>
                    {categories.map((cat) => (
                       <button
                         key={cat}
                         onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
                         className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            selectedCategory === cat 
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                              : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                         }`}
                       >
                         {cat}
                       </button>
                    ))}
                 </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {events.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
               <p className="text-slate-400 font-black uppercase tracking-widest">No matching events found</p>
            </div>
          ) : (
            events.map((event, i) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <EventCard
                  imageUrl={event.image}
                  date={event.startDate}
                  category={event.category}
                  title={event.title}
                  id={event._id}
                />
              </motion.div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-20 flex justify-center"
          >
            <Pagination 
              value={page} 
              onChange={setPage} 
              total={totalPages} 
              radius="xl"
              size="lg"
              className="font-black"
            />
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default CreatedEvents;
