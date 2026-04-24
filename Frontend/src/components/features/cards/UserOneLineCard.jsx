import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { EllipsisVertical, MessageSquare, Phone, User, Shield, Crown } from "lucide-react";
import { useClub } from "../../../context/ClubContext";

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
          { label: "✅ Approve User", action: "approve" },
          { label: "❌ Reject Application", action: "reject" },
        ];
      case "co-leaders":
        return [
          { label: "👑 Promote to Leader", action: "makeLeader" },
          { label: "🗑️ Remove Leadership", action: "removeCoLeader" },
        ];
      case "members":
        return [
          { label: "🤝 Make Co-Leader", action: "makeCoLeader" },
          { label: "🚫 Remove from Club", action: "remove" },
        ];
      default:
        return [];
    }
  }, [tabContext]);

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
      className="flex items-center justify-between bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* User Info */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <img
            src={user.avatar}
            alt="avatar"
            className="w-14 h-14 rounded-2xl object-cover shadow-lg border-4 border-slate-50"
          />
          {tabContext === 'co-leaders' && (
             <div className="absolute -top-2 -right-2 bg-indigo-500 text-white p-1 rounded-lg shadow-lg">
                <Shield size={12} />
             </div>
          )}
        </div>
        <div>
          <h4 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">{user.name}</h4>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">@{user.username}</p>
        </div>
      </div>

      {/* Actions & Contact */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2">
           <button className="p-3 bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-all active:scale-95">
              <MessageSquare size={18} />
           </button>
           <button className="p-3 bg-slate-50 text-slate-400 hover:bg-green-50 hover:text-green-600 rounded-2xl transition-all active:scale-95">
              <Phone size={18} />
           </button>
        </div>

        {isPrivileged && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="p-3 bg-slate-50 text-slate-400 hover:bg-slate-100 rounded-2xl transition-all active:scale-95"
            >
              <EllipsisVertical size={20} />
            </button>

            {menuOpen && (
              <motion.div
                className="absolute right-0 top-full mt-3 w-64 bg-white rounded-[1.5rem] shadow-2xl border border-slate-100 p-2 z-[100] overflow-hidden"
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
              >
                {actionOptions.map(({ label, action }) => (
                  <button
                    key={action}
                    onClick={() => handleAction(action)}
                    className={`w-full text-left px-5 py-3 text-sm font-black rounded-xl transition-all ${
                      label.includes("Remove") || label.includes("Reject")
                        ? "text-red-500 hover:bg-red-50"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
