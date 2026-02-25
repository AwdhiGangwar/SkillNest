import React from "react";
import clsx from "clsx";

function Input({
  label,
  placeholder,
  helperText,
  state = "default", // default | error | success | disabled
  leftIcon,
  rightIcon,
  ...props
}) {
  const isError = state === "error";
  const isSuccess = state === "success";
  const isDisabled = state === "disabled";

  return (
    <div className="flex flex-col gap-1 w-full">

      {/* Label */}
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Input wrapper */}
      <div
        className={clsx(
          "flex items-center gap-2 px-4 py-2 rounded-xl border bg-white transition-all",
          "shadow-sm",
          {
            "border-gray-300 focus-within:ring-2 focus-within:ring-blue-500":
              state === "default",
            "border-red-500 focus-within:ring-2 focus-within:ring-red-400":
              isError,
            "border-green-500 focus-within:ring-2 focus-within:ring-green-400":
              isSuccess,
            "bg-gray-100 cursor-not-allowed border-gray-200":
              isDisabled,
          }
        )}
      >
        {leftIcon && (
          <span className="text-gray-400">
            {leftIcon}
          </span>
        )}

        <input
          placeholder={placeholder}
          disabled={isDisabled}
          className="flex-1 bg-transparent outline-none text-sm"
          {...props}
        />

        {rightIcon && (
          <span
            className={clsx({
              "text-red-500": isError,
              "text-green-500": isSuccess,
              "text-gray-400": state === "default",
            })}
          >
            {rightIcon}
          </span>
        )}
      </div>

      {/* Helper Text */}
      {helperText && (
        <span
          className={clsx("text-xs", {
            "text-gray-500": state === "default",
            "text-red-500": isError,
            "text-green-600": isSuccess,
          })}
        >
          {helperText}
        </span>
      )}
    </div>
  );
}

export default Input;
