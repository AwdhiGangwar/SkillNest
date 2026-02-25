import React from "react";
import { Search } from "lucide-react";

const SearchBar = ({
  size = "large",
  value,
  onChange,
  placeholder = "Search",
  className = "",
}) => {
  const isLarge = size === "large";

  return (
    <div
      className={`
        flex items-center justify-between
        bg-white border border-[#F2F2F2]
        shadow-[0_0_10px_rgba(0,0,0,0.05)]
        rounded-xl
        px-4
        ${isLarge ? "h-12 py-3" : "h-11 py-2"}
        ${className}
      `}
    >
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          flex-1 bg-transparent outline-none
          ${isLarge ? "text-base" : "text-sm"}
          ${value ? "text-[#333333]" : "text-[#808080]"}
        `}
      />

      <Search
        size={isLarge ? 20 : 16}
        className="text-[#1F80E0]"
      />
    </div>
  );
};

export default SearchBar;
