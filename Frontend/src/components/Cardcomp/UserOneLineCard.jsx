import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { EllipsisVertical } from "lucide-react";
import { useClub } from "../../context/ClubContext";

export default function UserOneLineCard({
  user,
  currentUserRole,
  tabContext,
  clubId,
  applicantId,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const {
    approveApplicant,
    rejectApplicant,
    removeMember,
    makeLeader,
    makeCoLeader,
    removeCoLeader,
  } = useClub();

  const dropdownRef = useRef();

  const isPrivileged = ["mentor", "leader", "admin"].includes(currentUserRole);

  const handleAction = async (action) => {
    setMenuOpen(false);
    switch (action) {
      case "approve":
        await approveApplicant(clubId, applicantId);
        break;
      case "reject":
        await rejectApplicant(clubId, applicantId);
        break;
      case "remove":
        await removeMember(clubId, applicantId);
        break;
      case "makeLeader":
        await makeLeader(clubId, applicantId);
        break;
      case "makeCoLeader":
        await makeCoLeader(clubId, applicantId);
        break;
      case "removeCoLeader":
        await removeCoLeader(clubId, applicantId);
        break;
      default:
        break;
    }
  };

  const actionOptions = useMemo(() => {
    switch (tabContext) {
      case "applicants":
        return [
          { label: "✅ Approve", action: "approve" },
          { label: "❌ Reject", action: "reject" },
        ];
      case "co-leaders":
        return [
          { label: "👑 Make Leader", action: "makeLeader" },
          { label: "🗑️ Remove Co-Leader", action: "removeCoLeader" },
        ];
      case "members":
        return [
          { label: "🤝 Make Co-Leader", action: "makeCoLeader" },
          { label: "🚫 Remove", action: "remove" },
        ];
      default:
        return [];
    }
  }, [tabContext]);

  // Close menu if clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.div
      className="flex flex-col sm:flex-row justify-between sm:items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-lg transition-all mb-4 relative gap-3 sm:gap-0 z-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Left: Avatar + Name */}
      <div className="flex items-center gap-4">
        <img
          src={user.avatar}
          alt="avatar"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">
            {user.name}
          </p>
          <p className="text-sm text-gray-500">@{user.username}</p>
        </div>
      </div>

      {/* Center: Contact Info */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <span>📞 {user.phone}</span>
        <div className="flex gap-2">
          <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-200">
            Message
          </button>
          <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-600">
            Contact
          </button>
        </div>
      </div>

      {/* Right: Action Dropdown */}
      {isPrivileged && (
        <div className="relative self-start sm:self-center" ref={dropdownRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition"
          >
            <EllipsisVertical className="w-5 h-5 text-gray-600 dark:text-white" />
          </button>

          {menuOpen && (
            <motion.div
              className="absolute right-0 bottom-full mb-2 w-52 origin-bottom-right bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl z-50 overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {actionOptions.map(({ label, action }) => (
                <button
                  key={action}
                  onClick={() => handleAction(action)}
                  className={`w-full text-left px-4 py-2 text-sm font-medium transition hover:bg-gray-100 dark:hover:bg-gray-600 ${
                    label.toLowerCase().includes("remove") ||
                    label.toLowerCase().includes("reject")
                      ? "text-red-500"
                      : "text-gray-800 dark:text-gray-100"
                  }`}
                >
                  {label}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
}
