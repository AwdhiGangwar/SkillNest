// src/pages/teacher/TeacherClasses.jsx
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { CardSkeleton, EmptyState, Badge, Modal } from "../../components/ui";
import { getTeacherClasses, rescheduleClass, cancelClass } from "../../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const STATUS_BADGE = {
  scheduled: "info",
  completed: "success",
  cancelled: "danger",
};

export default function TeacherClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [rescheduleModal, setRescheduleModal] = useState(null);
  const [newTime, setNewTime] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const fetchClasses = async () => {
    try {
      const res = await getTeacherClasses();
      setClasses(res.data || []);
    } catch {
      toast.error("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClasses(); }, []);

  const tabs = ["all", "scheduled", "completed", "cancelled"];
  const filtered = filter === "all" ? classes : classes.filter((c) => c.status === filter);

  const handleReschedule = async (e) => {
    e.preventDefault();
    if (!newTime) return toast.error("Please select a new time");
    setSaving(true);
    try {
      await rescheduleClass(rescheduleModal.id, {
        newStartTime: new Date(newTime).getTime(),
      });
      toast.success("Class rescheduled successfully!");
      setRescheduleModal(null);
      setNewTime("");
      await fetchClasses();
    } catch (err) {
      toast.error(err.message || "Reschedule failed");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async (cls) => {
    if (!window.confirm("Are you sure you want to cancel this class?")) return;
    try {
      await cancelClass(cls.id);
      toast.success("Class cancelled");
      await fetchClasses();
    } catch (err) {
      toast.error(err.message || "Cancel failed");
    }
  };

  return (
    <Layout
      title="Classes"
      subtitle="Manage all your teaching sessions"
    >
      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all duration-200 ${
              filter === tab
                ? "bg-brand-500 text-white"
                : "bg-surface-card border border-surface-border text-slate-400 hover:text-white hover:bg-surface-hover"
            }`}
          >
            {tab}
            <span className="ml-2 text-xs opacity-60">
              ({tab === "all" ? classes.length : classes.filter((c) => c.status === tab).length})
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">{Array(5).fill(0).map((_, i) => <CardSkeleton key={i} />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="📅"
          title="No classes found"
          description={filter === "all" ? "No classes yet. Set availability so students can book." : `No ${filter} classes`}
          action={
            filter === "all" && (
              <button onClick={() => navigate("/teacher/availability")} className="btn-primary text-sm">
                Set Availability
              </button>
            )
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((cls) => (
            <ClassDetailRow
              key={cls.id}
              cls={cls}
              onReschedule={() => setRescheduleModal(cls)}
              onCancel={() => handleCancel(cls)}
            />
          ))}
        </div>
      )}

      {/* Reschedule Modal */}
      <Modal
        isOpen={!!rescheduleModal}
        onClose={() => { setRescheduleModal(null); setNewTime(""); }}
        title="Reschedule Class"
      >
        {rescheduleModal && (
          <form onSubmit={handleReschedule} className="space-y-5">
            <div className="p-4 rounded-xl bg-surface-hover">
              <div className="text-sm font-semibold text-white mb-1">
                {rescheduleModal.title || "Class Session"}
              </div>
              <div className="text-xs text-slate-400">
                Current: {rescheduleModal.startTime
                  ? new Date(rescheduleModal.startTime).toLocaleString()
                  : "Not scheduled"}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                New Date & Time
              </label>
              <input
                type="datetime-local"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="input-field"
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setRescheduleModal(null); setNewTime(""); }}
                className="btn-ghost flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : "Reschedule"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </Layout>
  );
}

function ClassDetailRow({ cls, onReschedule, onCancel }) {
  const start = cls.startTime ? new Date(cls.startTime) : null;
  const end = cls.endTime ? new Date(cls.endTime) : null;
  const isScheduled = cls.status === "scheduled";
  const isFuture = start && start > new Date();

  return (
    <div className="glass-card p-5 animate-fade-in hover:border-brand-500/20 transition-all duration-200">
      <div className="flex items-start gap-5">
        {/* Date block */}
        <div className="w-14 h-14 rounded-xl bg-brand-500/10 flex flex-col items-center justify-center shrink-0">
          <span className="text-xs text-brand-400 font-medium uppercase leading-none">
            {start ? start.toLocaleDateString("en-US", { month: "short" }) : "—"}
          </span>
          <span className="text-xl font-display font-bold text-white">
            {start ? start.getDate() : "—"}
          </span>
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-display font-semibold text-white">
              {cls.title || "Class Session"}
            </span>
            <Badge variant={STATUS_BADGE[cls.status] || "default"}>
              {cls.status}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-slate-400 mb-3">
            {start && (
              <span>
                📅{" "}
                {start.toLocaleDateString("en-US", {
                  weekday: "short", month: "long", day: "numeric",
                })}
              </span>
            )}
            {start && (
              <span>
                🕐 {start.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                {end && ` – ${end.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`}
              </span>
            )}
            {cls.studentId && <span>👨‍🎓 Student: {cls.studentId.slice(0, 12)}...</span>}
            {cls.courseId && <span>📚 Course: {cls.courseId.slice(0, 12)}...</span>}
          </div>

          {/* Actions */}
          {isScheduled && (
            <div className="flex gap-2 flex-wrap">
              {cls.meetingLink && (
                <a
                  href={cls.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs bg-brand-500 text-white hover:bg-brand-600 px-3 py-1.5 rounded-lg transition-colors font-medium"
                >
                  Join Class
                </a>
              )}
              {isFuture && (
                <button
                  onClick={onReschedule}
                  className="text-xs bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 px-3 py-1.5 rounded-lg transition-colors font-medium"
                >
                  Reschedule
                </button>
              )}
              {isFuture && (
                <button
                  onClick={onCancel}
                  className="text-xs bg-red-500/15 text-red-400 hover:bg-red-500/25 px-3 py-1.5 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
