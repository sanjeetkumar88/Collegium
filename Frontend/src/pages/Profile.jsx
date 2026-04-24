import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FaUser, FaEnvelope, FaGlobe, FaGithub, FaLinkedin, 
  FaGraduationCap, FaBriefcase, FaTrophy, FaEdit, FaCamera
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import * as userApi from "../api/user";
import { toast } from "react-toastify";

export default function Profile() {
  const { authUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userApi.getUserProfile();
        setProfileData(res.data.data);
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { user, profile } = profileData || {};

  const tabs = [
    { id: "about", label: "About", icon: <FaUser /> },
    { id: "education", label: "Education", icon: <FaGraduationCap /> },
    { id: "projects", label: "Projects", icon: <FaBriefcase /> },
    { id: "achievements", label: "Awards", icon: <FaTrophy /> },
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden pt-28 pb-20">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 blur-[120px] rounded-full -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-50/50 blur-[120px] rounded-full -ml-48 -mb-48" />

      <main className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Profile Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-blue-500/5 flex flex-col md:flex-row gap-10 items-center md:items-end mb-12"
        >
          <div className="relative group">
            <img 
              src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} 
              alt="avatar" 
              className="w-44 h-44 rounded-[2.5rem] object-cover shadow-2xl border-8 border-white"
            />
            <div className="absolute inset-0 bg-black/20 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <FaCamera className="text-white text-2xl" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="space-y-1">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">{user?.fullName}</h1>
                <p className="text-blue-600 font-black uppercase tracking-widest text-sm">@{user?.username} • {user?.role}</p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-slate-500 text-xs font-bold">
                    <FaEnvelope /> {user?.email}
                </div>
                {profile?.personalWebsite && (
                  <a href={profile.personalWebsite} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition-all">
                      <FaGlobe /> Portfolio
                  </a>
                )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
             <div className="flex gap-3">
                <a href={profile?.socialLinks?.github} className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:scale-110 transition-transform shadow-lg"><FaGithub size={20} /></a>
                <a href={profile?.socialLinks?.linkedin} className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center hover:scale-110 transition-transform shadow-lg"><FaLinkedin size={20} /></a>
             </div>
             <button 
              onClick={() => window.location.href = '/settings'}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm"
             >
                <FaEdit /> Edit Profile
             </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-3 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id 
                    ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20" 
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="lg:col-span-9">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm min-h-[400px]"
            >
              {activeTab === "about" && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Biography</h3>
                    <p className="text-lg text-slate-600 font-medium leading-relaxed">
                      {profile?.bio || "No biography provided yet. Head to settings to add your story!"}
                    </p>
                  </div>
                  
                  {profile?.contact && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-50">
                        <div className="space-y-2">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</h4>
                            <p className="font-bold text-slate-900">{profile.contact.phone || 'N/A'}</p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alt Email</h4>
                            <p className="font-bold text-slate-900">{profile.contact.email || 'N/A'}</p>
                        </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "education" && (
                <div className="space-y-8">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Academic Background</h3>
                  <div className="space-y-6">
                    {profile?.education?.length > 0 ? profile.education.map((edu, index) => (
                      <div key={index} className="flex gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                           <FaGraduationCap size={24} />
                        </div>
                        <div>
                           <h4 className="font-black text-slate-900 text-lg">{edu.institution}</h4>
                           <p className="text-blue-600 font-bold text-sm">{edu.degree}</p>
                           <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">{edu.startYear} - {edu.endYear || 'Present'}</p>
                        </div>
                      </div>
                    )) : (
                      <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest border-2 border-dashed border-slate-100 rounded-[2rem]">No education history added</div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "projects" && (
                <div className="space-y-8">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Featured Projects</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {profile?.projects?.length > 0 ? profile.projects.map((proj, index) => (
                      <div key={index} className="group p-8 rounded-[2rem] bg-white border border-slate-100 hover:border-blue-200 transition-all shadow-sm hover:shadow-xl hover:shadow-blue-500/5">
                         <h4 className="font-black text-slate-900 text-xl group-hover:text-blue-600 transition-colors">{proj.title}</h4>
                         <p className="text-slate-500 text-sm font-medium mt-3 line-clamp-3">{proj.description}</p>
                         {proj.link && (
                           <a href={proj.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-6 text-xs font-black text-blue-600 uppercase tracking-widest group-hover:gap-3 transition-all">
                              View Project ➜
                           </a>
                         )}
                      </div>
                    )) : (
                      <div className="col-span-full py-20 text-center text-slate-400 font-bold uppercase tracking-widest border-2 border-dashed border-slate-100 rounded-[2rem]">No projects showcased yet</div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "achievements" && (
                <div className="space-y-8">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Honors & Awards</h3>
                  <div className="space-y-4">
                    {profile?.achievements?.length > 0 ? profile.achievements.map((ach, index) => (
                      <div key={index} className="flex items-center gap-6 p-6 rounded-3xl bg-amber-50/50 border border-amber-100">
                         <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 shadow-sm shrink-0">
                           <FaTrophy size={20} />
                         </div>
                         <div>
                            <h4 className="font-black text-slate-900">{ach.title}</h4>
                            <p className="text-slate-500 text-xs font-bold mt-1">{ach.description}</p>
                         </div>
                      </div>
                    )) : (
                      <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest border-2 border-dashed border-slate-100 rounded-[2rem]">No achievements listed</div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
