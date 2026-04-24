import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Select, Chip, Button, Pagination } from "@mantine/core";
import { motion } from "framer-motion";
import { FiFilter } from "react-icons/fi";
import { FaBook } from "react-icons/fa";
import * as eventApi from "../api/event";
import { useAuth } from "../context/AuthContext";
import { useFetchClubLeader } from "../hooks/useFetchClubLeader";
import Header from "../components/features/event/dashboard/Header";
import EventCard from "../components/features/cards/EventCard";

function Events() {
  const [searchParams, setSearchParams] = useSearchParams();

  // States initialized from URL
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [selectedType, setSelectedType] = useState(
    searchParams.get("privacy") || ""
  );
  const [selectedMembership, setSelectedMembership] = useState(
    searchParams.get("membership") || ""
  );
  const [selectedMode, setSelectedMode] = useState(
    searchParams.get("mode") || ""
  );
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [showFilters, setShowFilters] = useState(false);
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;
  const user = useAuth();
  const navigate = useNavigate();
  const { isLeader } = useFetchClubLeader();

  const categories = [
    "Sports",
    "DSA",
    "MERN",
    "Cybersecurity",
    "JAVA Developer",
    "AI",
    "Data Science",
  ];

  const typeOptions = [
    { label: "All Upcoming Events", value: "" },
    { label: "Public", value: "public" },
    { label: "Private", value: "private" },
  ];

  const membershipOptions = [
    { label: "All", value: "" },
    { label: "Joined", value: "joined" },
    { label: "Not Joined", value: "not-joined" },
    { label: "Requested", value: "requested" },
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
      membership: selectedMembership,
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
  }, [
    selectedCategory,
    selectedType,
    selectedMembership,
    selectedMode,
    search,
    page,
  ]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await eventApi.getAllEvents({
          title: search,
          category: selectedCategory,
          privacy: selectedType,
          medium: selectedMode,
          participationStatus: selectedMembership,
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
  }, [
    search,
    selectedCategory,
    selectedType,
    selectedMode,
    selectedMembership,
    page,
  ]);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('/texture.svg')] opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-50/50 blur-[120px] rounded-full -ml-64 -mt-64" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-50/50 blur-[120px] rounded-full -mr-64 -mb-64" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Header Section for Admins/Teachers/Leaders */}
        {(user.authUser?.role === "admin" ||
          user.authUser?.role === "teacher" ||
          isLeader) && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl border border-white"
          >
            <Header
              dashboard={true}
              rsvp={true}
              request={true}
              yourEvent={true}
            />
          </motion.div>
        )}

        {/* Page Title */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-black tracking-tight mb-6"
          >
            <span className="text-gradient">Discover</span> Incredible Events
          </motion.h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Find the perfect events to elevate your skills, connect with peers,
            and explore new opportunities.
          </p>
        </div>

        {/* Filters Container */}
        <motion.div
          className="bg-slate-50/50 backdrop-blur-sm p-8 rounded-[2.5rem] border border-slate-200 shadow-sm mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            {/* Primary Controls */}
            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
              <Select
                placeholder="Club Type"
                value={selectedType}
                data={typeOptions}
                size="lg"
                radius="xl"
                className="flex-1 sm:flex-none sm:w-48"
                styles={{
                  input: { border: '1px solid #e2e8f0', fontWeight: 600 }
                }}
                onChange={setSelectedType}
                clearable
              />

              <Button
                leftSection={<FiFilter size={18} />}
                onClick={() => setShowFilters(!showFilters)}
                size="lg"
                radius="xl"
                variant={showFilters ? "filled" : "light"}
                className={showFilters ? "bg-blue-600" : "bg-blue-50 text-blue-600"}
              >
                {showFilters ? "Hide Filters" : "More Filters"}
              </Button>
            </div>

            {/* Category Scroll */}
            <div className="w-full lg:flex-1 overflow-hidden">
              <div className="flex overflow-x-auto pb-2 scrollbar-hide gap-3 justify-start lg:justify-end">
                {categories.map((cat, i) => (
                  <Chip
                    key={cat}
                    checked={selectedCategory === cat}
                    onChange={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
                    variant="filled"
                    color="blue"
                    radius="xl"
                    size="md"
                    className="flex-shrink-0"
                  >
                    {cat}
                  </Chip>
                ))}
              </div>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="mt-8 pt-8 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <Select
                placeholder="Event Mode"
                value={selectedMode}
                data={modeOptions}
                size="md"
                radius="lg"
                onChange={setSelectedMode}
                clearable
              />

              <Select
                placeholder="Membership"
                value={selectedMembership}
                data={membershipOptions}
                size="md"
                radius="lg"
                onChange={setSelectedMembership}
                clearable
              />

              <div className="relative group">
                <input
                  type="text"
                  value={search}
                  placeholder="Search events..."
                  className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
                  onChange={(e) => setSearch(e.target.value)}
                />
                <FiFilter className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500" />
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <motion.div
             className="bg-slate-50/50 rounded-[3rem] p-20 text-center border border-dashed border-slate-200"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
          >
             <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-xl text-blue-500 mb-8">
                <FaBook size={32} />
             </div>
             <h3 className="text-3xl font-black text-slate-900 mb-4">No Events Found</h3>
             <p className="text-slate-500 text-lg max-w-md mx-auto mb-10">
                We couldn't find any upcoming events matching your filters. Try widening your search.
             </p>
             <Button
                variant="white"
                size="xl"
                radius="xl"
                className="shadow-xl px-10 font-bold text-blue-600"
                onClick={() => {
                   setSelectedCategory("");
                   setSelectedType("");
                   setSelectedMode("");
                   setSelectedMembership("");
                   setSearch("");
                }}
             >
                Reset Filters
             </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {events.map((event, i) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <EventCard
                  imageUrl={event.image}
                  date={event.startDate}
                  category={event.category}
                  title={event.title}
                  id={event._id}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-20 flex justify-center">
            <Pagination 
               value={page} 
               onChange={setPage} 
               total={totalPages} 
               size="lg"
               radius="xl"
               color="blue"
               withEdges
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default Events;
