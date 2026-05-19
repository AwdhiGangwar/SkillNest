// src/components/Sidebar.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const STUDENT_NAV = [
  { path: "/student/dashboard", icon: "⊡", label: "Dashboard" },
  { path: "/student/courses", icon: "◈", label: "Browse Courses" },
  { path: "/student/my-courses", icon: "◉", label: "My Courses" },
  { path: "/student/classes", icon: "◷", label: "My Classes" },
];

const TEACHER_NAV = [
  { path: "/teacher/dashboard", icon: "⊡", label: "Dashboard" },
  { path: "/teacher/courses", icon: "◈", label: "My Courses" },
  { path: "/teacher/classes", icon: "◷", label: "Classes" },
  { path: "/teacher/availability", icon: "◻", label: "Availability" },
  { path: "/teacher/students", icon: "◉", label: "Students" },
  { path: "/teacher/earnings", icon: "◈", label: "Earnings" },
];
const ADMIN_NAV = [
  { path: "/admin/dashboard", icon: "⊡", label: "Dashboard" },
  { path: "/admin/teacher-requests", icon: "◈", label: "Teacher Requests" },
];


export default function Sidebar() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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
    <aside className="w-64 min-h-screen bg-surface-card border-r border-surface-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold text-sm">
            SN
          </div>
          <div>
            <div className="font-display font-bold text-white text-lg leading-tight">
              SkillNest
            </div>
            <div className="text-xs text-slate-500">
              {isTeacher ? "Teacher Portal" : "Student Portal"}
            </div>
          </div>
        </div>
      </div>

      {/* Profile pill */}
      <div className="px-4 py-4 border-b border-surface-border">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-hover">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold">
            {profile?.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">
              {profile?.name || "Loading..."}
            </div>
            <div
              className={`text-xs capitalize ${
                isTeacher ? "text-orange-400" : "text-violet-400"
              }`}
            >
              {profile?.role || "—"}
            </div>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {nav.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`nav-item w-full text-left ${isActive ? "active" : ""}`}
            >
              <span className="text-base opacity-75">{item.icon}</span>
              <span>{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-400" />
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
          className="nav-item w-full text-left text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <span className="text-base">⊗</span>
          <span>{loggingOut ? "Logging out..." : "Log Out"}</span>
        </button>
      </div>
    </aside>
  );
}
