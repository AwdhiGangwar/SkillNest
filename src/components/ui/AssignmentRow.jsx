import React from "react";
import { Eye, BookOpen } from "lucide-react";

function AssignmentRow({
  title,
  classTitle,
  score,
  grade,
}) {
  return (
    <div className="w-full max-w-[1140px] px-4 py-4 flex items-center justify-between rounded-[8px] text-[12px] text-[#4F4F4F]">

      {/* Assignment Title */}
      <div style={{ width: "200px" }}>
        {title}
      </div>

      {/* Class Title */}
      <div style={{ width: "200px" }}>
        {classTitle}
      </div>

      {/* Score */}
      <div style={{ width: "80px" }}>
        {score}
      </div>

      {/* Grade Badge */}
      <div style={{ width: "80px" }}>
        <span className="px-2 py-1 rounded-[4px] bg-green-100 text-[#27AE60] font-medium text-[12px]">
          {grade}
        </span>
      </div>

      {/* Actions */}
      <div
        style={{ width: "80px" }}
        className="flex items-center gap-3 text-[#1F80E0]"
      >
        <Eye size={18} className="cursor-pointer" />
        <BookOpen size={18} className="cursor-pointer" />
      </div>

    </div>
  );
}

export default AssignmentRow;
