import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCamera } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify"; // Import toast

export default function EventCreateForm() {
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [userClubs, setUserClubs] = useState([]);
  const [isLeader, setIsLeader] = useState(false);
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

  const categories = [
    "Sports", "DSA", "MERN", "Cybersecurity", "JAVA Developer", "AI", "Data Science"
  ];

  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();
  const user = useAuth();

const [loadingClubs, setLoadingClubs] = useState(true);

useEffect(() => {
  const fetchClubs = async () => {
    try {
      const { data } = await axios.get("/club/mine");
      setUserClubs(data.clubs);
      setIsLeader(data.clubs.length > 0);
    } catch (err) {
      console.error("Error fetching user clubs", err);
    } finally {
      setLoadingClubs(false);
    }
  };
  fetchClubs();
}, []);

useEffect(() => {
  if (!loadingClubs && user.authUser.role === "student" && !isLeader) {
    navigate("/unauthorized");
  }
}, [loadingClubs, isLeader, navigate, user.authUser.role]);


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

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

    setLoading(true); // Set loading to true when submission starts
    const payload = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item, i) => payload.append(`${key}[${i}]`, item));
      } else {
        payload.append(key, value);
      }
    });

    if (imageFile) payload.append("image", imageFile);

    try {
      const { data } = await axios.post("/devevent/createevent", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // On success, show a success toast and reset the form
      toast.success("Event created successfully!");
      resetForm();
    } catch (err) {
      console.error("Event creation error:", err.response?.data || err.message);
      // On error, show an error toast
      toast.error("Failed to create event. Please try again.");
    } finally {
      setLoading(false); // Reset loading state after submission
    }
  };

  const resetForm = () => {
    setFormData({
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
    setImageFile(null);
    setPreview(null);
  };

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
          <label className="block text-sm font-medium mb-1">Organising Club *</label>
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

      {/* Image Upload */}
      <label className="block border-2 border-dashed border-blue-400 rounded-lg h-64 flex flex-col justify-center items-center cursor-pointer relative overflow-hidden bg-gray-50 hover:bg-blue-50 transition">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="object-cover w-full h-full rounded-lg"
          />
        ) : (
          <div className="text-center text-gray-500 flex flex-col items-center gap-2">
            <FaCamera className="text-3xl" />
            <p>Click to upload event image</p>
          </div>
        )}
      </label>

      {/* Input Fields */}
      {[["title", "Event Title *"], ["description", "Description *", "textarea"], ["startDateTime", "Start Date & Time *", "datetime-local"], ["endDateTime", "End Date & Time *", "datetime-local"], ["duration", "Duration (HH:MM) *", "text"], ["maxParticipants", "Max Participants", "number"], ["organiserName", "Organiser Name *"], ["organiserEmail", "Organiser Email *", "email"], ["organiserPhone", "Organiser Phone*", "tel"], ["price", "Price", "number"], ["language", "Language"], ["tnc", "Terms & Conditions", "textarea"], ["adminNotes", "Admin Notes", "textarea"]].map(([name, label, type = "text"]) => (
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
      <div>
  <label className="block text-sm font-medium mb-1">Category *</label>
  <select
    name="category"
    value={formData.category}
    onChange={handleChange}
    required
    className="w-full px-4 py-2 border border-gray-300 rounded"
  >
    <option value="">Select Category</option>
    {categories.map((category, i) => (
      <option key={i} value={category}>
        {category}
      </option>
    ))}
  </select>
</div>

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

      {/* Meet or Location Section */}
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
                <label className="block text-sm font-medium mb-1">{label}*</label>
                <input
                  type="text"
                  value={formData.meet[i]}
                  required
                  onChange={(e) =>
                    handleArrayChange(i, e.target.value, "meet")
                  }
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
                <label className="block text-sm font-medium mb-1">{label}*</label>
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
        disabled={loading} // Disable button when loading
        className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white font-semibold w-full"
      >
        {loading ? "Creating Event..." : "Create Event"} {/* Show loading text */}
      </motion.button>
    </motion.form>
  );
}
