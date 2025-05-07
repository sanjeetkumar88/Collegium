import { FaClock, FaMapMarkerAlt, FaInfoCircle } from "react-icons/fa";

const EventAbout = ({ description, startDateTime, venue }) => {
  const formattedDescription = description.replace(/\r?\n/g, "<br/>");

  // Convert and format the start date
  const eventDate = new Date(startDateTime);
  const options = {
    weekday: "long", // Day of the week
    year: "numeric", // Full year
    month: "long", // Full month name
    day: "numeric", // Day of the month
    hour: "numeric", // Hour in 12-hour format
    minute: "numeric", // Minute
    second: "numeric", // Second
    timeZoneName: "short", // Time zone abbreviation
  };
  const formattedDate = eventDate.toLocaleString("en-US", options);

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
        <FaInfoCircle className="text-pink-600" /> About the Event
      </h2>

      <p
        className="text-gray-700 leading-relaxed text-base"
        dangerouslySetInnerHTML={{ __html: formattedDescription }}
      ></p>

      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FaClock className="text-pink-600" /> Event Time
        </h3>
        <p className="text-gray-600">{formattedDate}</p>
      </div>
      {venue && (
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FaMapMarkerAlt className="text-pink-600" /> Venue
          </h3>
          <p className="text-gray-600">{venue}</p>
        </div>
      )}
    </div>
  );
};

export default EventAbout;
