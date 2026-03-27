// src/pages/teacher/TeacherDashboard.jsx
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { StatCard, CardSkeleton, EmptyState, Badge } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import { getTeacherClasses, getTeacherEarnings } from "../../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function TeacherDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [classRes, earnRes] = await Promise.allSettled([
          getTeacherClasses(),
          getTeacherEarnings(),
        ]);
        if (classRes.status === "fulfilled") setClasses(classRes.value.data || []);
        if (earnRes.status === "fulfilled") setEarnings(earnRes.value.data);
      } catch (e) {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const upcoming = classes
    .filter((c) => c.status === "scheduled")
    .sort((a, b) => (a.startTime || 0) - (b.startTime || 0))
    .slice(0, 5);
  const completed = classes.filter((c) => c.status === "completed");
  const totalStudents = [...new Set(classes.map((c) => c.studentId))].filter(Boolean).length;
  const attendanceRate =
    classes.length > 0
      ? Math.round((completed.length / classes.length) * 100)
      : 0;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <Layout
      title={`${greeting}, ${profile?.name?.split(" ")[0] || "Teacher"} 👋`}
      subtitle="Here's your teaching activity at a glance"
      actions={
        <button onClick={() => navigate("/teacher/courses")} className="btn-primary">
          + Create Course
        </button>
      }
    >
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array(4).fill(0).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            <StatCard label="Total Students" value={totalStudents} icon="👨‍🎓" color="violet" />
            <StatCard label="Attendance Rate" value={`${attendanceRate}%`} icon="📊" color="emerald" />
            <StatCard label="Completed Classes" value={completed.length} icon="✅" color="brand" />
            <StatCard
              label="Total Earnings"
              value={earnings?.totalEarnings != null ? `$${earnings.totalEarnings}` : "—"}
              icon="💰"
              color="amber"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming classes — wider */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-white text-lg">Upcoming Classes</h2>
            <button
              onClick={() => navigate("/teacher/classes")}
              className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
            >
              View all →
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">{Array(4).fill(0).map((_, i) => <CardSkeleton key={i} />)}</div>
          ) : upcoming.length === 0 ? (
            <EmptyState
              icon="📅"
              title="No upcoming classes"
              description="Set your availability so students can book sessions"
              action={
                <button onClick={() => navigate("/teacher/availability")} className="btn-primary text-sm">
                  Set Availability
                </button>
              }
            />
          ) : (
            <div className="space-y-3">
              {upcoming.map((cls) => (
                <TeacherClassRow key={cls.id} cls={cls} onNavigate={() => navigate("/teacher/classes")} />
              ))}
            </div>
          )}
        </div>

        {/* Quick stats sidebar */}
        <div className="space-y-4">
          {/* Earnings summary */}
          <div className="glass-card p-5">
            <h3 className="font-display font-semibold text-white mb-4">Earnings Summary</h3>
            {loading ? (
              <CardSkeleton />
            ) : (
              <div className="space-y-3">
                <EarningRow label="Total Earned" value={earnings?.totalEarnings != null ? `$${earnings.totalEarnings}` : "—"} color="text-amber-400" />
                <EarningRow label="This Month" value={earnings?.monthlyEarnings != null ? `$${earnings.monthlyEarnings}` : "—"} color="text-emerald-400" />
                <EarningRow label="Classes Done" value={completed.length} color="text-brand-400" />
                <EarningRow label="Per Class" value={earnings?.ratePerClass != null ? `$${earnings.ratePerClass}` : "$10"} color="text-violet-400" />
              </div>
            )}
            <button
              onClick={() => navigate("/teacher/earnings")}
              className="mt-4 w-full text-xs text-center text-brand-400 hover:text-brand-300 transition-colors"
            >
              View full earnings →
            </button>
          </div>

          {/* Quick links */}
          <div className="glass-card p-5">
            <h3 className="font-display font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: "Manage Availability", path: "/teacher/availability", icon: "◻" },
                { label: "View Students", path: "/teacher/students", icon: "◉" },
                { label: "My Courses", path: "/teacher/courses", icon: "◈" },
              ].map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-hover transition-colors text-left group"
                >
                  <span className="text-slate-400 group-hover:text-brand-400 transition-colors">
                    {item.icon}
                  </span>
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                    {item.label}
                  </span>
                  <span className="ml-auto text-slate-600 group-hover:text-slate-400 text-xs">→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function TeacherClassRow({ cls, onNavigate }) {
  const start = cls.startTime ? new Date(cls.startTime) : null;
  const dateStr = start
    ? start.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
    : "TBD";
  const timeStr = start
    ? start.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <div
      onClick={onNavigate}
      className="flex items-center gap-4 p-4 rounded-xl bg-surface-hover border border-surface-border hover:border-brand-500/30 transition-all duration-200 cursor-pointer group"
    >
      <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex flex-col items-center justify-center shrink-0">
        <span className="text-xs text-brand-400 font-bold leading-none">
          {start ? start.toLocaleDateString("en-US", { month: "short" }) : "?"}
        </span>
        <span className="text-sm font-bold text-white">
          {start ? start.getDate() : "—"}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-white truncate group-hover:text-brand-300 transition-colors">
          {cls.title || "Class Session"}
        </div>
        <div className="text-xs text-slate-400">
          {dateStr} · {timeStr}
          {cls.studentId && <> · Student: {cls.studentId.slice(0, 8)}...</>}
        </div>
      </div>
      <Badge variant="info">{cls.status}</Badge>
    </div>
  );
}

function EarningRow({ label, value, color }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-slate-400">{label}</span>
      <span className={`text-sm font-bold ${color}`}>{value}</span>
    </div>
  );
}
