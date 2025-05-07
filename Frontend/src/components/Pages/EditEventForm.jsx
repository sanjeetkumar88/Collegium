import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/Authcontext";

export default function EditEventForm() {
  const [userClubs, setUserClubs] = useState([]);
  const [eventData, setEventData] = useState(null);
  const [formData, setFormData] = useState({
    clubId: "",
    title: "",
    description: "",
    category: "",
    status: "upcoming",
    startDateTime: "",
    endDateTime: "",
    duration: "",
    acceptingRsvp: false,
    acceptingAttendance: false,
    maxParticipants: "",
    privacy: "public",
    organiserName: "",
    organiserEmail: "",
    organiserPhone: "",
    price: "",
    language: "",
    tnc: "",
    adminNotes: "",
    medium: "online",
    meet: ["", "", ""],
    location: ["", "", ""],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
    const user = useAuth();
  
    const [isLeader, setIsLeader] = useState(false);

  // Fetch Event Details
  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        const res = await axios.get(`/devevent/geteventdetail/${id}`);
        setEventData(res.data);
      } catch (err) {
        setError("Failed to fetch event details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetail();
  }, [id]);

  // Fetch Clubs for User
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const { data } = await axios.get("/club/mine");
        setUserClubs(data.clubs);
        if(data.clubs.length > 0){
          setIsLeader(true);
        }

        
      } catch (err) {
        console.error("Error fetching user clubs", err);
      }
    };
    fetchClubs();
    if(user.authUser.role === "student" && !isLeader){
      navigate("/unauthorized");
    }
  }, []);

  // Update formData once eventData is fetched
  useEffect(() => {

    const formatDate = (date) => {
      const d = new Date(date);
      return d.toISOString().slice(0, 16); // "yyyy-MM-ddThh:mm"
    };

    if (eventData) {
      setFormData({
        clubId: eventData.clubId || "",
        title: eventData.title || "",
        description: eventData.description || "",
        category: eventData.category || "",
        status: eventData.status || "upcoming",
        startDateTime: formatDate(eventData.startDateTime) || "",
        endDateTime: formatDate(eventData.endDateTime) || "",
        duration: eventData.duration || "",
        acceptingRsvp: eventData.acceptingRsvp || false,
        acceptingAttendance: eventData.acceptingAttendance || false,
        maxParticipants: eventData.maxParticipants || "",
        privacy: eventData.privacy || "public",
        organiserName: eventData.organiserName || "",
        organiserEmail: eventData.organiserEmail || "",
        organiserPhone: eventData.organiserPhone || "",
        price: eventData.price || "",
        language: eventData.language || "",
        tnc: eventData.tnc || "",
        adminNotes: eventData.adminNotes || "",
        medium: eventData.medium || "online",
        meet: eventData.meet || ["", "", ""],
        location: eventData.location || ["", "", ""],
      });
    }
  }, [eventData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleArrayChange = (index, value, arrayName) => {
    const updated = [...formData[arrayName]];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, [arrayName]: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.put(`/devevent/editevent/${id}`, formData);
      alert("Event updated successfully!");
      console.log(response.data);
      navigate('/events')
    } catch (err) {
      console.error("Error updating event", err);
      alert(err.response?.data?.message || "Failed to update event");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto p-6 space-y-6 text-black bg-white rounded-lg shadow-md"
    >
      {/* Club Selector */}
      {userClubs.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Organising Club *
          </label>
          <select
            name="clubId"
            value={formData.clubId}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            required
          >
            <option value="">Select Club</option>
            {userClubs.map((club) => (
              <option key={club._id} value={club._id}>
                {club.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Input Fields */}
      {[["title", "Event Title *"], ["description", "Description *", "textarea"], ["category", "Category *"], ["startDateTime", "Start Date & Time *", "datetime-local"], ["endDateTime", "End Date & Time *", "datetime-local"], ["duration", "Duration (HH:MM) *", "text"], ["maxParticipants", "Max Participants", "number"], ["organiserName", "Organiser Name *"], ["organiserEmail", "Organiser Email *", "email"], ["organiserPhone", "Organiser Phone*", "tel"], ["price", "Price", "number"], ["language", "Language"], ["tnc", "Terms & Conditions", "textarea"], ["adminNotes", "Admin Notes", "textarea"]].map(([name, label, type = "text"]) => (
        <div key={name}>
          <label className="block text-sm font-medium mb-1">{label}</label>
          {type === "textarea" ? (
            <textarea
              name={name}
              onChange={handleChange}
              value={formData[name]}
              required={label.includes("*")}
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          ) : (
            <input
              type={type}
              name={name}
              onChange={handleChange}
              value={formData[name]}
              required={label.includes("*")}
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          )}
        </div>
      ))}

      {/* Privacy Select */}
      <div>
        <label className="block text-sm font-medium mb-1">Privacy</label>
        <select
          name="privacy"
          value={formData.privacy}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded"
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </div>

      {/* RSVP and Attendance */}
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="acceptingRsvp"
            checked={formData.acceptingRsvp}
            onChange={handleChange}
          />
          Accepting RSVP
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="acceptingAttendance"
            checked={formData.acceptingAttendance}
            onChange={handleChange}
          />
          Accepting Attendance
        </label>
      </div>

      {/* Medium Selector */}
      <div>
        <label className="block text-sm font-medium mb-1">Medium</label>
        <select
          name="medium"
          value={formData.medium}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded"
        >
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>
      </div>

      {/* Meet or Location Section (animated) */}
      <AnimatePresence mode="wait">
        {formData.medium === "online" ? (
          <motion.div
            key="meet"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            {["Meet Link", "Meet ID", "Meet Password"].map((label, i) => (
              <div key={i}>
                <label className="block text-sm font-medium mb-1">
                  {label}*
                </label>
                <input
                  type="text"
                  value={formData.meet[i]}
                  required
                  onChange={(e) => handleArrayChange(i, e.target.value, "meet")}
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                />
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="location"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            {["Venue", "Latitude", "Longitude"].map((label, i) => (
              <div key={i}>
                <label className="block text-sm font-medium mb-1">
                  {label}*
                </label>
                <input
                  type="text"
                  value={formData.location[i]}
                  onChange={(e) =>
                    handleArrayChange(i, e.target.value, "location")
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white font-semibold w-full"
      >
        Update Event
      </motion.button>
    </motion.form>
  );
}
