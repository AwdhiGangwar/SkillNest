import React from "react";

const variants = {
  primary: "bg-gradient-to-r from-[#3A8DFF] to-[#1F80E0] text-white hover:shadow-lg",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  outline: "border border-blue-400 text-blue-500 hover:bg-blue-50",
  ghost: "text-blue-500 hover:bg-blue-50",
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
  className = "",
  ...props
}) {
  const variantClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || sizes.md;
  
  const combinedClass = `font-medium transition-all duration-200 flex items-center gap-2 ${variantClass} ${sizeClass} ${className}`;

  return (
    <button
      className={combinedClass}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
