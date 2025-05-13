import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import useDebounce from "../../CustomHooks/useDebounce";
import axios from "axios";
import Header from "../EventDashboardComp/Header";
import SearchBar from "../EventDashboardComp/SearchBar";
import EventList from "../EventDashboardComp/EventList";
import Loader from "../EventDashboardComp/Loader";

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

function EventRSVPs() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  
  useEffect(() => {
    setEvents([]);
    setPage(1);
    setHasMore(true);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (!hasMore || loading) return;
    fetchEvents();
  }, [debouncedSearchTerm, page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { rootMargin: "100px" }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/devevent/rsvps", {
        params: { title: debouncedSearchTerm, page, limit: 10 },
      });
      const fetchedEvents = response.data.data;
      setEvents((prev) => [...prev, ...fetchedEvents]);
      if (fetchedEvents.length < 10) setHasMore(false);
    } catch {
      setError("Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 px-8 py-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Header name="RSVPs" title="Manage and view event RSVPs" />
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <EventList events={events} error={error} loading={loading} loaderRef={loaderRef} />

      {loading && page > 1 && <Loader text="Loading more events..." />}
    </motion.div>
  );
}

export default EventRSVPs;
