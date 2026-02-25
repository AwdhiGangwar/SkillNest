import { Calendar } from "lucide-react";

const TimeSlot = ({
  variant = "available", // available | filled | na | edit
  title,
  time,
  onClick,
}) => {

  const baseClasses =
    "w-[160px] h-[160px] p-3 rounded-lg flex flex-col justify-between cursor-pointer transition";

  const variants = {
    available:
      "border border-gray-200 bg-white",
    filled:
      "bg-gradient-to-br from-[#144C82] to-[#144778] border border-blue-100 text-white",
    na:
      "bg-gray-100 border border-gray-200 text-gray-400",
    edit:
      "border border-gray-200 bg-white",
  };

  const textColor =
    variant === "filled" ? "text-gray-200" : "text-gray-500";

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]}`}
    >
      {/* Top Text */}
      <div className="text-xs font-medium">
        {title}
      </div>

      {/* Time */}
      <div className={`flex items-center gap-1 text-xs font-medium ${textColor}`}>
        <Calendar size={14} />
        <span>{time}</span>
      </div>
    </div>
  );
};

export default TimeSlot;