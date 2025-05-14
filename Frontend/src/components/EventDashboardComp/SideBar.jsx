import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaTimes,
  FaDownload,
  FaSearch,
  FaUser,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import axios from "axios";

const sidebarVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const SideBar = ({ isOpen, onClose, members = [], event, refetchMembers, refetchEvents }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMembers, setFilteredMembers] = useState(members);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = members.filter(
      (member) =>
        member.fullName.toLowerCase().includes(lowerCaseSearchTerm) ||
        member.email.toLowerCase().includes(lowerCaseSearchTerm) ||
        member.username.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredMembers(filtered);
  }, [searchTerm, members]);

  const handleDownload = async () => {
    if (!event?._id) return;

    try {
      const response = await axios.get(
        `/devevent/${event._id}/waitlisted-users/download`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `registered_users_${event._id}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  const handleMemberAction = async (memberId, action) => {
    if (!event?._id) {
      console.warn("Event ID is not available.");
      return;
    }

    try {
      const confirmAction = window.confirm(
        `Are you sure you want to ${action} this member?`
      );
      if (!confirmAction) return;

      const route = `/devevent/${event._id}/waitlist/${memberId}`;
      const payload = { action };

      await axios.post(route, payload);
      
      refetchEvents();
      refetchMembers();
    } catch (error) {
      console.error(`Error performing ${action} action:`, error);
    }
  };

  const handleDelete = async (memberId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to remove this member?"
      );
      if (!confirmDelete) return;

      await axios.post(`/devevent/${event._id}/remove-member/${memberId}`);
      
      refetchEvents();
      refetchMembers();
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };

  return (
    <motion.div
      className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 p-4"
      initial="hidden"
      animate={isOpen ? "visible" : "hidden"}
      variants={sidebarVariants}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Search Members</h2>
        <FaTimes
          className="cursor-pointer text-gray-600"
          onClick={() => {
            setSearchTerm("");
            setFilteredMembers([]);
            onClose();
          }}
        />
      </div>

      {/* Download Button */}
      {event?._id && (
        <button
          onClick={handleDownload}
          className="flex items-center justify-center bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 hover:bg-pink-600"
        >
          <FaDownload className="mr-2" />
          Download XLSX
        </button>
      )}

      {/* Search Field */}
      <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full mb-4">
        <input
          type="text"
          placeholder="Search by name, email, username"
          className="bg-transparent flex-1 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FaSearch className="text-gray-500" />
      </div>

      {/* Member List */}
      <div className="overflow-y-auto max-h-[calc(100vh-180px)]">
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-2 border-b"
            >
              {/* Member Info */}
              <div className="flex items-center">
                <div className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold uppercase mr-3">
                  {member.fullName.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{member.fullName}</p>
                  <p className="text-sm text-gray-500">{member.email}</p>
                  <p className="text-xs text-gray-400">{member.username}</p>
                </div>
              </div>

              {/* Action Icons */}
              <div className="flex items-center gap-2">
                <FaUser className="text-yellow-500 text-xl" />

                {/* Requested Users - Approve and Reject */}
                {event?.requestCount > 0 && (
                  <>
                    <FaCheckCircle
                      className="text-green-500 text-lg cursor-pointer hover:text-green-600"
                      onClick={() => handleMemberAction(member._id, "accept")}
                    />
                    <FaTimesCircle
                      className="text-red-500 text-lg cursor-pointer hover:text-red-600"
                      onClick={() => handleMemberAction(member._id, "reject")}
                    />
                  </>
                )}

                {/* Registered Users - Remove */}
                {event?.registeredCount > 0 && (
                  <FaTimesCircle
                    className="text-red-500 text-lg cursor-pointer hover:text-red-600"
                    onClick={() => handleDelete(member._id)}
                  />
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No members found.</p>
        )}
      </div>
    </motion.div>
  );
};

export default SideBar;
