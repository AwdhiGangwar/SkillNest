// src/components/ui/EmptyState.jsx
import PropTypes from "prop-types";

/**
 * EmptyState Component
 * Displays when there's no data to show
 *
 * Usage:
 * <EmptyState
 *   title="No courses yet"
 *   description="Start learning by enrolling in a course"
 *   icon="📚"
 * />
 */
function EmptyState({ title, description, icon = "📭", action = null }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-display font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm text-center max-w-sm mb-6">{description}</p>
      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  );
}

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.string,
  action: PropTypes.node,
};

export default EmptyState;
