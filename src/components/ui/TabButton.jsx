import React from "react";
import clsx from "clsx";

function TabButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "px-4 py-2 rounded-lg text-base transition-all",
        active
          ? "bg-white text-black font-medium shadow-sm"
          : "text-white font-normal"
      )}
    >
      {label}
    </button>
  );
}

export default TabButton;
