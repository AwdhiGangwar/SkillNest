// src/components/Layout.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import { Player } from "@lottiefiles/react-lottie-player";
import { Home, Search, BookOpen, Gauge, Calendar, Clipboard, Users, Clock, SpeakerIcon, Airplay, Album, Headphones, Settings, GraduationCap } from "lucide-react";

function Layout({ title, subtitle, actions, children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname.startsWith(path);

  const navItems = {
    student: [
      { label: "Dashboard", path: "/student/dashboard", icon: <Home size={18} /> },
      { label: "Browse Courses", path: "/student/courses", icon: <Search size={18} /> },
      { label: "My Courses", path: "/student/my-courses", icon: <BookOpen size={18} /> },
      { label: "My Progress", path: "/student/progress", icon: <Gauge size={18} /> },
      { label: "Classes", path: "/student/classes", icon: <GraduationCap size={18} /> },
      { label: "Assignments", path: "/student/assignments", icon: <Clipboard size={18} /> },
    ],
    teacher: [
      { label: "Dashboard", path: "/teacher/dashboard", icon: <Home size={18} /> },
      { label: "Courses", path: "/teacher/courses", icon: <BookOpen size={18} /> },
      { label: "Classes", path: "/teacher/classes", icon: <GraduationCap size={18} /> },
      { label: "Students", path: "/teacher/students", icon: <Users size={18} /> },
      { label: "Availability", path: "/teacher/availability", icon: <Clock size={18} /> },
      { label: "Earnings", path: "/teacher/earnings", icon: <Gauge size={18} /> },
    ],
    admin: [
      { label: "Dashboard", path: "/admin/dashboard", icon: <Home size={18} /> },
      { label: "Users", path: "/admin/users", icon: <Users size={18} /> },
      { label: "Teacher Requests", path: "/admin/teacher-requests", icon: <Clipboard size={18} /> },
      { label: "Courses", path: "/admin/courses", icon: <BookOpen size={18} /> },
      { label: "Enrollments", path: "/admin/enrollments", icon: <Airplay size={18} /> },
      { label: "Analytics", path: "/admin/analytics", icon: <Album size={18} /> },
      { label: "Payments", path: "/admin/payments", icon: <SpeakerIcon size={18} /> },
      { label: "Support", path: "/admin/support", icon: <Headphones size={18} /> },
      { label: "Settings", path: "/admin/settings", icon: <Settings size={18} /> },
    ],
  };

  const roleKey = profile?.role?.toLowerCase();
  const currentNavItems = navItems[roleKey] || [];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-light-bg text-light-text dark:bg-surface dark:text-white flex flex-col transition-colors duration-300">
      {/* SIDEBAR - Desktop */}
      <div className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-60 bg-white dark:bg-surface-card border-r border-light-border dark:border-surface-border text-light-text dark:text-white p-6 overflow-y-auto transition-colors duration-300 z-40">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 mb-8 cursor-pointer hover:opacity-80 transition-all"
        >
          <div className="font-display font-bold text-2xl tracking-tight">SkillNest</div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {currentNavItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-medium transition-all flex items-center gap-3 ${isActive(item.path)
                ? "bg-brand-500/10 text-brand-600 border border-brand-500/30 dark:bg-orange-500/10 dark:text-orange-300"
                : "text-light-text-secondary hover:text-light-text hover:bg-light-hover dark:text-slate-400 dark:hover:text-white dark:hover:bg-surface-hover"
                }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Profile & Logout */}
        <div className="border-t border-light-border dark:border-surface-border pt-6 mt-auto">
          <div className="bg-light-card dark:bg-surface-hover p-4 rounded-2xl mb-4">
            <div className="font-medium text-light-text dark:text-white">{profile?.name}</div>
            <div className="text-xs text-light-text-secondary dark:text-slate-400 truncate">{profile?.email}</div>
            {profile?.role && (
              <div className="mt-2 inline-block text-xs px-3 py-1 bg-brand-500/10 text-brand-600 rounded-full dark:text-orange-300">
                {profile.role.toUpperCase()}
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-3 text-red-600 hover:bg-red-500/10 rounded-2xl transition-all text-sm font-medium dark:text-red-400"
          >
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 lg:ml-60 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white dark:bg-surface-card border-b border-light-border dark:border-surface-border px-4 py-4 flex items-center justify-between sticky top-0 z-50">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-2xl">
            ☰
          </button>
          <div className="font-display font-bold text-xl text-light-text dark:text-white">SkillNest</div>
          <button onClick={handleLogout} className="text-red-600 dark:text-red-400">⏻</button>
        </div>

        {/* In Layout.jsx - Page Header */}
        <div className="px-6 lg:px-10 py-8 border-b border-light-border dark:border-surface-border bg-light-bg dark:bg-surface">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl lg:text-4xl font-bold text-light-text dark:text-white tracking-tight">
                {title}
              </h1>
              {/* Hello Animation */}
              <div className="hidden lg:block w-12 h-12 -mt-1">
                <Player
                  autoplay
                  loop
                  src="/assets/animations/hello-animation.json"
                  style={{ width: "350%", height: "350%" }}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              {actions && actions}
            </div>
          </div>

          {subtitle && <p className="text-light-text-secondary dark:text-slate-400 mt-3 text-lg">{subtitle}</p>}
        </div>
        {/* PAGE CONTENT */}
        <div className="flex-1 p-6 lg:p-10 overflow-y-auto bg-light-bg dark:bg-surface">
          <div className="max-w-screen-2xl mx-auto w-full">
            {children}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/80 z-50 pt-16">
          <div className="bg-white dark:bg-surface-card h-full overflow-y-auto p-6 space-y-2 border-l border-light-border dark:border-surface-border">
            {currentNavItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left ${isActive(item.path)
                  ? "bg-brand-500/10 text-brand-600 dark:bg-orange-500/10 dark:text-orange-300"
                  : "text-light-text-secondary hover:text-light-text hover:bg-light-hover dark:text-slate-400 dark:hover:text-white dark:hover:bg-surface-hover"
                  }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

Layout.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  actions: PropTypes.node,
  children: PropTypes.node.isRequired,
};

export default Layout;