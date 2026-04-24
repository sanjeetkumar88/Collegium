import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FaUser, FaLock, FaBell, FaCamera, FaSave, 
  FaGraduationCap, FaBriefcase, FaTrophy, FaEdit 
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import * as userApi from "../api/user";
import { toast } from "react-toastify";

export default function Settings() {
  const { authUser, setAuthUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    bio: "",
    personalWebsite: "",
    socialLinks: { github: "", linkedin: "", portfolio: "" },
    contact: { phone: "", email: "" },
    education: [],
    projects: [],
    achievements: []
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userApi.getUserProfile();
        const { user, profile: userProfile } = res.data.data;
        setProfile({
          fullName: user.fullName || "",
          email: user.email || "",
          bio: userProfile?.bio || "",
          personalWebsite: userProfile?.personalWebsite || "",
          socialLinks: userProfile?.socialLinks || { github: "", linkedin: "", portfolio: "" },
          contact: userProfile?.contact || { phone: "", email: "" },
          education: userProfile?.education || [],
          projects: userProfile?.projects || [],
          achievements: userProfile?.achievements || []
        });
      } catch (err) {
        toast.error("Failed to fetch settings");
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setProfile(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (category, index, field, value) => {
    setProfile(prev => {
      const updated = [...prev[category]];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, [category]: updated };
    });
  };

  const addItem = (category, template) => {
    setProfile(prev => ({
      ...prev,
      [category]: [...prev[category], template]
    }));
  };

  const removeItem = (category, index) => {
    setProfile(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Update core account
      await userApi.updateAccount({ fullName: profile.fullName, email: profile.email });
      // 2. Update profile
      await userApi.updateProfile({ 
        bio: profile.bio, 
        personalWebsite: profile.personalWebsite,
        socialLinks: profile.socialLinks,
        contact: profile.contact,
        education: profile.education,
        projects: profile.projects,
        achievements: profile.achievements
      });
      
      toast.success("Settings updated successfully!");
      setAuthUser(prev => ({ ...prev, fullName: profile.fullName, email: profile.email }));
    } catch (err) {
      toast.error("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    const toastId = toast.loading("Uploading image...");
    try {
      const res = await userApi.updateAvatar(formData);
      setAuthUser(prev => ({ ...prev, avatar: res.data.data.avatar }));
      toast.update(toastId, { render: "Avatar updated!", type: "success", isLoading: false, autoClose: 3000 });
    } catch (err) {
      toast.update(toastId, { render: "Upload failed", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden pt-28 pb-20">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 blur-[120px] rounded-full -mr-48 -mt-48" />

      <main className="max-w-4xl mx-auto px-6 relative z-10">
        <header className="mb-12">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Account Settings</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">Manage your identity and preferences</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4 space-y-8">
                <div className="bg-slate-50 rounded-[2.5rem] p-8 text-center relative overflow-hidden group">
                    <div className="relative inline-block">
                        <img 
                            src={authUser?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} 
                            className="w-32 h-32 rounded-[2rem] object-cover border-4 border-white shadow-xl"
                            alt="avatar"
                        />
                        <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform shadow-lg border-2 border-white">
                            <FaCamera size={14} />
                            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                        </label>
                    </div>
                    <div className="mt-4">
                        <h4 className="font-black text-slate-900">{authUser?.fullName}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">@{authUser?.username}</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="md:col-span-8 space-y-8">
                <section className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-10 shadow-sm space-y-8">
                    <div className="flex items-center gap-4 text-blue-600">
                        <FaUser />
                        <h3 className="text-xs font-black uppercase tracking-widest">Personal Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Full Name</label>
                            <input 
                                name="fullName" 
                                value={profile.fullName} 
                                onChange={handleChange}
                                className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Email Address</label>
                            <input 
                                name="email" 
                                value={profile.email} 
                                onChange={handleChange}
                                className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Personal Website</label>
                            <input 
                                name="personalWebsite" 
                                value={profile.personalWebsite} 
                                onChange={handleChange}
                                placeholder="https://yourportfolio.com"
                                className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Phone Number</label>
                            <input 
                                name="contact.phone" 
                                value={profile.contact.phone} 
                                onChange={handleChange}
                                className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Biography</label>
                        <textarea 
                            name="bio" 
                            rows={4}
                            value={profile.bio} 
                            onChange={handleChange}
                            placeholder="Tell us about yourself..."
                            className="w-full bg-slate-50 border-none rounded-2xl p-4 font-medium outline-none focus:ring-4 focus:ring-blue-100 transition-all resize-none"
                        />
                    </div>
                </section>

                <section className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-10 shadow-sm space-y-8">
                    <div className="flex items-center gap-4 text-indigo-600">
                        <FaBell size={18} />
                        <h3 className="text-xs font-black uppercase tracking-widest">Social Presence</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">GitHub URL</label>
                            <input 
                                name="socialLinks.github" 
                                value={profile.socialLinks.github} 
                                onChange={handleChange}
                                placeholder="https://github.com/username"
                                className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">LinkedIn URL</label>
                            <input 
                                name="socialLinks.linkedin" 
                                value={profile.socialLinks.linkedin} 
                                onChange={handleChange}
                                placeholder="https://linkedin.com/in/username"
                                className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                            />
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-10 shadow-sm space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-blue-600">
                            <FaGraduationCap size={20} />
                            <h3 className="text-xs font-black uppercase tracking-widest">Education History</h3>
                        </div>
                        <button 
                            type="button"
                            onClick={() => addItem("education", { institution: "", degree: "", startYear: "", endYear: "", description: "" })}
                            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
                        >
                            + Add Education
                        </button>
                    </div>

                    <div className="space-y-6">
                        {profile.education.map((edu, idx) => (
                            <div key={idx} className="relative p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                                <button type="button" onClick={() => removeItem("education", idx)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors">✕</button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input 
                                        placeholder="Institution Name"
                                        value={edu.institution}
                                        onChange={(e) => handleArrayChange("education", idx, "institution", e.target.value)}
                                        className="bg-white border-none rounded-xl p-3 text-sm font-bold outline-none"
                                    />
                                    <input 
                                        placeholder="Degree/Field of Study"
                                        value={edu.degree}
                                        onChange={(e) => handleArrayChange("education", idx, "degree", e.target.value)}
                                        className="bg-white border-none rounded-xl p-3 text-sm font-bold outline-none"
                                    />
                                    <input 
                                        placeholder="Start Year"
                                        value={edu.startYear}
                                        onChange={(e) => handleArrayChange("education", idx, "startYear", e.target.value)}
                                        className="bg-white border-none rounded-xl p-3 text-sm font-bold outline-none"
                                    />
                                    <input 
                                        placeholder="End Year (or Present)"
                                        value={edu.endYear}
                                        onChange={(e) => handleArrayChange("education", idx, "endYear", e.target.value)}
                                        className="bg-white border-none rounded-xl p-3 text-sm font-bold outline-none"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-10 shadow-sm space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-indigo-600">
                            <FaBriefcase size={18} />
                            <h3 className="text-xs font-black uppercase tracking-widest">Featured Projects</h3>
                        </div>
                        <button 
                            type="button"
                            onClick={() => addItem("projects", { title: "", description: "", link: "", year: "" })}
                            className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
                        >
                            + Add Project
                        </button>
                    </div>

                    <div className="space-y-6">
                        {profile.projects.map((proj, idx) => (
                            <div key={idx} className="relative p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                                <button type="button" onClick={() => removeItem("projects", idx)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors">✕</button>
                                <input 
                                    placeholder="Project Title"
                                    value={proj.title}
                                    onChange={(e) => handleArrayChange("projects", idx, "title", e.target.value)}
                                    className="w-full bg-white border-none rounded-xl p-3 text-sm font-bold outline-none"
                                />
                                <textarea 
                                    placeholder="Brief description of your role and the project's impact..."
                                    value={proj.description}
                                    rows={3}
                                    onChange={(e) => handleArrayChange("projects", idx, "description", e.target.value)}
                                    className="w-full bg-white border-none rounded-xl p-3 text-sm font-medium outline-none resize-none"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input 
                                        placeholder="GitHub/Live Link"
                                        value={proj.link}
                                        onChange={(e) => handleArrayChange("projects", idx, "link", e.target.value)}
                                        className="bg-white border-none rounded-xl p-3 text-sm font-bold outline-none"
                                    />
                                    <input 
                                        placeholder="Year"
                                        value={proj.year}
                                        onChange={(e) => handleArrayChange("projects", idx, "year", e.target.value)}
                                        className="bg-white border-none rounded-xl p-3 text-sm font-bold outline-none"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-10 shadow-sm space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-amber-600">
                            <FaTrophy size={18} />
                            <h3 className="text-xs font-black uppercase tracking-widest">Achievements</h3>
                        </div>
                        <button 
                            type="button"
                            onClick={() => addItem("achievements", { title: "", description: "", date: "" })}
                            className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 hover:text-white transition-all"
                        >
                            + Add Award
                        </button>
                    </div>

                    <div className="space-y-6">
                        {profile.achievements.map((ach, idx) => (
                            <div key={idx} className="relative p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                                <button type="button" onClick={() => removeItem("achievements", idx)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors">✕</button>
                                <input 
                                    placeholder="Award/Honor Title"
                                    value={ach.title}
                                    onChange={(e) => handleArrayChange("achievements", idx, "title", e.target.value)}
                                    className="w-full bg-white border-none rounded-xl p-3 text-sm font-bold outline-none"
                                />
                                <textarea 
                                    placeholder="Describe the significance..."
                                    value={ach.description}
                                    rows={2}
                                    onChange={(e) => handleArrayChange("achievements", idx, "description", e.target.value)}
                                    className="w-full bg-white border-none rounded-xl p-3 text-sm font-medium outline-none resize-none"
                                />
                            </div>
                        ))}
                    </div>
                </section>

                <div className="flex justify-end">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="flex items-center gap-3 px-12 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95 disabled:opacity-50"
                    >
                        {loading ? "Saving..." : <><FaSave /> Save Changes</>}
                    </button>
                </div>
            </form>
        </div>
      </main>
    </div>
  );
}
