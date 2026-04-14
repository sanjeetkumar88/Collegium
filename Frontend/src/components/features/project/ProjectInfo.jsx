import { Card } from "@mantine/core";
import { FaUserTie, FaUserGraduate, FaUsers, FaEye } from "react-icons/fa"; // Using react-icons!

export default function ProjectInfo({ leader, mentor, members, visibility }) {
  return (
    <Card 
      shadow="md" 
      radius="lg" 
      withBorder 
      className="mt-16 p-6 bg-white/80 backdrop-blur-md hover:shadow-xl transition-all duration-300"
    >
      <div className="flex flex-col gap-4 text-gray-700 text-sm">
        <InfoRow icon={<FaUserTie size={18} />} label="Leader" value={leader} />
        <InfoRow icon={<FaUserGraduate size={18} />} label="Mentor" value={mentor} />
        <InfoRow icon={<FaUsers size={18} />} label="Total Members" value={members} />
        <InfoRow icon={<FaEye size={18} />} label="Visibility" value={visibility} />
      </div>
    </Card>
  );
}

// Helper subcomponent for reusability and clean code
function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-yellow-500">{icon}</div>
      <div>
        <span className="font-semibold">{label}:</span> {value}
      </div>
    </div>
  );
}
