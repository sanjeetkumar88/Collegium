import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { motion } from "framer-motion";
import { Select, Button, Chip, Pagination } from "@mantine/core";
import { FiFilter } from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router-dom";
import EventCard from "../Cardcomp/EventCard";
import { useAuth } from "../../context/AuthContext";

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
        const res = await axios.get("/devevent/createdevents", {
          params: {
            title: search,
            category: selectedCategory,
            privacy: selectedType,
            medium: selectedMode,
            status: selectedStatus,
            page,
            limit,
          },
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
    <div className="p-6">
      {(user.authUser?.role === "admin" || user.authUser?.role === "teacher") && (
  <div className="flex justify-end mb-4 gap-2">
    <Button
      onClick={() => navigate("/events/createevent")}
      variant="filled"
      color="blue"
      radius="md"
    >
      + Create Event
    </Button>

    <Button
    onClick={() => navigate("/events/dashboard")}
      variant="filled"
      color="blue"
      radius="md"
    >
      Dashboard
    </Button>

    <Button
    onClick={() => navigate("/events/rsvp")}
      variant="filled"
      color="blue"
      radius="md"
    >
      RSVP
    </Button>
     <Button
    onClick={() => navigate("/events/request")}
      variant="filled"
      color="blue"
      radius="md"
    >
      Request
    </Button>
    
  </div>
)}

      {/* Page Heading */}
      <motion.h1 className="text-5xl font-bold text-center text-gray-800 drop-shadow-sm tracking-wide mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        Discover Events
      </motion.h1>

      {/* Filter Row */}
      <motion.div className="flex flex-wrap justify-center items-center gap-4 text-center mb-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Select
          placeholder="Select club type"
          value={selectedType}
          data={typeOptions}
          w={180}
          styles={{ input: { borderRadius: "8px" } }}
          onChange={setSelectedType}
        />

        {/* Category Chips */}
        <div className="flex justify-center flex-1 min-w-[200px] overflow-x-auto whitespace-nowrap scrollbar-hide items-center">
          <div className="flex gap-3 w-max justify-center">
            {categories.map((cat, i) => (
              <motion.div key={cat}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Chip
                  checked={selectedCategory === cat}
                  onChange={() =>
                    setSelectedCategory(selectedCategory === cat ? "" : cat)
                  }
                  variant="light"
                  radius="md"
                >
                  {cat}
                </Chip>
              </motion.div>
            ))}
          </div>
        </div>

        <Button
          leftSection={<FiFilter size={16} />}
          onClick={() => setShowFilters(!showFilters)}
          variant="light"
          color="blue"
        >
          Filters
        </Button>
      </motion.div>

      {/* Additional Filters */}
      {showFilters && (
        <motion.div className="mt-4 flex flex-wrap justify-center gap-4 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Select
            placeholder="Mode"
            value={selectedMode}
            data={modeOptions}
            w={180}
            styles={{ input: { borderRadius: "8px" } }}
            onChange={setSelectedMode}
          />

          <input
            type="text"
            value={search}
            placeholder="Search by Name"
            className="w-full md:w-80 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select
            placeholder="Stauts"
            value={selectedStatus}
            data={statusData}
            w={180}
            styles={{ input: { borderRadius: "8px" } }}
            onChange={setSelectedStatus}
          />
        </motion.div>
      )}

      {/* Event Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {events.length === 0 ? (
          <motion.p className="text-center col-span-full text-gray-500 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No events found.
          </motion.p>
        ) : (
          events.map((event, i) => (
            <motion.div key={event._id}
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
        <motion.div className="pt-8 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Pagination value={page} onChange={setPage} total={totalPages} />
        </motion.div>
      )}
    </div>
  );
}

export default CreatedEvents;
