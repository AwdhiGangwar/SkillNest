import React from "react";
import { FileText, Eye } from "lucide-react";

const AssignmentFileCard = ({
  title = "Assignment_User Interview",
  size = "6.2 MB",
  onView,
}) => {
  return (
    <div className="flex items-center justify-between bg-white border border-[#F2F2F2] shadow-sm rounded-2xl px-5 py-4 w-[304px]">
      
      {/* Left Section */}
      <div className="flex items-center gap-3 flex-1">
        
        {/* File Icon */}
        <div className="w-10 h-10 bg-[#673AB7] rounded-lg flex items-center justify-center text-white">
          <FileText size={18} />
        </div>

        {/* Text Content */}
        <div className="flex flex-col">
          <p className="text-[16px] font-medium text-[#080808]">
            {title}
          </p>
          <p className="text-[14px] text-[#595959]">
            {size}
          </p>
        </div>
      </div>

      {/* View Icon */}
      <button
        onClick={onView}
        className="text-[#1F80E0] hover:scale-110 transition"
      >
        <Eye size={20} />
      </button>

    </div>
  );
};

export default AssignmentFileCard;
