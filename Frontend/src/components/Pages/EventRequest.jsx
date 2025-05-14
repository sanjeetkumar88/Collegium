import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useDebounce from "../../CustomHooks/useDebounce";
import axios from "axios";
import Header from "../EventDashboardComp/Header";
import SearchBar from "../EventDashboardComp/SearchBar";
import EventList from "../EventDashboardComp/EventList";
import Loader from "../EventDashboardComp/Loader";
import SideBar from "../EventDashboardComp/SideBar";
import { useAuth } from "../../context/AuthContext";
import { useFetchClubLeader } from "../../CustomHooks/useFetchClubLeader";

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

      const response = await axios.get("/devevent/getrequstedusers", {
        params: { title: debouncedSearchTerm, page, limit },
      });

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
      const response = await axios.get(`/devevent/${event._id}/waitlisted-users`);
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
    <motion.div
      className="relative min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 px-8 py-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Header name="Request" title="Manage and View Event Requests"
      rsvp={true}
      dashboard={true}
      yourEvent={true}
      />

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <EventList 
        events={events} 
        error={error} 
        loading={loading} 
        onEventClick={handleEventClick} 
      />

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          className={`px-4 py-2 bg-blue-500 text-white rounded ${
            page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
          }`}
          onClick={() => handlePageChange("prev")}
          disabled={page === 1}
        >
          Previous
        </button>

        <span className="text-gray-600">
          Page {page} of {totalPages}
        </span>

        <button
          className={`px-4 py-2 bg-blue-500 text-white rounded ${
            page === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
          }`}
          onClick={() => handlePageChange("next")}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>

      <SideBar 
        isOpen={isSidebarOpen} 
        event={selectedEvent} 
        onClose={closeSidebar} 
        members={registeredUsers} 
        refetchMembers={() => handleEventClick(selectedEvent)} 
        refetchEvents={fetchEvents} 
      />
    </motion.div>
  );
}

export default EventRequest;
