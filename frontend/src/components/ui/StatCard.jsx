// src/components/ui/StatCard.jsx
import PropTypes from "prop-types";

/**
 * StatCard Component
 * Displays a statistic with icon, label, and value
 *
 * Usage:
 * <StatCard label="Enrolled Courses" value={5} icon="📚" />
 */
function StatCard({ label, value, icon, loading = false }) {
  if (loading) {
    return (
      <div className="stat-card animate-pulse">
        <div className="h-8 bg-surface-border rounded-lg" />
        <div className="h-4 bg-surface-border rounded-lg w-3/4" />
      </div>
    );
  }

  return (
    <div className="stat-card">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-2xl lg:text-3xl font-bold text-white">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.string,
  loading: PropTypes.bool,
};

export default StatCard;
