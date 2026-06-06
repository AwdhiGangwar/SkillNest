import React from "react";

const ProgressBar = ({ progress = 0 }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center w-full max-w-md">
      <div className="w-full bg-light-border dark:bg-surface-border rounded-full h-3">
        <div
          className="bg-brand-500 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
