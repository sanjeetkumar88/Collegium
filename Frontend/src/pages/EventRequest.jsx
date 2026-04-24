import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useDebounce from "../hooks/useDebounce";
import * as eventApi from "../api/event";
import Header from "../components/features/event/dashboard/Header";
import SearchBar from "../components/features/event/dashboard/SearchBar";
import EventList from "../components/features/event/dashboard/EventList";
import Loader from "../components/common/Loader";
import SideBar from "../components/features/event/dashboard/SideBar";
import { useAuth } from "../context/AuthContext";
import { useFetchClubLeader } from "../hooks/useFetchClubLeader";

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

function EventRequest() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Sidebar State
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const {isLeader} = useFetchClubLeader();
  const user = useAuth();

  // Reset page when search term changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm]);

  // Fetch events whenever page or search term changes
  useEffect(() => {
    fetchEvents();
  }, [debouncedSearchTerm, page]);

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const response = await eventApi.getRequests({ title: debouncedSearchTerm, page, limit });

      const fetchedEvents = response.data.data;
      const totalItems = response.data.total || 0;
      const calculatedTotalPages = Math.ceil(totalItems / limit);

      setEvents(fetchedEvents);
      setTotalPages(calculatedTotalPages);
      setError(null);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = async (event) => {
    setSelectedEvent(event);
    setIsSidebarOpen(true);

    try {
      setUsersLoading(true);
      const response = await eventApi.getWaitlistedUsers(event._id);
      setRegisteredUsers(response.data.users || []);
    } catch (err) {
      console.error("Error fetching registered users:", err);
      setRegisteredUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedEvent(null);
    setRegisteredUsers([]);
  };

  const handlePageChange = (direction) => {
    if (direction === "next" && page < totalPages) {
      setPage((prev) => prev + 1);
    } else if (direction === "prev" && page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('/texture.svg')] opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50/50 blur-[120px] rounded-full -mr-96 -mt-96" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-cyan-50/50 blur-[120px] rounded-full -ml-96 -mb-96" />

      <motion.main
        className="relative z-10 max-w-7xl mx-auto px-6 py-20"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Header 
          name="Requests" 
          title="Review and process entry requests for restricted events." 
          rsvp={true}
          dashboard={true}
          yourEvent={true}
        />

        <div className="bg-white/40 backdrop-blur-xl p-8 rounded-[3rem] border border-slate-100 shadow-2xl">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          <EventList 
            events={events} 
            error={error} 
            loading={loading} 
            onEventClick={handleEventClick} 
          />

          {loading && (
            <div className="flex justify-center py-20">
               <Loader text="Retrieving waitlists..." />
            </div>
          )}

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-6 mt-12 pt-8 border-t border-slate-50">
            <button
              className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${
                page === 1 ? "bg-slate-50 text-slate-300 cursor-not-allowed" : "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white shadow-lg shadow-blue-500/10"
              }`}
              onClick={() => handlePageChange("prev")}
              disabled={page === 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Page {page} of {totalPages}
            </span>

            <button
              className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${
                page === totalPages ? "bg-slate-50 text-slate-300 cursor-not-allowed" : "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white shadow-lg shadow-blue-500/10"
              }`}
              onClick={() => handlePageChange("next")}
              disabled={page === totalPages}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <SideBar 
          isOpen={isSidebarOpen} 
          event={selectedEvent} 
          onClose={closeSidebar} 
          members={registeredUsers} 
          refetchMembers={() => handleEventClick(selectedEvent)} 
          refetchEvents={fetchEvents} 
        />
      </motion.main>
    </div>
  );
}

export default EventRequest;
