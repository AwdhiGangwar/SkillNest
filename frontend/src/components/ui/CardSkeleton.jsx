// src/components/ui/CardSkeleton.jsx
/**
 * CardSkeleton Component
 * Loading skeleton for card layouts
 * Used while data is loading
 */
function CardSkeleton() {
  return (
    <div className="glass-card p-6 space-y-4 animate-pulse">
      <div className="h-6 bg-surface-border rounded-lg w-3/4" />
      <div className="space-y-3">
        <div className="h-4 bg-surface-border rounded-lg" />
        <div className="h-4 bg-surface-border rounded-lg w-5/6" />
        <div className="h-4 bg-surface-border rounded-lg w-4/6" />
      </div>
      <div className="flex gap-2 pt-2">
        <div className="h-10 bg-surface-border rounded-lg flex-1" />
        <div className="h-10 bg-surface-border rounded-lg flex-1" />
      </div>
    </div>
  );
}

export default CardSkeleton;
