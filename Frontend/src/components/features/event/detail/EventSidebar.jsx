import React from "react";
import {
  FaRegCalendarAlt,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaBookmark,
  FaLink,
  FaClock,
  FaMap,
} from "react-icons/fa";
import { Button } from "@mantine/core";

const EventSidebar = ({
  title,
  category,
  date,
  location,
  meet,
  price,
  duration,
  onClick,
  registrationStatus,
}) => {
  const hasCoords = location?.[1] && location?.[2];
  const hasMeetLink = meet?.[0];

  const eventDate = new Date(date);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const formattedDate = eventDate.toLocaleString("en-US", options);

  return (
    <aside className="w-full bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-2xl p-8 space-y-8">
      <div className="space-y-2">
        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg uppercase tracking-widest">
          {category}
        </span>
        <h2 className="text-3xl font-black text-slate-900 leading-tight">{title}</h2>
      </div>

      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <FaRegCalendarAlt size={18} />
          </div>
          <div>
            <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Date & Time</div>
            <div className="text-sm font-bold text-slate-700">{formattedDate}</div>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <FaClock size={18} />
          </div>
          <div>
            <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Duration</div>
            <div className="text-sm font-bold text-slate-700">{duration} Hours</div>
          </div>
        </div>

        {hasCoords ? (
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <FaMapMarkerAlt size={18} />
            </div>
            <div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Location</div>
              <div className="text-sm font-bold text-slate-700">{location?.[0]}</div>
            </div>
          </div>
        ) : hasMeetLink ? (
          <div className="flex items-start gap-4">
             <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <FaLink size={18} />
            </div>
            <div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Online Event</div>
              <div className="text-sm font-bold text-slate-700">Link provided after joining</div>
            </div>
          </div>
        ) : null}
      </div>

      {hasCoords && (
        <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-inner">
          <iframe
            src={`https://maps.google.com/maps?q=${location[1]},${location[2]}&z=13&ie=UTF8&iwloc=&output=embed`}
            className="w-full h-44 grayscale hover:grayscale-0 transition-all duration-500"
            title="Map"
          ></iframe>
        </div>
      )}

      <div className="pt-6 border-t border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Ticket Price</div>
            <div className="text-2xl font-black text-slate-900">
              {price > 0 ? `₹${price}` : "FREE"}
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
            <FaTicketAlt size={20} />
          </div>
        </div>

        {registrationStatus === "not-registered" && (
          <Button
            fullWidth
            size="xl"
            radius="xl"
            onClick={onClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-black shadow-xl shadow-blue-500/20 py-4"
          >
            RSVP NOW
          </Button>
        )}

        {registrationStatus === "joined" && (
          <div className="w-full py-4 rounded-full bg-green-50 text-green-600 font-black text-center border border-green-100">
            YOU ARE REGISTERED
          </div>
        )}

        {registrationStatus === "requested" && (
          <div className="w-full py-4 rounded-full bg-yellow-50 text-yellow-600 font-black text-center border border-yellow-100">
            PENDING APPROVAL
          </div>
        )}
      </div>
    </aside>
  );
};

export default EventSidebar;
