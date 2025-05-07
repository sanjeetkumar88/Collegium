import EventImage from "../Eventdetail/EventImage";
import EventSidebar from "../Eventdetail/EventSidebar";
import EventAbout from "../Eventdetail/EventAbout";
import EventTerms from "../Eventdetail/EventTerms";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useAuth } from "../../context/Authcontext";
import { toast } from "react-toastify";

const EventDetails = () => {
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuth();

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        const res = await axios.get(`/devevent/geteventdetail/${id}`);
        setEventDetails(res.data);
      } catch (err) {
        setError("Failed to fetch event details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetail();
  }, [id]);

  const handleRegister = async () => {
    try {
      const response = await axios.post(`/devevent/${id}/register`, null, {
        withCredentials: true, 
      });
  
      toast.success(response.data.message || "Successfully registered.");
      // optionally, update local state if needed (e.g., show 'Registered' button)
    } catch (error) {
      const errMsg =
        error?.response?.data?.message || "Something went wrong. Try again.";
      toast.error(errMsg);
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirm) return;

    try {
      await axios.get(`/devevent/delete/${id}`);
      navigate("/events");
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Failed to delete the event.");
    }
  };

  const handleEdit = () => {
    navigate(`/events/${id}/edit`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bg-gray-50 p-4">
      {/* Top Left Buttons with Framer Motion */}
      <motion.div
        className="flex justify-start gap-4 mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {(user.authUser.role === "admin" ||
          eventDetails.createdBy === user.authUser.id) && (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEdit}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
            >
              <FaEdit />
              Edit Event
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDelete}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
            >
              <FaTrashAlt />
              Delete Event
            </motion.button>
          </>
        )}
      </motion.div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 mt-6 items-start">
        <div className="w-full lg:w-2/3 space-y-6">
          <EventImage imageUrl={eventDetails.image} />
          <EventAbout
            description={eventDetails.description}
            startDateTime={eventDetails.startDateTime}
            venue={eventDetails.location[0]}
          />
          <EventTerms />
        </div>

        <EventSidebar
          title={eventDetails.title}
          category={eventDetails.category}
          date={eventDetails.startDateTime}
          location={eventDetails.location}
          meet={eventDetails.meet}
          price={eventDetails.price}
          duration={eventDetails.duration}
          onClick = {handleRegister}
        />
      </div>
    </div>
  );
};

export default EventDetails;
