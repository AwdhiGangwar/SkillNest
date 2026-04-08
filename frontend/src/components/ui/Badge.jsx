// src/components/ui/Badge.jsx
import PropTypes from "prop-types";

/**
 * Badge Component
 * Small label/tag component for status, roles, etc.
 *
 * Usage:
 * <Badge variant="success">Active</Badge>
 * <Badge variant="warning">Pending</Badge>
 */
function Badge({ children, variant = "default", className = "" }) {
  const variantStyles = {
    default: "bg-slate-500/20 text-slate-300",
    success: "bg-green-500/20 text-green-300",
    warning: "bg-yellow-500/20 text-yellow-300",
    danger: "bg-red-500/20 text-red-300",
    info: "bg-blue-500/20 text-blue-300",
    purple: "bg-purple-500/20 text-purple-300",
    brand: "bg-brand-500/20 text-brand-300",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    "default",
    "success",
    "warning",
    "danger",
    "info",
    "purple",
    "brand",
  ]),
  className: PropTypes.string,
};

export default Badge;
