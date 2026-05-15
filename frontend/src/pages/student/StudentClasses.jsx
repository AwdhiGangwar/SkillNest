// src/pages/student/StudentClasses.jsx
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { CardSkeleton, EmptyState } from "../../components/ui";
import { getStudentClasses } from "../../services/api";
import toast from "react-hot-toast";

const STATUS_COLORS = {
  scheduled: { bg: "bg-blue-500/20", text: "text-blue-300", label: "Scheduled" },
  completed: { bg: "bg-emerald-500/20", text: "text-emerald-300", label: "Completed" },
  cancelled: { bg: "bg-red-500/20", text: "text-red-300", label: "Cancelled" },
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

  const tabCounts = {
    all: classes.length,
    scheduled: classes.filter((c) => c.status === "scheduled").length,
    completed: classes.filter((c) => c.status === "completed").length,
    cancelled: classes.filter((c) => c.status === "cancelled").length,
  };

  return (
    <Layout
      title="My Classes"
      subtitle={`${filtered.length} class${filtered.length !== 1 ? "es" : ""} found`}
    >
      {/* Filter Tabs */}
      <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all duration-200 whitespace-nowrap ${
              filter === tab
                ? "bg-brand-500 text-white shadow-lg shadow-brand-500/50"
                : "bg-surface-hover border border-surface-border text-slate-400 hover:text-white hover:bg-surface-border hover:border-brand-500/30"
            }`}
          >
            {tab}
            <span className="ml-2 text-xs opacity-70">({tabCounts[tab]})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="📅"
          title="No classes found"
          description={
            filter === "all"
              ? "You have no classes yet. Enroll in a course to get started."
              : `No ${filter} classes at the moment.`
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((cls) => (
            <ClassCard key={cls.id} cls={cls} />
          ))}
        </div>
      )}
    </Layout>
  );
}

function ClassCard({ cls }) {
  const start = cls.startTime ? new Date(cls.startTime) : null;
  const end = cls.endTime ? new Date(cls.endTime) : null;
  const now = new Date();
  const isUpcoming = cls.status === "scheduled" && start && start > now;
  const isLive = cls.status === "scheduled" && start && start <= now && (!end || end > now);

  const statusInfo = STATUS_COLORS[cls.status] || STATUS_COLORS.scheduled;

  const dateStr = start
    ? start.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : "Date TBD";

  const timeStr = start
    ? `${start.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })}${
        end
          ? ` – ${end.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}`
          : ""
      }`
    : "Time TBD";

  const dayOfWeek = start
    ? start.toLocaleDateString("en-US", { weekday: "long" })
    : "N/A";

  return (
    <div className="glass-card overflow-hidden group hover:border-brand-500/30 animate-fade-in transition-all duration-300 flex flex-col h-full">
      {/* Header with Status */}
      <div className="p-5 border-b border-surface-border/50 bg-surface-hover/30">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-display font-bold text-white text-lg line-clamp-1 group-hover:text-brand-300 transition-colors flex-1">
            {cls.title || "Class Session"}
          </h3>
          <span className={`px-3 py-1 rounded-lg text-xs font-bold ${statusInfo.bg} ${statusInfo.text} whitespace-nowrap`}>
            {isLive ? "🔴 Live" : statusInfo.label}
          </span>
        </div>
        {cls.instructor && (
          <p className="text-slate-400 text-sm">👨‍🏫 {cls.instructor}</p>
        )}
      </div>

      {/* Date/Time Block */}
      <div className="p-5 space-y-4 flex-1">
        {/* Date Card */}
        <div className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/20">
          <div className="text-sm text-brand-400 font-semibold mb-1">Date</div>
          <div className="text-base font-bold text-white">{dateStr}</div>
          <div className="text-xs text-slate-400 mt-1">{dayOfWeek}</div>
        </div>

        {/* Time Card */}
        <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
          <div className="text-sm text-cyan-400 font-semibold mb-1">Time</div>
          <div className="text-base font-bold text-white">{timeStr}</div>
        </div>

        {/* Course Info */}
        {cls.courseTitle && (
          <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
            <div className="text-sm text-violet-400 font-semibold mb-1">Course</div>
            <div className="text-base font-bold text-white line-clamp-1">
              {cls.courseTitle}
            </div>
          </div>
        )}

        {/* Meeting Link */}
        {cls.meetingLink && (
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div className="text-xs text-amber-400 font-semibold mb-2">Meeting Link</div>
            <a
              href={cls.meetingLink}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-amber-300 hover:text-amber-200 truncate block underline"
            >
              {cls.meetingLink}
            </a>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="p-5 border-t border-surface-border/50 bg-surface-hover/20">
        {isUpcoming && cls.meetingLink ? (
          <a
            href={cls.meetingLink}
            target="_blank"
            rel="noreferrer"
            className="btn-primary w-full py-3 text-center flex items-center justify-center gap-2 font-semibold"
          >
            📞 Join Class
          </a>
        ) : isLive && cls.meetingLink ? (
          <a
            href={cls.meetingLink}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/30 rounded-xl font-semibold text-center transition-all duration-200 animate-pulse flex items-center justify-center gap-2"
          >
            🔴 Join Live Class
          </a>
        ) : cls.status === "completed" ? (
          <div className="w-full py-3 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl font-semibold text-center flex items-center justify-center gap-2">
            ✓ Completed
          </div>
        ) : cls.status === "cancelled" ? (
          <div className="w-full py-3 bg-red-500/20 text-red-300 border border-red-500/30 rounded-xl font-semibold text-center">
            ✕ Cancelled
          </div>
        ) : (
          <div className="w-full py-3 bg-slate-500/20 text-slate-300 border border-slate-500/30 rounded-xl font-semibold text-center">
            Coming Soon
          </div>
        )}
      </div>
    </div>
  );
}
