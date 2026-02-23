import { useState } from "react";

const LargeTextInput = ({
  label,
  value,
  onChange,
  placeholder = "Write here...",
  disabled = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="flex flex-col gap-2 w-[400px]">
      
      {/* Label */}
      {label && (
        <label className="text-sm font-medium text-black">
          {label}
        </label>
      )}

      {/* Textarea Wrapper */}
      <div
        className={`relative bg-white rounded-lg shadow-sm transition
        ${isFocused ? "border border-gray-400" : "border border-gray-200"}
        ${disabled ? "opacity-60 cursor-not-allowed" : ""}
        `}
      >
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={4}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full p-4 resize-none outline-none text-sm text-black placeholder-gray-400 bg-transparent"
        />

        {/* Optional Resize Icon */}
        <div className="absolute bottom-2 right-2 text-gray-400 text-xs select-none">
          ↘
        </div>
      </div>

    </div>
  );
};

export default LargeTextInput;