import React from "react";
import { MoreVertical } from "lucide-react";

function UpcomingClassRow({
  studentName,
  studentImage,
  subject,
  classTitle,
  date,
  time,
  status,
}) {
  return (
    <div className="w-full max-w-[1140px] px-4 py-4 flex items-center justify-between rounded-[8px] text-[12px] text-[#4F4F4F]">

      {/* Student Column */}
      <div
        style={{ width: "240px" }}
        className="flex items-center gap-3"
      >
        <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-100 overflow-hidden">
          {studentImage && (
            <img
              src={studentImage}
              alt={studentName}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <span className="font-medium">
          {studentName}
        </span>
      </div>

      {/* Subject Tag */}
      <div style={{ width: "120px" }}>
        <span className="px-2 py-1 rounded-[4px] bg-[#F0E5FB] text-[#9B51E0] font-medium">
          {subject}
        </span>
      </div>

      {/* Class Title */}
      <div style={{ width: "140px" }}>
        {classTitle}
      </div>

      {/* Date */}
      <div style={{ width: "100px" }}>
        {date}
      </div>

      {/* Time */}
      <div style={{ width: "140px" }}>
        {time}
      </div>

      {/* Status Badge */}
      <div style={{ width: "120px" }}>
        <span className="px-2 py-1 rounded-[4px] bg-green-100 text-[#27AE60] font-medium">
          {status}
        </span>
      </div>

      {/* Actions */}
      <div
        style={{ width: "70px" }}
        className="flex justify-center text-[#63A2F7]"
      >
        <MoreVertical size={18} className="cursor-pointer" />
      </div>

    </div>
  );
}

export default UpcomingClassRow;
