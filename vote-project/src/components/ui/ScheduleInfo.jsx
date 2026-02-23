import { Calendar, MoreVertical } from "lucide-react";

const ScheduleInfo = ({
  time,
  onMenuClick,
  className = "",
}) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      
      {/* Left: Time */}
      <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
        <Calendar size={14} className="text-gray-400" />
        <span>{time}</span>
      </div>

      {/* Right: Menu */}
      <button
        onClick={onMenuClick}
        className="p-1 rounded hover:bg-gray-100 transition"
      >
        <MoreVertical size={16} className="text-blue-400" />
      </button>

    </div>
  );
};

export default ScheduleInfo;