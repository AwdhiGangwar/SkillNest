// src/pages/student/StudentClasses.jsx
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { CardSkeleton, EmptyState, Badge } from "../../components/ui";
import { getStudentClasses } from "../../services/api";
import toast from "react-hot-toast";

const STATUS_BADGE = {
  scheduled: "info",
  completed: "success",
  cancelled: "danger",
};

export default function StudentClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getStudentClasses()
      .then((r) => setClasses(r.data || []))
      .catch(() => toast.error("Failed to load classes"))
      .finally(() => setLoading(false));
  }, []);

  const tabs = ["all", "scheduled", "completed", "cancelled"];
  const filtered =
    filter === "all" ? classes : classes.filter((c) => c.status === filter);

  return (
    <Layout
      title="My Classes"
      subtitle="All your scheduled and past class sessions"
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
            {tab !== "all" && (
              <span className="ml-2 text-xs opacity-60">
                ({classes.filter((c) => c.status === tab).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array(5).fill(0).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="📅"
          title="No classes found"
          description={
            filter === "all"
              ? "You have no classes yet. Enroll in a course to get started."
              : `No ${filter} classes.`
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((cls) => (
            <ClassRow key={cls.id} cls={cls} />
          ))}
        </div>
      )}
    </Layout>
  );
}

function ClassRow({ cls }) {
  const start = cls.startTime ? new Date(cls.startTime) : null;
  const end = cls.endTime ? new Date(cls.endTime) : null;

  const dateStr = start
    ? start.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
    : "Date TBD";
  const timeStr = start
    ? `${start.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}${end ? ` – ${end.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}` : ""}`
    : "";

  const isUpcoming = cls.status === "scheduled" && start && start > new Date();

  return (
    <div className="glass-card p-5 flex items-center gap-5 hover:border-brand-500/20 transition-all duration-200 animate-fade-in">
      {/* Date block */}
      <div className="w-14 h-14 rounded-xl bg-brand-500/10 flex flex-col items-center justify-center shrink-0">
        <span className="text-xs text-brand-400 font-medium uppercase">
          {start ? start.toLocaleDateString("en-US", { month: "short" }) : "—"}
        </span>
        <span className="text-xl font-display font-bold text-white">
          {start ? start.getDate() : "—"}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="font-semibold text-white">
            {cls.title || "Class Session"}
          </span>
          <Badge variant={STATUS_BADGE[cls.status] || "default"}>
            {cls.status}
          </Badge>
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-3 flex-wrap">
          <span>📅 {dateStr}</span>
          {timeStr && <span>🕐 {timeStr}</span>}
          {cls.courseId && <span>📚 Course: {cls.courseId?.slice(0, 8)}...</span>}
        </div>
      </div>

      {/* Actions */}
      <div className="shrink-0 flex gap-2">
        {isUpcoming && cls.meetingLink && (
          <a
            href={cls.meetingLink}
            target="_blank"
            rel="noreferrer"
            className="btn-primary text-sm py-2"
          >
            Join Class
          </a>
        )}
        {cls.status === "completed" && (
          <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-xl font-medium">
            Completed ✓
          </span>
        )}
      </div>
    </div>
  );
}
