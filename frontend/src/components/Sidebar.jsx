// src/components/Sidebar.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  home as HomeIcon, note as NotebookPen, search as SearchIcon, book as BookOpenIcon, gauge as GaugeIcon, calendar as CalendarIcon, clipboard as ClipboardIcon, users as UsersIcon, clock as ClockIcon, speakerphone as SpeakerIcon, airplay as AirplayIcon, album as AlbumIcon, headphones as HeadphonesIcon, settings as SettingsIcon, graduationcap as GraduationCapIcon
} from "lucide-react";
const STUDENT_NAV = [
  { path: "/student/dashboard", icon: HomeIcon, label: "Dashboard" },
  { path: "/student/courses", icon: BookOpenIcon, label: "Browse Courses" },
  { path: "/student/my-courses", icon: NotebookPen, label: "My Courses" },
  { path: "/student/classes", icon: CalendarIcon, label: "My Classes" },
];

const TEACHER_NAV = [
  { path: "/teacher/dashboard", icon: HomeIcon, label: "Dashboard" },
  { path: "/teacher/courses", icon: BookOpenIcon, label: "My Courses" },
  { path: "/teacher/classes", icon: CalendarIcon, label: "Classes" },
  { path: "/teacher/availability", icon: ClockIcon, label: "Availability" },
  { path: "/teacher/students", icon: UsersIcon, label: "Students" },
  { path: "/teacher/earnings", icon: GaugeIcon, label: "Earnings" },
];

const ADMIN_NAV = [
  { path: "/admin/dashboard", icon: HomeIcon, label: "Dashboard" },
  { path: "/admin/teacher-requests", icon: ClipboardIcon, label: "Teacher Requests" },
];

export default function Sidebar() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isTeacher = profile?.role === "teacher";
  const isAdmin = profile?.role === "admin";
  const nav = isTeacher ? TEACHER_NAV : isAdmin ? ADMIN_NAV : STUDENT_NAV;

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (e) {
      toast.error("Logout failed");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <aside
      className={`min-h-screen bg-surface-card border-r border-surface-border flex flex-col transition-all duration-300 ${collapsed ? "w-20" : "w-72"
        }`}
    >
      {/* Header */}
      <div className="p-5 border-b border-surface-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          {!collapsed && (
            <div className="font-display font-bold text-2xl text-white tracking-tight">
              SkillNest
            </div>
          )}
          {collapsed && (
            <div className="w-9 h-9 rounded-2xl bg-orange-500 flex items-center justify-center text-white font-bold text-xl">
              S
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-surface-hover transition-all"
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* Profile */}
      <div className="p-4 border-b border-surface-border">
        <div className={`flex items-center gap-3 p-3 rounded-2xl bg-surface-hover ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {profile?.name?.charAt(0)?.toUpperCase() || "👤"}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">
                {profile?.name || "User"}
              </div>
              <div className={`text-xs capitalize ${isTeacher ? "text-orange-400" : "text-violet-400"}`}>
                {profile?.role || "Student"}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {nav.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`nav-item w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group
                ${isActive
                  ? "bg-orange-500/10 text-orange-400 border border-orange-500/30"
                  : "hover:bg-surface-hover text-slate-300 hover:text-white"
                }`}
            >
              <span className="text-2xl transition-transform group-hover:scale-110">{item.icon}</span>
              {!collapsed && <span className="font-medium">{item.label}</span>}
              {isActive && !collapsed && (
                <div className="ml-auto w-2 h-2 rounded-full bg-orange-400" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-surface-border">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
        >
          <span className="text-2xl">⭍</span>
          {!collapsed && <span className="font-medium">{loggingOut ? "Logging out..." : "Log Out"}</span>}
        </button>
      </div>
    </aside>
  );
}