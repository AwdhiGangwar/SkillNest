import React from "react";
import clsx from "clsx";

const variants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
  ghost: "text-blue-600 hover:bg-blue-100",
  danger: "bg-red-500 text-white hover:bg-red-600",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-4 py-2 text-sm rounded-xl",
  lg: "px-6 py-3 text-base rounded-2xl",
};

function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}) {
  return (
    <button
      className={clsx(
        "font-medium transition-all duration-200 flex items-center gap-2",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
