import { FaCheckCircle } from "react-icons/fa";

const terms = [
  "Please carry a valid ID proof along with you.",
  "No refunds on purchased tickets are possible, even in case of rescheduling.",
  "Security procedures, including frisking, remain the right of the management.",
  "No dangerous or hazardous objects, including weapons, fireworks, and laser devices, will be allowed.",
  "The sponsors/performers/organizers are not responsible for injury or damage during the event.",
  "People in an inebriated state may not be allowed entry.",
  "Organizers hold the right to deny late entry.",
  "Venue rules apply.",
];

const EventTerms = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
        Terms and Conditions
      </h2>
      <ul className="space-y-3 text-gray-700 leading-relaxed">
        {terms.map((term, index) => (
          <li key={index} className="flex items-start gap-2">
            <FaCheckCircle className="text-pink-600 mt-[2px]" />
            <span>{term}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventTerms;
