import React from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@mantine/core";

const buttonsConfig = [
  { key: "dashboard", label: "Dashboard", path: "/events/dashboard" },
  { key: "rsvp", label: "RSVPs", path: "/events/rsvp" },
  { key: "request", label: "Requests", path: "/events/waitlist-users" },
  { key: "yourEvent", label: "Your Events", path: "/events/createdevent?page=1" },
];

const Header = ({ name, title, ...props }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-10 mb-16">
      <div className="text-center lg:text-left space-y-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]"
        >
          Management Portal
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          {name}
        </h1>
        {title && (
          <p className="text-slate-500 font-medium text-lg">
            {title}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-3 justify-center lg:justify-end">
        <Button
          variant="gradient"
          gradient={{ from: "blue", to: "indigo" }}
          size="md"
          radius="xl"
          className="font-black px-8 shadow-xl shadow-blue-500/20"
          onClick={() => navigate("/events/createevent")}
        >
          + CREATE EVENT
        </Button>

        {buttonsConfig.map(({ key, label, path }) =>
          props[key] ? (
            <Button
              key={key}
              variant={location.pathname === path ? "filled" : "light"}
              color="blue"
              size="md"
              radius="xl"
              onClick={() => navigate(path)}
              className={`transition-all font-black px-6 ${
                location.pathname === path ? "shadow-lg shadow-blue-500/10" : ""
              }`}
            >
              {label.toUpperCase()}
            </Button>
          ) : null
        )}
      </div>
    </div>
  );
};

export default Header;
