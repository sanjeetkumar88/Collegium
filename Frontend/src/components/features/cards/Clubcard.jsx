import React from "react";
import { Badge, Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaInfoCircle, FaPlus } from "react-icons/fa";

const ClubCard = ({ coverImg, profileImg, name, tags, status, id, onApply }) => {
  const navigate = useNavigate();

  const getStatusConfig = (status) => {
    switch (status) {
      case "Joined":
        return { color: "green", label: "Joined", icon: null };
      case "Applied":
        return { color: "yellow", label: "Pending", icon: null };
      default:
        return { color: "blue", label: "Join Club", icon: <FaPlus size={12} /> };
    }
  };

  const config = getStatusConfig(status);

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="group relative bg-white rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 overflow-hidden flex flex-col h-full"
    >
      {/* Cover Image */}
      <div className="relative h-32 overflow-hidden">
        <img 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          src={coverImg} 
          alt="Cover" 
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
      </div>

      {/* Profile Image & Content */}
      <div className="relative px-6 pb-8 flex flex-col flex-grow pt-10">
        <div className="absolute -top-10 left-6">
          <div className="p-1 bg-white rounded-2xl shadow-xl">
             <img 
               className="w-16 h-16 rounded-xl object-cover" 
               src={profileImg} 
               alt="Profile" 
             />
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-wider">
              {tag}
            </span>
          ))}
        </div>

        {/* Name */}
        <h2 className="text-xl font-black text-slate-900 mb-6 group-hover:text-blue-600 transition-colors line-clamp-1">
          {name}
        </h2>

        {/* Actions */}
        <div className="mt-auto grid grid-cols-2 gap-3">
          <Button 
            variant="light" 
            color="slate"
            radius="xl"
            size="md"
            className="bg-slate-50 text-slate-600 font-bold hover:bg-slate-100 border-none"
            onClick={() => navigate(`/community/${id}`)}
            leftSection={<FaInfoCircle size={14} />}
          >
            About
          </Button>
          
          <Button 
            variant={status === "Join Club" ? "filled" : "light"}
            color={config.color}
            radius="xl"
            size="md"
            className={`font-black shadow-lg ${status === "Join Club" ? 'shadow-blue-500/20' : ''}`}
            onClick={onApply}
            leftSection={config.icon}
          >
            {config.label}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ClubCard;