// src/pages/teacher/TeacherDashboard.jsx
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { CardSkeleton, EmptyState } from "../../components/ui";
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
    .slice(0, 3);
  const completed = classes.filter((c) => c.status === "completed");
  const totalStudents = [...new Set(classes.map((c) => c.studentId))].filter(Boolean).length;
  const attendanceRate = classes.length > 0 ? Math.round((completed.length / classes.length) * 100) : 0;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <Layout
      title={`${greeting}, ${profile?.name?.split(" ")[0] || "Teacher"} 👋`}
      subtitle="Here's your teaching performance at a glance"
      actions={
        <button onClick={() => navigate("/teacher/courses")} className="btn-primary">
          + Create Course
        </button>
      }
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array(4).fill(0).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            <StatCard 
              label="Active Students" 
              value={totalStudents} 
              icon="👨‍🎓" 
              gradient="from-violet-500/20 to-purple-500/10"
            />
            <StatCard 
              label="Classes Done" 
              value={completed.length} 
              icon="✅" 
              gradient="from-emerald-500/20 to-teal-500/10"
            />
            <StatCard 
              label="Attendance Rate" 
              value={`${attendanceRate}%`} 
              icon="📊" 
              gradient="from-blue-500/20 to-cyan-500/10"
            />
            <StatCard 
              label="Total Earnings" 
              value={earnings?.totalEarnings != null ? `₹${earnings.totalEarnings}` : "—"} 
              icon="💰" 
              gradient="from-amber-500/20 to-orange-500/10"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Classes Section - Wider */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-white text-xl">📅 Upcoming Classes</h2>
              <button
                onClick={() => navigate("/teacher/classes")}
                className="text-sm text-brand-400 hover:text-brand-300 font-semibold transition-colors"
              >
                View all →
              </button>
            </div>

            {loading ? (
              <div className="space-y-4">
                {Array(3).fill(0).map((_, i) => <CardSkeleton key={i} />)}
              </div>
            ) : upcoming.length === 0 ? (
              <EmptyState
                icon="📅"
                title="No upcoming classes"
                description="Set your availability so students can book sessions"
              >
                <button 
                  onClick={() => navigate("/teacher/availability")} 
                  className="btn-primary text-sm mt-4"
                >
                  Set Availability →
                </button>
              </EmptyState>
            ) : (
              <div className="space-y-3">
                {upcoming.map((cls) => (
                  <TeacherClassCard key={cls.id} cls={cls} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Earnings & Quick Actions */}
        <div className="space-y-6">
          {/* Earnings Summary */}
          <div className="glass-card p-6">
            <h3 className="font-display font-bold text-white mb-5 text-lg">💰 Earnings Summary</h3>
            {loading ? (
              <CardSkeleton />
            ) : (
              <div className="space-y-4">
                <EarningRow 
                  label="Total Earned" 
                  value={earnings?.totalEarnings != null ? `₹${earnings.totalEarnings}` : "—"} 
                  color="text-amber-400"
                />
                <div className="my-3 h-px bg-surface-border/50" />
                <EarningRow 
                  label="This Month" 
                  value={earnings?.monthlyEarnings != null ? `₹${earnings.monthlyEarnings}` : "—"} 
                  color="text-emerald-400"
                />
                <EarningRow 
                  label="Rate/Class" 
                  value={earnings?.ratePerClass != null ? `₹${earnings.ratePerClass}` : "—"} 
                  color="text-brand-400"
                />
                <EarningRow 
                  label="Completed" 
                  value={completed.length} 
                  color="text-violet-400"
                />
                <button
                  onClick={() => navigate("/teacher/earnings")}
                  className="w-full mt-5 text-sm text-brand-400 hover:text-brand-300 font-semibold transition-colors"
                >
                  View detailed earnings →
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="glass-card p-6">
            <h3 className="font-display font-bold text-white mb-5 text-lg">⚡ Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: "Set Availability", path: "/teacher/availability", icon: "◻" },
                { label: "View Students", path: "/teacher/students", icon: "👥" },
                { label: "My Courses", path: "/teacher/courses", icon: "📚" },
              ].map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-surface-hover border border-transparent hover:border-brand-500/30 transition-all duration-200 group text-left"
                >
                  <span className="text-xl text-slate-400 group-hover:text-brand-400 transition-colors">
                    {item.icon}
                  </span>
                  <span className="flex-1 text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                    {item.label}
                  </span>
                  <span className="text-slate-600 group-hover:text-slate-400 text-xs transition-colors">→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Stat Card Component
function StatCard({ label, value, icon, gradient }) {
  return (
    <div className={`glass-card p-5 bg-gradient-to-br ${gradient} border border-surface-border hover:border-brand-500/30 transition-all duration-300 animate-fade-in`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-3xl">{icon}</span>
      </div>
      <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className="text-2xl font-display font-bold text-white">
        {value}
      </div>
    </div>
  );
}

// Teacher Class Card
function TeacherClassCard({ cls }) {
  const start = cls.startTime ? new Date(cls.startTime) : null;
  const end = cls.endTime ? new Date(cls.endTime) : null;
  const now = new Date();
  const isUpcoming = start && start > now;

  const dateStr = start
    ? start.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : "TBD";

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
    : "TBD";

  return (
    <div className="p-4 rounded-xl bg-surface-hover/50 border border-surface-border hover:border-brand-500/30 transition-all duration-200 group">
      <div className="flex items-start gap-4">
        {/* Date Block */}
        <div className="w-12 h-12 rounded-lg bg-brand-500/20 flex flex-col items-center justify-center shrink-0">
          <span className="text-xs text-brand-400 font-bold leading-none">
            {start ? start.toLocaleDateString("en-US", { month: "short" }) : "?"}
          </span>
          <span className="text-base font-bold text-white">
            {start ? start.getDate() : "—"}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white group-hover:text-brand-300 transition-colors mb-1">
            {cls.title || "Class Session"}
          </h4>
          <div className="text-xs text-slate-400 space-y-1">
            <div>📅 {dateStr} · 🕐 {timeStr}</div>
            {cls.studentId && <div>👤 Student: {cls.studentId.slice(0, 8)}...</div>}
          </div>
        </div>

        {/* Status Badge */}
        <div className="shrink-0">
          <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
            cls.status === "scheduled" 
              ? "bg-blue-500/20 text-blue-300" 
              : "bg-emerald-500/20 text-emerald-300"
          }`}>
            {cls.status === "scheduled" ? "Upcoming" : "Completed"}
          </span>
        </div>
      </div>
    </div>
  );
}

// Earning Row Component
function EarningRow({ label, value, color }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-slate-400 font-medium">{label}</span>
      <span className={`text-sm font-bold ${color}`}>{value}</span>
    </div>
  );
}
