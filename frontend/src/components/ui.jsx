// src/components/ui.jsx
// Reusable UI primitives

import React from "react";

// ─── LOADING SKELETON ─────────────────────────────────────────
export const Skeleton = ({ className = "" }) => (
  <div className={`shimmer rounded-xl ${className}`} />
);

export const CardSkeleton = () => (
  <div className="glass-card p-5 space-y-3 animate-pulse">
    <Skeleton className="h-4 w-1/3" />
    <Skeleton className="h-3 w-2/3" />
    <Skeleton className="h-3 w-1/2" />
  </div>
);

// ─── EMPTY STATE ──────────────────────────────────────────────
export const EmptyState = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
    <p className="text-slate-400 text-sm mb-6 max-w-xs">{description}</p>
    {action}
  </div>
);

// ─── BADGE ────────────────────────────────────────────────────
export const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default: "bg-slate-700/50 text-slate-300",
    success: "bg-emerald-500/15 text-emerald-400",
    warning: "bg-amber-500/15 text-amber-400",
    danger: "bg-red-500/15 text-red-400",
    info: "bg-brand-500/15 text-brand-400",
    student: "bg-violet-500/15 text-violet-400",
    teacher: "bg-orange-500/15 text-orange-400",
    admin: "bg-red-500/15 text-red-400",
  };
  return (
    <span className={`badge-role ${variants[variant] || variants.default}`}>
      {children}
    </span>
  );
};

// ─── MODAL ────────────────────────────────────────────────────
export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative glass-card p-6 w-full max-w-lg animate-slide-up">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors text-lg w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-hover"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ─── STAT CARD ────────────────────────────────────────────────
export const StatCard = ({ label, value, icon, color = "brand", change }) => {
  const colors = {
    brand: "text-brand-400",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    violet: "text-violet-400",
    orange: "text-orange-400",
  };
  return (
    <div className="stat-card animate-slide-up">
      <div className={`text-2xl ${colors[color] || colors.brand}`}>{icon}</div>
      <div className="text-2xl font-bold text-white font-display">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
      {change && (
        <div className="text-xs text-emerald-400 font-medium">{change}</div>
      )}
    </div>
  );
};

// ─── SPINNER ─────────────────────────────────────────────────
export const Spinner = ({ size = "md" }) => {
  const sizes = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-10 h-10" };
  return (
    <div
      className={`${sizes[size]} border-2 border-surface-border border-t-brand-500 rounded-full animate-spin`}
    />
  );
};

// ─── TABLE ───────────────────────────────────────────────────
export const Table = ({ columns, data, emptyText = "No data found" }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10 text-slate-400 text-sm">{emptyText}</div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-surface-border">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left text-slate-400 font-medium pb-3 pr-4 text-xs uppercase tracking-wide"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className="border-b border-surface-border/50 hover:bg-surface-hover/50 transition-colors"
            >
              {columns.map((col) => (
                <td key={col.key} className="py-3 pr-4 text-slate-300">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
