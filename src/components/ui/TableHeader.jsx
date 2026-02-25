import React from "react";

function TableHeader({ columns }) {
  return (
    <div className="w-full max-w-[1140px] bg-[#F5F9FF] border border-[#E9F3FC] rounded-[8px] px-4 py-4 flex items-center justify-between text-[14px] font-medium text-[#080808]">

      {columns.map((col, index) => (
        <div
          key={index}
          style={{ width: col.width }}
        >
          {col.label}
        </div>
      ))}

    </div>
  );
}

export default TableHeader;
