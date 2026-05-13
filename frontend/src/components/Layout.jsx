// src/components/Layout.jsx
<<<<<<< HEAD
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function Layout({ title, subtitle, actions, children }) {
  const { theme, isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname.startsWith(path);

  const navItems = {
    student: [
      { label: "Dashboard", path: "/student/dashboard", icon: "📊" },
      { label: "Browse Courses", path: "/student/courses", icon: "🔍" },
      { label: "My Courses", path: "/student/my-courses", icon: "📚" },
      { label: "My Progress", path: "/student/progress", icon: "📈" },
      { label: "Classes", path: "/student/classes", icon: "📅" },
      { label: "Assignments", path: "/student/assignments", icon: "📝" },
    ],
    teacher: [
      { label: "Dashboard", path: "/teacher/dashboard", icon: "🎯" },
      { label: "Courses", path: "/teacher/courses", icon: "📚" },
      { label: "Classes", path: "/teacher/classes", icon: "📅" },
      { label: "Students", path: "/teacher/students", icon: "👥" },
      { label: "Availability", path: "/teacher/availability", icon: "⏰" },
      { label: "Earnings", path: "/teacher/earnings", icon: "💰" },
    ],
    admin: [
      { label: "Dashboard", path: "/admin/dashboard", icon: "📊" },
      { label: "Users", path: "/admin/users", icon: "👥" },
      { label: "Teacher Requests", path: "/admin/teacher-requests", icon: "📝" },
      { label: "Courses", path: "/admin/courses", icon: "📚" },
      { label: "Enrollments", path: "/admin/enrollments", icon: "🎓" },
      { label: "Analytics", path: "/admin/analytics", icon: "📈" },
      { label: "Payments", path: "/admin/payments", icon: "💰" },
      { label: "Support", path: "/admin/support", icon: "🎧" },
      { label: "Settings", path: "/admin/settings", icon: "⚙️" },
    ],
  };

  const roleKey = profile?.role?.toLowerCase();
  const currentNavItems = navItems[roleKey] || [];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-surface text-surface-text flex flex-col transition-colors duration-300">
      <style>{`
        *, *::before, *::after {
          transition-property: background-color, border-color, color, fill, stroke;
          transition-duration: 300ms;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      {/* SIDEBAR - Desktop */}
      <div className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-60 bg-surface-card border-r border-surface-border p-6 overflow-y-auto transition-colors duration-300">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 mb-8 cursor-pointer hover:opacity-80 transition-all transform hover:scale-[1.02]"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center font-bold text-white">
            SN
          </div>
          <div>
            <div className="font-display font-bold text-surface-text">SkillNest</div>
            <div className="text-xs text-slate-400">Learning Hub</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {currentNavItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full text-left nav-item ${isActive(item.path) ? "active" : ""}`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="border-t border-surface-border pt-4">
          {/* ✅ Theme Toggle - Desktop */}
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-sm mb-2 border ${
              theme === "system" /* Add transform for hover scale */
                ? "bg-brand-500/15 text-brand-400 border-brand-500/30 shadow-[0_0_12px_rgba(14,165,233,0.1)]"
                : "bg-surface-hover hover:bg-brand-500/10 text-slate-400 hover:text-white border-transparent"
            }`}
          >
            {theme === "system" ? (
              <>🖥️ System</>
            ) : theme === "dark" ? (
              <>🌙 Dark</>
            ) : (
              <>☀️ Light</>
            )}
          </button>

          <div className="glass-card p-3 mb-3">
            <div className="text-xs text-slate-400 mb-1">Logged in as</div>
            <div className="font-semibold text-sm truncate text-surface-text">{profile?.name}</div>
            <div className="text-xs text-slate-500 truncate">{profile?.email}</div>
            {profile?.role && (
              <div className="mt-2 badge-role bg-brand-500/10 text-brand-500 dark:text-blue-300">
                {profile.role.toUpperCase()}
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="btn-ghost w-full justify-center text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 lg:ml-60 flex flex-col">
        {/* MOBILE HEADER */}
        <div className="lg:hidden glass-card border-0 rounded-0 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
          >
            <span className="text-xl">☰</span>
          </button>
          <div className="font-bold">SkillNest</div>
          <div className="flex items-center gap-2">
            {/* ✅ Theme Toggle - Mobile */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all text-xl border transform hover:scale-[1.02] ${
                theme === "system"
                  ? "bg-brand-500/15 border-brand-500/30"
                  : "hover:bg-surface-hover border-transparent"
              }`}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "system" ? "🖥️" : theme === "dark" ? "🌙" : "☀️"}
            </button>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-surface-hover rounded-lg transition-colors text-slate-400 hover:text-surface-text"
            >
              ⏻
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="lg:hidden glass-card border-0 rounded-0 p-4 space-y-2 border-b border-surface-border sticky top-[64px] z-40 bg-surface/95 backdrop-blur-md">
            {currentNavItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 text-left nav-item ${isActive(item.path) ? "active" : ""}`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* PAGE HEADER */}
        <div className="px-4 lg:px-8 py-6 lg:py-8 border-b border-surface-border">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-display font-bold text-surface-text mb-2">
                {title}
              </h1>
              {subtitle && <p className="text-slate-400 text-sm lg:text-base">{subtitle}</p>}
            </div>
            {actions && (
              <div className="flex items-center gap-3">
                {actions}
              </div>
            )}
          </div>
        </div>

        {/* PAGE CONTENT */}
        <div className="flex-1 px-4 lg:px-8 py-6 lg:py-8 overflow-y-auto w-full">
          <div className="max-w-screen-2xl mx-auto w-full">
            {children}
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t border-surface-border px-4 lg:px-8 py-4 text-center text-xs text-slate-500 hidden lg:block">
          <p>© 2024 SkillNest. All rights reserved.</p>
        </div>
      </div>
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
=======
import React from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children, title, subtitle, actions }) {
  return (
    <div className="flex min-h-screen bg-surface text-white">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-8">
          {(title || actions) && (
            <div className="flex items-start justify-between mb-8">
              <div>
                {title && (
                  <h1 className="text-2xl font-display font-bold text-white">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
                )}
              </div>
              {actions && <div className="flex items-center gap-3">{actions}</div>}
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
>>>>>>> ca9e6a8546d45fdcb2d8dbf6b42011e2c1e874cb
