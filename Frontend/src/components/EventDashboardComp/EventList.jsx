import React from "react";
import EventCard from "./EventCard";
import Loader from "./Loader";

const EventList = ({ events, error, loading, loaderRef, onEventClick }) => {
  if (loading && events.length === 0) {
    return <Loader text="Loading events..." />;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (events.length === 0) {
    return <div className="text-center text-gray-500">No events found.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event._id} event={event} onClick={onEventClick} />
      ))}
      <div ref={loaderRef} className="invisible"></div>
    </div>
  );
};

export default EventList;
