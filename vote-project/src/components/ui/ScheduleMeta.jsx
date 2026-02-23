import { Calendar, MoreVertical } from "lucide-react";

const ScheduleMeta = ({
  time = "18:00 - 19:00",
  onMenuClick,
}) => {
  return (
    <div className="flex items-center justify-between w-full">

      {/* Left Section */}
      <div className="flex items-center gap-2 text-gray-500 text-xs font-medium">
        <Calendar size={16} />
        <span>{time}</span>
      </div>

      {/* Right Menu */}
      <button
        onClick={onMenuClick}
        className="p-1 rounded-md hover:bg-gray-100 transition"
      >
        <MoreVertical size={16} className="text-blue-400" />
      </button>

    </div>
  );
};

export default ScheduleMeta;