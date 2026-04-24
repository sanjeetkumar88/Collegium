import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCamera } from "react-icons/fa";
import * as clubApi from "../api/club";
import * as eventApi from "../api/event";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify"; 

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
        const { data } = await clubApi.getMyClubs();
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
      const { data } = await eventApi.createEvent(payload);

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
    <div className="min-h-screen bg-white relative overflow-hidden py-20 px-6">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('/texture.svg')] opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50/50 blur-[120px] rounded-full -mr-96 -mt-96" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-cyan-50/50 blur-[120px] rounded-full -ml-96 -mb-96" />

      <main className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4"
          >
            Event Management
          </motion.div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Experience</span></h1>
          <p className="text-slate-500 font-medium text-lg">Bring your community together with a new event.</p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-xl p-10 md:p-16 rounded-[3rem] border border-slate-100 shadow-2xl space-y-12"
        >
          {/* Section 1: Identity */}
          <div className="space-y-8">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Identity & Visuals
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Club Selector */}
               {userClubs.length > 0 && (
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Organising Club *</label>
                   <select
                     name="clubId"
                     value={formData.clubId}
                     onChange={handleChange}
                     className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
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

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category, i) => (
                      <option key={i} value={category}>{category}</option>
                    ))}
                  </select>
               </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Event Poster *</label>
              <label className="block border-4 border-dashed border-slate-100 rounded-[2.5rem] h-64 flex flex-col justify-center items-center cursor-pointer relative overflow-hidden bg-slate-50/50 hover:bg-blue-50/50 hover:border-blue-200 transition-all group">
                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                {preview ? (
                  <img src={preview} alt="Preview" className="object-cover w-full h-full" />
                ) : (
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mx-auto shadow-sm text-slate-400 group-hover:text-blue-500 transition-colors">
                       <FaCamera size={24} />
                    </div>
                    <p className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Tap to upload high-res poster</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Section 2: Details */}
          <div className="space-y-8">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Event Narrative
             </h3>

             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Event Title *</label>
                   <input
                     name="title"
                     value={formData.title}
                     onChange={handleChange}
                     required
                     placeholder="A catchy name for your event..."
                     className="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Description *</label>
                   <textarea
                     name="description"
                     value={formData.description}
                     onChange={handleChange}
                     required
                     rows={5}
                     placeholder="What's this event about?"
                     className="w-full bg-slate-50 border-none rounded-2xl p-6 font-medium outline-none focus:ring-4 focus:ring-blue-100 transition-all resize-none"
                   />
                </div>
             </div>
          </div>

          {/* Section 3: Logistics */}
          <div className="space-y-8">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Logistics & Schedule
             </h3>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Start Date & Time *</label>
                   <input type="datetime-local" name="startDateTime" value={formData.startDateTime} onChange={handleChange} required className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">End Date & Time *</label>
                   <input type="datetime-local" name="endDateTime" value={formData.endDateTime} onChange={handleChange} required className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Medium</label>
                   <select name="medium" value={formData.medium} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all appearance-none cursor-pointer">
                     <option value="online">Online / Virtual</option>
                     <option value="offline">In-Person / Offline</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Privacy Level</label>
                   <select name="privacy" value={formData.privacy} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all appearance-none cursor-pointer">
                     <option value="public">Public (Everyone)</option>
                     <option value="private">Private (Invite Only)</option>
                   </select>
                </div>
             </div>

             <AnimatePresence mode="wait">
                <motion.div
                  key={formData.medium}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-blue-50/50 p-8 rounded-[2rem] border border-blue-100 space-y-6"
                >
                  {formData.medium === "online" ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       {["Meet Link", "Meet ID", "Meet Password"].map((label, i) => (
                         <div key={i} className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">{label}*</label>
                            <input type="text" value={formData.meet[i]} required onChange={(e) => handleArrayChange(i, e.target.value, "meet")} className="w-full bg-white border-none rounded-xl p-3 font-bold outline-none focus:ring-2 focus:ring-blue-200 shadow-sm" />
                         </div>
                       ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       {["Venue", "Latitude", "Longitude"].map((label, i) => (
                         <div key={i} className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">{label}*</label>
                            <input type="text" value={formData.location[i]} required onChange={(e) => handleArrayChange(i, e.target.value, "location")} className="w-full bg-white border-none rounded-xl p-3 font-bold outline-none focus:ring-2 focus:ring-blue-200 shadow-sm" />
                         </div>
                       ))}
                    </div>
                  )}
                </motion.div>
             </AnimatePresence>
          </div>

          {/* Section 4: Contact */}
          <div className="space-y-8">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Organiser Info
             </h3>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Name *</label>
                   <input name="organiserName" value={formData.organiserName} onChange={handleChange} required className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Email *</label>
                   <input type="email" name="organiserEmail" value={formData.organiserEmail} onChange={handleChange} required className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Phone *</label>
                   <input type="tel" name="organiserPhone" value={formData.organiserPhone} onChange={handleChange} required className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none" />
                </div>
             </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-[2rem] shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all uppercase tracking-[0.2em] disabled:opacity-50"
          >
            {loading ? "PROCESSING..." : "LAUNCH EVENT"}
          </motion.button>
        </motion.form>
      </main>
    </div>
  );
}
