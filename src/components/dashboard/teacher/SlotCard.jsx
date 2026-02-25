import React from "react";
import { Clock, User } from "lucide-react";

const SlotCard = ({
  studentName,
  studentImage,
  subject,
  time,
  status = "scheduled", // scheduled | completed | cancelled
}) => {
  const statusColors = {
    scheduled: "bg-blue-50 border-blue-200 text-blue-700",
    completed: "bg-green-50 border-green-200 text-green-700",
    cancelled: "bg-red-50 border-red-200 text-red-700",
  };

  return (
    <div
      className={`border rounded-lg p-4 ${statusColors[status]} backdrop-blur-sm hover:shadow-md transition`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {studentImage && (
            <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
              <img
                src={studentImage}
                alt={studentName}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div>
            <p className="font-medium text-sm">{studentName}</p>
            <p className="text-xs opacity-75">{subject}</p>
          </div>
        </div>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${
            status === "scheduled"
              ? "bg-blue-200 text-blue-800"
              : status === "completed"
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-1 text-xs opacity-75">
        <Clock size={14} />
        <span>{time}</span>
      </div>
    </div>
  );
};

export default SlotCard;
