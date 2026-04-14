import {
  FaRegCalendarAlt,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaBookmark,
  FaLink,
  FaClock,
} from "react-icons/fa";

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
  const hasCoords = location?.[1] && location?.[2]; // latitude & longitude
  const hasMeetLink = meet?.[0]; // meet link

  const eventDate = new Date(date);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
  };
  const formattedDate = eventDate.toLocaleString("en-US", options);

  return (
    <aside className="w-full lg:w-1/3 bg-white rounded-xl shadow-lg p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>

      <div className="flex items-center text-sm text-gray-600">
        <FaBookmark className="mr-2 text-pink-500" />
        {category}
      </div>

      <div className="flex items-center text-sm text-gray-600">
        <FaRegCalendarAlt className="mr-2 text-pink-500" />
        {formattedDate}
      </div>

      <div className="flex items-center text-sm text-gray-600">
        <FaClock className="mr-2 text-pink-500" />
        Duration: {duration} hrs
      </div>

      {hasCoords && (
        <div className="flex items-center text-sm text-gray-600">
          <FaMapMarkerAlt className="mr-2 text-pink-500" />
          {location?.[0]}
        </div>
      )}

      {hasCoords ? (
        <iframe
          src={`https://maps.google.com/maps?q=${location[1]},${location[2]}&z=13&ie=UTF8&iwloc=&output=embed`}
          className="w-full h-40 rounded-lg"
          title="Map"
        ></iframe>
      ) : hasMeetLink ? (
        <div className="flex items-center text-gray-600 text-sm">
          <FaLink className="mr-2 text-pink-500" />
          Meeting details will be emailed upon joining.
        </div>
      ) : null}

      <div className="flex items-center justify-between pt-2">
        <span className="flex items-center text-sm font-medium text-gray-800">
          <FaTicketAlt className="mr-1 text-pink-600" />
          {price > 0 ? `₹${price}` : "Free"}
        </span>

        {registrationStatus === "not-registered" && (
          <button
            className="bg-pink-600 hover:bg-pink-700 transition text-white px-4 py-2 rounded-lg font-semibold"
            onClick={onClick}
          >
            RSVP
          </button>
        )}

        {registrationStatus === "joined" && (
          <span className="text-green-600 font-semibold text-sm">You’ve joined</span>
        )}

        {registrationStatus === "requested" && (
          <span className="text-yellow-600 font-semibold text-sm">Request Pending</span>
        )}
      </div>
    </aside>
  );
};

export default EventSidebar;
// This component is used in the EventDetails page to display event details in a sidebar format.
// It includes event title, category, date, location, meeting link, price, duration, and a button to RSVP.  
