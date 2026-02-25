import { useState } from "react";

const ToggleSwitch = ({
  size = "md", // md | sm
  checked,
  onChange,
}) => {
  const isSmall = size === "sm";

  const width = isSmall ? "w-6" : "w-8";
  const height = isSmall ? "h-3" : "h-4";
  const thumbSize = isSmall ? "w-2.5 h-2.5" : "w-3 h-3";

  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative ${width} ${height} rounded-full transition duration-300 
        ${checked 
          ? "bg-gradient-to-r from-blue-400 to-blue-600" 
          : "bg-white border border-blue-200"
        }
      `}
    >
      <span
        className={`absolute top-1/2 -translate-y-1/2 ${thumbSize} rounded-full transition duration-300
          ${checked 
            ? "right-0.5 bg-white" 
            : "left-0.5 bg-gradient-to-r from-blue-400 to-blue-600"
          }
        `}
      />
    </button>
  );
};

export default ToggleSwitch;