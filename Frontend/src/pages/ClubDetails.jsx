import React, { useEffect, useState } from "react";
import * as clubApi from "../api/club";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useClub } from "../context/ClubContext";
import UserOneLineCard from "../components/features/cards/UserOneLineCard";
import {
  FaUsers,
  FaUserShield,
  FaUserPlus,
  FaInfoCircle,
  FaCrown,
  FaEye,
  FaUserTie,
  FaUserCheck,
  FaEdit,
} from "react-icons/fa";
import { IoPricetagsSharp } from "react-icons/io5";
import { Button } from "@mantine/core";

export default function ClubDetail() {
  const { id } = useParams();
  const { authUser } = useAuth();
  const { refreshApplicants, refreshMembers, refreshLeaders } = useClub();

  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [currentUserRole, setCurrentUserRole] = useState("non-member");
  const [members, setMembers] = useState([]);
  const [coLeaders, setCoLeaders] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [applying, setApplying] = useState(false);
  const [logoModalOpen, setLogoModalOpen] = useState(false);
  const [coverModelOpen, setCoverImageOpen] = useState(false);
  const [editInfoOpen, setEditInfoOpen] = useState(false);
  const [editDescription, setEditDescription] = useState(false);
  const [editDescriptionData, setEditDescriptionData] = useState("");

  const [loadingMap, setLoadingMap] = useState({
    members: false,
    coleaders: false,
    applicants: false,
  });
  const [editData, setEditData] = useState({
    name: "",
    visibility: "public",
    tags: "",
    mentorId: "",
  });

  const setTabLoading = (key, value) => {
    setLoadingMap((prev) => ({ ...prev, [key]: value }));
  };

  const isPrivileged = ["leader", "mentor", "admin"].includes(currentUserRole);

  const fetchClubDetails = async () => {
    try {
      const response = await clubApi.getClubDetails(id);
      setClub(response.data);
      const role = authUser?.role === "admin" ? "admin" : response.data.role;
      setCurrentUserRole(role);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    
    fetchClubDetails();
  }, [id, authUser?.role, applying]);

  useEffect(() => {
    if (activeTab === "members") {
      setTabLoading("members", true);
      clubApi.getClubMembers(id)
        .then((res) => setMembers(res.data.members))
        .catch((err) => setError(err.message))
        .finally(() => setTabLoading("members", false));
    }
  }, [activeTab, id, refreshMembers]);

  useEffect(() => {
    if (activeTab === "coleaders") {
      setTabLoading("coleaders", true);
      clubApi.getClubCoLeaders(id)
        .then((res) => setCoLeaders(res.data.coleaders))
        .catch((err) => setError(err.message))
        .finally(() => setTabLoading("coleaders", false));
    }
  }, [activeTab, id, refreshLeaders]);

  useEffect(() => {
    if (activeTab === "applicants") {
      setTabLoading("applicants", true);
      clubApi.getClubApplicants(id)
        .then((res) => setApplicants(res.data.applicants))
        .catch((err) => setError(err.message))
        .finally(() => setTabLoading("applicants", false));
    }
  }, [activeTab, id, refreshApplicants]);

  const canViewApplicants = club?.visibility === "private" && isPrivileged;

  const handleApply = async () => {
    setApplying(true);
    try {
      const response = await clubApi.joinClub(id);
      if (response.data.success) {
        alert("Application submitted successfully!");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setApplying(false);
    }
  };

  const handleLogoClick = () => {
    if (isPrivileged) setLogoModalOpen(true);
  };

  const handleCoverClick = () => {
    if (isPrivileged) setCoverImageOpen(true);
  };


  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
  
    const formData = new FormData();
    formData.append("logo", file);

  
    try {
      const res = await clubApi.updateClubLogo(id, formData);
      alert("Logo updated successfully!");
      setLogoModalOpen(false);
      fetchClubDetails();
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Logo update failed.");
      setLogoModalOpen(false);
    }
  };
  
  const handleCoverImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("coverimg", file); // must match multer field name used in backend (req.files?.notes[0])
  
    try {
      const res = await clubApi.updateClubCoverImg(id, formData);
      alert("Cover image updated successfully!");
      setCoverImageOpen(false);
      fetchClubDetails();
      
    } catch (err) {
      console.error(err);
      alert("Cover image update failed.");
      setCoverImageOpen(false);
    }
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
    if (club && isPrivileged) {
      setEditData({
        name: club.name,
        visibility: club.visibility,
        tags: club.tags?.join(", "),
        mentorId: club.mentor[0]?._id || "",
      });
    }
  }, [club, isPrivileged]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await clubApi.updateClubDetails(id, {
        name: editData.name,
        visibility: editData.visibility,
        tags: editData.tags.split(",").map((tag) => tag.trim()),
        mentorId: editData.mentorId,
      });
      alert("Club updated successfully!");
      setEditInfoOpen(false);
      setClub((prev) => ({ ...prev, ...res.data.updatedClub }));
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const handleEditDescriptionSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await clubApi.updateClubDescription(id, editDescriptionData);
      setEditDescription(false);
      fetchClubDetails();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const tabButtonClasses = (tabName) =>
    `flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-300 font-black text-sm uppercase tracking-wider ${
      activeTab === tabName
        ? "bg-white text-blue-600 shadow-lg"
        : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"
    }`;

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="font-black text-slate-400 uppercase tracking-widest">Loading Community...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
         <div className="text-center">
            <h2 className="text-2xl font-black text-red-600 mb-2">Error Occurred</h2>
            <p className="font-medium text-slate-500">{error}</p>
         </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('/texture.svg')] opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50/50 blur-[120px] rounded-full -mr-96 -mt-96" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-cyan-50/50 blur-[120px] rounded-full -ml-96 -mb-96" />

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-20">
        {/* Cover Section */}
        <motion.div
          className="relative w-full h-[350px] mb-40 group"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={club.coverImg}
            alt="Cover"
            className="w-full h-full object-cover rounded-[3rem] shadow-2xl transition-transform duration-700 group-hover:scale-[1.01]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent rounded-[3rem]" />
          
          {isPrivileged && (
            <button
              className="absolute top-6 right-6 bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-xl text-blue-600 hover:bg-white transition-all active:scale-95"
              onClick={handleCoverClick}
            >
              <FaEdit size={18} />
            </button>
          )}

          {/* Logo & Name Section */}
          <div className="absolute -bottom-28 left-0 w-full px-12 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10">
            <motion.div
               className="relative shrink-0"
               initial={{ y: 40, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.3 }}
            >
              <div className="p-2 bg-white rounded-[2.5rem] shadow-2xl">
                <img
                  src={club.logo}
                  alt="Logo"
                  className="w-36 h-36 md:w-44 md:h-44 rounded-[2rem] object-cover cursor-pointer hover:scale-105 transition-transform bg-slate-50"
                  onClick={handleLogoClick}
                />
              </div>
              {isPrivileged && (
                 <button 
                  onClick={handleLogoClick}
                  className="absolute -bottom-2 -right-2 bg-blue-600 p-3 rounded-2xl border-4 border-white text-white shadow-xl hover:bg-blue-700 transition-colors"
                 >
                    <FaEdit size={14} />
                 </button>
              )}
            </motion.div>

            <div className="mb-4 text-center md:text-left space-y-2 flex-1 min-w-0">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight truncate leading-tight pb-1"
              >
                {club.name}
              </motion.h1>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-500 font-bold uppercase tracking-widest text-[10px]"
              >
                 <span className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                   <FaUsers size={12} /> {club.totalMembers} Members
                 </span>
                 <span className="flex items-center gap-1.5 bg-amber-50 text-amber-600 px-3 py-1 rounded-full">
                   <FaCrown size={12} /> Lead by {club.leaderInfo[0]?.fullName}
                 </span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 mt-32">
          {/* Left Column: Details & Tabs */}
          <div className="flex-1 space-y-12">
            {/* Action Bar */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="flex flex-col sm:flex-row items-center justify-between gap-8 bg-white/40 backdrop-blur-2xl p-6 sm:p-10 rounded-[3rem] border border-white/60 shadow-xl shadow-slate-200/40"
            >
              <div className="space-y-2 text-center sm:text-left">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Community Access</p>
                 <div className="flex items-center gap-3 justify-center sm:justify-start">
                    <div className={`p-2.5 rounded-xl ${club.visibility === 'public' ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'}`}>
                       {club.visibility === 'public' ? <FaEye size={20} /> : <FaUserShield size={20} />}
                    </div>
                    <div>
                      <p className="text-xl font-black text-slate-800 capitalize leading-none">{club.visibility} Community</p>
                      <p className="text-xs font-bold text-slate-400 mt-1">Open for all students to join</p>
                    </div>
                 </div>
              </div>

              <Button
                variant="gradient"
                gradient={{ from: '#2563eb', to: '#0891b2' }}
                size="xl"
                radius="2rem"
                className="font-black px-14 h-16 shadow-2xl shadow-blue-500/30 active:scale-95 transition-all text-lg group"
                onClick={handleApply}
                disabled={applying}
                leftSection={<FaUserCheck className="group-hover:scale-110 transition-transform" />}
              >
                {club.userStatus}
              </Button>
            </motion.div>

            {/* Tabs & Content */}
            <div className="space-y-8">
              <div className="flex p-1.5 bg-slate-100/50 rounded-[1.5rem] w-max max-w-full overflow-x-auto scrollbar-hide">
                <button className={tabButtonClasses("description")} onClick={() => setActiveTab("description")}>
                  <FaInfoCircle /> About
                </button>
                <button className={tabButtonClasses("members")} onClick={() => setActiveTab("members")}>
                  <FaUsers /> Members
                </button>
                <button className={tabButtonClasses("coleaders")} onClick={() => setActiveTab("coleaders")}>
                  <FaUserShield /> Leaders
                </button>
                {canViewApplicants && (
                  <button className={tabButtonClasses("applicants")} onClick={() => setActiveTab("applicants")}>
                    <FaUserPlus /> Applicants
                  </button>
                )}
              </div>

              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="min-h-[300px]"
              >
                {activeTab === "description" && (
                  <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative">
                    {isPrivileged && (
                      <button
                        className="absolute top-8 right-8 text-slate-400 hover:text-blue-600 transition-colors"
                        onClick={() => {
                          setEditDescriptionData(club.description || "");
                          setEditDescription(true);
                        }}
                      >
                        <FaEdit size={18} />
                      </button>
                    )}
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">About the Community</h3>
                    <p className="text-lg text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                       {club.description}
                    </p>
                  </div>
                )}

                {activeTab === "members" && (
                   <div className="space-y-4">
                      {loadingMap.members ? (
                         <div className="py-12 text-center text-slate-400 font-bold uppercase tracking-widest">Loading members...</div>
                      ) : members.length > 0 ? (
                        members.map((member) => (
                          <UserOneLineCard
                            key={member._id}
                            user={{
                              avatar: member.avatar,
                              name: member.name,
                              username: member.username,
                              phone: "+91 9876543215",
                            }}
                            currentUserRole={currentUserRole}
                            tabContext="members"
                            applicantId={member._id}
                            clubId={id}
                          />
                        ))
                      ) : (
                        <div className="py-12 text-center text-slate-400 font-bold uppercase tracking-widest bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">No members yet</div>
                      )}
                   </div>
                )}

                {activeTab === "coleaders" && (
                   <div className="space-y-4">
                      {loadingMap.coleaders ? (
                         <div className="py-12 text-center text-slate-400 font-bold uppercase tracking-widest">Loading leaders...</div>
                      ) : coLeaders.length > 0 ? (
                        coLeaders.map((co) => (
                          <UserOneLineCard
                            key={co._id}
                            user={{
                              avatar: co.avatar,
                              name: co.name,
                              username: co.username,
                              phone: "+91 9876543215",
                            }}
                            currentUserRole={currentUserRole}
                            tabContext="co-leaders"
                            applicantId={co._id}
                            clubId={id}
                          />
                        ))
                      ) : (
                        <div className="py-12 text-center text-slate-400 font-bold uppercase tracking-widest bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">No co-leaders assigned</div>
                      )}
                   </div>
                )}

                {activeTab === "applicants" && canViewApplicants && (
                   <div className="space-y-4">
                      {loadingMap.applicants ? (
                         <div className="py-12 text-center text-slate-400 font-bold uppercase tracking-widest">Loading applicants...</div>
                      ) : applicants.length > 0 ? (
                        applicants.map((applicant) => (
                          <UserOneLineCard
                            key={applicant._id}
                            user={{
                              avatar: applicant.avatar,
                              name: applicant.name,
                              username: applicant.username,
                              phone: "+91 9876543215",
                            }}
                            currentUserRole={currentUserRole}
                            tabContext="applicants"
                            applicantId={applicant._id}
                            clubId={id}
                          />
                        ))
                      ) : (
                        <div className="py-12 text-center text-slate-400 font-bold uppercase tracking-widest bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">No pending applications</div>
                      )}
                   </div>
                )}
              </motion.div>
            </div>
          </div>

          {/* Right Column: Metadata */}
          <div className="w-full lg:w-80 space-y-8 lg:sticky lg:top-28">
             <motion.div
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.4 }}
               className="bg-white/60 backdrop-blur-xl p-8 rounded-[3rem] border border-white shadow-xl space-y-10"
             >
                <div className="space-y-6">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Community Mentor</h4>
                   <div className="p-6 bg-blue-50/50 rounded-[2rem] border border-blue-100/50 flex flex-col items-center text-center gap-4">
                      <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                         <FaUserTie size={36} />
                      </div>
                      <div>
                         <p className="font-black text-slate-900 text-lg leading-tight">
                           {club.mentor && club.mentor.length > 0 ? club.mentor[0]?.fullName : 'No Mentor'}
                         </p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Primary Guidance</p>
                      </div>
                   </div>
                </div>

                <div className="space-y-6">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Tags & Focus</h4>
                   <div className="flex flex-wrap gap-2 px-2">
                      {club.tags?.length > 0 ? club.tags.map((tag, i) => (
                        <span key={i} className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black text-blue-600 uppercase tracking-widest shadow-sm hover:shadow-md transition-shadow">
                           {tag}
                        </span>
                      )) : (
                        <p className="text-xs font-bold text-slate-400 italic">No tags listed</p>
                      )}
                   </div>
                </div>

                {isPrivileged && (
                   <div className="pt-8 border-t border-slate-100 px-2">
                      <Button
                        fullWidth
                        variant="light"
                        color="blue"
                        radius="xl"
                        size="md"
                        leftSection={<FaEdit />}
                        onClick={() => setEditInfoOpen(true)}
                        className="font-black h-12"
                      >
                         Community Settings
                      </Button>
                   </div>
                )}
             </motion.div>
          </div>
        </div>
      </main>

      {/* Modern Modals */}
      {/* (Keep existing modal logic but wrap in modern UI patterns) */}
      {(logoModalOpen || coverModelOpen || editInfoOpen || editDescription) && (
        <div className="fixed inset-0 z-[200] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6">
           <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-10 relative overflow-hidden"
           >
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50/50 blur-3xl rounded-full -mr-20 -mt-20" />
              
              <button 
                onClick={() => {
                   setLogoModalOpen(false);
                   setCoverImageOpen(false);
                   setEditInfoOpen(false);
                   setEditDescription(false);
                }}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors"
              >
                 ✖
              </button>

              {logoModalOpen && (
                <div className="relative z-10 space-y-8">
                   <div className="text-center">
                      <h3 className="text-2xl font-black text-slate-900 mb-2">Update Logo</h3>
                      <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">JPG, PNG or SVG</p>
                   </div>
                   <div className="flex justify-center">
                      <img src={club.logo} className="w-32 h-32 rounded-3xl border-4 border-slate-50 shadow-xl" />
                   </div>
                   <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-black file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 cursor-pointer" />
                </div>
              )}

              {coverModelOpen && (
                <div className="relative z-10 space-y-8">
                   <div className="text-center">
                      <h3 className="text-2xl font-black text-slate-900 mb-2">Update Cover</h3>
                      <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">Recommend 1200x400px</p>
                   </div>
                   <div className="flex justify-center">
                      <img src={club.coverImg} className="w-full h-32 object-cover rounded-2xl border-4 border-slate-50 shadow-xl" />
                   </div>
                   <input type="file" accept="image/*" onChange={handleCoverImageUpload} className="block w-full text-sm file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-black file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 cursor-pointer" />
                </div>
              )}

              {editInfoOpen && (
                <form onSubmit={handleEditSubmit} className="relative z-10 space-y-6">
                   <h3 className="text-2xl font-black text-slate-900 text-center">Community Settings</h3>
                   <div className="space-y-4">
                      <div className="space-y-1">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Community Name</label>
                         <input name="name" value={editData.name} onChange={handleEditChange} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all" />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Visibility</label>
                         <select name="visibility" value={editData.visibility} onChange={handleEditChange} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all appearance-none cursor-pointer">
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                         </select>
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Tags (Comma Separated)</label>
                         <input name="tags" value={editData.tags} onChange={handleEditChange} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all" />
                      </div>
                   </div>
                   <Button fullWidth size="xl" radius="xl" type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-black shadow-xl shadow-blue-500/20">
                      Save Changes
                   </Button>
                </form>
              )}

              {editDescription && (
                <form onSubmit={handleEditDescriptionSubmit} className="relative z-10 space-y-6">
                   <h3 className="text-2xl font-black text-slate-900 text-center">Edit Description</h3>
                   <textarea
                     value={editDescriptionData}
                     onChange={(e) => setEditDescriptionData(e.target.value)}
                     rows={8}
                     className="w-full bg-slate-50 border-none rounded-2xl p-6 font-medium outline-none focus:ring-4 focus:ring-blue-100 transition-all resize-none"
                     placeholder="Tell the community what you're all about..."
                   />
                   <Button fullWidth size="xl" radius="xl" type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-black shadow-xl shadow-blue-500/20">
                      Update About
                   </Button>
                </form>
              )}
           </motion.div>
        </div>
      )}
    </div>
  );
}
