import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useClub } from "../../context/ClubContext";
import UserOneLineCard from "../Cardcomp/UserOneLineCard";
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
      const response = await axios.get(`/club/${id}`);
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
      axios
        .get(`/club/${id}/members`)
        .then((res) => setMembers(res.data.members))
        .catch((err) => setError(err.message))
        .finally(() => setTabLoading("members", false));
    }
  }, [activeTab, id, refreshMembers]);

  useEffect(() => {
    if (activeTab === "coleaders") {
      setTabLoading("coleaders", true);
      axios
        .get(`/club/${id}/coleaders`)
        .then((res) => setCoLeaders(res.data.coleaders))
        .catch((err) => setError(err.message))
        .finally(() => setTabLoading("coleaders", false));
    }
  }, [activeTab, id, refreshLeaders]);

  useEffect(() => {
    if (activeTab === "applicants") {
      setTabLoading("applicants", true);
      axios
        .get(`/club/${id}/applicants`)
        .then((res) => setApplicants(res.data.applicants))
        .catch((err) => setError(err.message))
        .finally(() => setTabLoading("applicants", false));
    }
  }, [activeTab, id, refreshApplicants]);

  const canViewApplicants = club?.visibility === "private" && isPrivileged;

  const handleApply = async () => {
    setApplying(true);
    try {
      const response = await axios.post(`/club/${id}/joinclub`, {
        userId: authUser._id,
      });
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
      const res = await axios.patch(`/club/${id}/updatelogo`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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
      const res = await axios.patch(`/club/${id}/updatecoverimg`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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
      const res = await axios.patch(`/club/${id}/update`, {
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
      const res = await axios.patch(`/club/${id}/updatedescription`, {
        description: editDescriptionData,
      });
      setEditDescription(false);
      fetchClubDetails();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const tabButtonClasses = (tabName) =>
    `flex items-center gap-1 px-4 py-2 rounded-t-md transition-all duration-200 text-sm md:text-base font-medium ${
      activeTab === tabName
        ? "bg-yellow-400 text-black"
        : "bg-gray-200 text-gray-700 hover:bg-yellow-100"
    }`;

  if (loading)
    return <div className="text-center text-gray-700 py-20">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 py-20">{error}</div>;

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen p-6">
      <div className="max-w-[56rem] mx-auto">
        {/* Cover Section */}
        <motion.div
          className="relative w-full h-64 mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <img
            src={club.coverImg}
            alt="Cover"
            className="w-full h-full object-cover rounded-lg"
          />
          {isPrivileged && (
            <button
              className="absolute top-3 right-3 bg-white p-2 rounded-full shadow"
              title="Edit Cover"
              onClick={handleCoverClick}
            >
              <FaEdit />
            </button>
          )}
          <motion.img
            src={club.logo}
            alt="Club Logo"
            className="w-40 h-40 rounded-full border-4 border-white shadow-lg absolute -bottom-16 left-6 cursor-pointer"
            onClick={handleLogoClick}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />
        </motion.div>

        {/* Logo Modal */}
        {logoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-2xl w-[90%] max-w-md relative"
            >
              <button
                onClick={() => setLogoModalOpen(false)}
                className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl cursor-pointer"
              >
                ✖
              </button>
              <img
                src={club.logo}
                alt="Full Logo"
                className="w-40 h-40 mx-auto mb-4 rounded-full border-4 border-white shadow"
              />
              <label className="block text-center font-medium text-gray-800 mb-2">
                Upload New Logo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full file:py-2 file:px-4 file:border-0 file:bg-yellow-400 file:text-black file:rounded-md cursor-pointer"
              />
            </motion.div>
          </motion.div>
        )}

        {/* Cover Modal */}
        {coverModelOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-2xl w-[90%] max-w-md relative"
            >
              <button
                onClick={() => setCoverImageOpen(false)}
                className="absolute top-1 right-1 text-gray-600 hover:text-black text-xl cursor-pointer"
              >
                ✖
              </button>
              <img
                src={club.coverImg}
                alt="Cover"
                className="w-full h-40 object-cover rounded-lg mb-4 shadow"
              />
              <label className="block text-center font-medium text-gray-800 mb-2">
                Upload New Cover Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImageUpload}
                className="block w-full file:py-2 file:px-4 file:border-0 file:bg-yellow-400 file:text-black file:rounded-md cursor-pointer"
              />
            </motion.div>
          </motion.div>
        )}

        {/* Club Name and Apply Button */}
        <motion.div
          className="flex justify-between items-center mt-20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">{club.name}</h1>
          <button
            className="bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2 rounded-lg shadow font-semibold transition-all duration-200 flex items-center gap-2"
            onClick={handleApply}
            disabled={applying}
          >
            <FaUserCheck />
            {club.userStatus}
          </button>
        </motion.div>

        {/* Club Info */}
        <motion.div
          className="bg-white p-6 mt-6 rounded-lg shadow-lg border border-gray-200 relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
            <FaInfoCircle /> Club Info
          </h2>
          {isPrivileged && (
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
              title="Edit Info"
              onClick={() => setEditInfoOpen(true)}
            >
              <FaEdit />
            </button>
          )}
          <div className="grid grid-cols-2 gap-4 text-gray-700">
            <p>
              <FaCrown className="inline mr-1 text-yellow-600" />{" "}
              <strong>Leader:</strong> {club.leaderInfo[0]?.fullName}
            </p>
            <p>
              <FaUserTie className="inline mr-1 text-blue-600" />{" "}
              <strong>Mentor:</strong> {club.mentor[0]?.fullName}
            </p>
            <p>
              <FaUsers className="inline mr-1 text-green-600" />{" "}
              <strong>Total Members:</strong> {club.totalMembers}
            </p>
            <p>
              <FaEye className="inline mr-1 text-purple-600" />{" "}
              <strong>Visibility:</strong> {club.visibility}
            </p>
            <p className="col-span-2">
              <IoPricetagsSharp className="inline mr-1 text-purple-600" />
              <strong>Tags:</strong> {club.tags?.join(", ")}
            </p>
          </div>
        </motion.div>
{/* editInfoOpen */}
        {editInfoOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.form
              onSubmit={handleEditSubmit}
              className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md relative space-y-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                type="button"
                onClick={() => setEditInfoOpen(false)}
                className="absolute top-3 right-4 text-gray-500 text-xl"
              >
                ✖
              </button>
              <h2 className="text-xl font-bold text-center mb-2">
                Edit Club Info
              </h2>
              <input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleEditChange}
                placeholder="Club Name"
                className="w-full border px-4 py-2 rounded-md"
                required
              />
              <select
                name="visibility"
                value={editData.visibility}
                onChange={handleEditChange}
                className="w-full border px-4 py-2 rounded-md"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
              <input
                type="text"
                name="tags"
                value={editData.tags}
                onChange={handleEditChange}
                placeholder="Comma separated tags"
                className="w-full border px-4 py-2 rounded-md"
              />
              <input
                type="text"
                name="mentorId"
                value={editData.mentorId}
                onChange={handleEditChange}
                placeholder="Mentor User ID"
                className="w-full border px-4 py-2 rounded-md"
              />
              <button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-black py-2 rounded-md font-semibold"
              >
                Save Changes
              </button>
            </motion.form>
          </motion.div>
        )}

        {/* Tabs Section */}
        <motion.div
          className="mt-10 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <div className="flex space-x-2 border-b border-gray-200 px-4 pt-4">
            <button
              className={tabButtonClasses("description")}
              onClick={() => setActiveTab("description")}
            >
              <FaInfoCircle /> Description
            </button>
            <button
              className={tabButtonClasses("members")}
              onClick={() => setActiveTab("members")}
            >
              <FaUsers /> Members
            </button>
            <button
              className={tabButtonClasses("coleaders")}
              onClick={() => setActiveTab("coleaders")}
            >
              <FaUserShield /> Co-Leaders
            </button>
            {canViewApplicants && (
              <button
                className={tabButtonClasses("applicants")}
                onClick={() => setActiveTab("applicants")}
              >
                <FaUserPlus /> Applicants
              </button>
            )}
          </div>

          <div className="p-6 text-sm md:text-base">
            {activeTab === "description" && (
              <div className="relative">
                {isPrivileged && (
                  <button
                    className="absolute top-0 right-0 text-gray-500 hover:text-black"
                    title="Edit Description"
                    onClick={() => {
                      setEditDescriptionData(club.description || "");
                      setEditDescription(true);
                    }}
                  >
                    <FaEdit />
                  </button>
                )}
                <p>{club.description}</p>
              </div>
            )}
{/* Edit Description  */}
            {editDescription && (
              <motion.div
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.form
                  onSubmit={handleEditDescriptionSubmit}
                  className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-2xl w-[90%] max-w-md relative"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <button
                    type="button"
                    onClick={() => setEditDescription(false)}
                    className="absolute top-3 right-4 text-gray-600 text-xl"
                  >
                    ✖
                  </button>
                  <h2 className="text-lg font-semibold mb-3 text-center">
                    Edit Description
                  </h2>
                  <textarea
                    value={editDescriptionData}
                    onChange={(e) => setEditDescriptionData(e.target.value)}
                    rows={6}
                    className="w-full border px-3 py-2 rounded-md resize-none"
                    placeholder="Enter updated club description"
                    required
                  ></textarea>
                  <button
                    type="submit"
                    className="mt-4 w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-2 rounded-lg transition-all"
                  >
                    Save Changes
                  </button>
                </motion.form>
              </motion.div>
            )}

            {activeTab === "members" && loadingMap.members && (
              <p>Loading members...</p>
            )}
            {activeTab === "members" && !loadingMap.members && (
              <ul className="space-y-1">
                {members.length > 0 ? (
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
                  <p>No members found.</p>
                )}
              </ul>
            )}

            {activeTab === "coleaders" && loadingMap.coleaders && (
              <p>Loading co-leaders...</p>
            )}
            {activeTab === "coleaders" && !loadingMap.coleaders && (
              <ul className="space-y-1">
                {coLeaders.length > 0 ? (
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
                  <p>No co-leaders found.</p>
                )}
              </ul>
            )}

            {activeTab === "applicants" && loadingMap.applicants && (
              <p>Loading applicants...</p>
            )}
            {activeTab === "applicants" &&
              !loadingMap.applicants &&
              canViewApplicants && (
                <ul className="space-y-1">
                  {applicants.length > 0 ? (
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
                    <p>No applicants.</p>
                  )}
                </ul>
              )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
