// src/components/Layout.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../context/AuthContext";

function Layout({ title, subtitle, actions, children }) {
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
    <div className="min-h-screen bg-surface flex flex-col transition-colors duration-300">
      {/* SIDEBAR - Desktop */}
      <div className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-60 bg-surface-card border-r border-surface-border p-6 overflow-y-auto transition-colors duration-300 z-40">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 mb-8 cursor-pointer hover:opacity-80 transition-all transform hover:scale-[1.02]"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center font-bold text-white shadow-lg shadow-brand-500/20">
            SN
          </div>
          <div>
            <div className="font-display font-bold text-white">SkillNest</div>
            <div className="text-xs text-slate-400">Learning Hub</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {currentNavItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3 ${
                isActive(item.path)
                  ? "bg-brand-500/15 text-brand-300"
                  : "text-slate-400 hover:text-white hover:bg-surface-hover"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="border-t border-surface-border pt-4 mt-4">
          <div className="glass-card p-4 mb-4 rounded-xl">
            <div className="text-xs text-slate-400 mb-2">Logged in as</div>
            <div className="font-semibold text-sm truncate text-white">
              {profile?.name}
            </div>
            <div className="text-xs text-slate-500 truncate">{profile?.email}</div>
            {profile?.role && (
              <div className="mt-3 inline-block bg-brand-500/15 text-brand-300 text-xs font-semibold px-3 py-1 rounded-lg">
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
        <div className="lg:hidden glass-card border-0 rounded-none px-4 py-3 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-surface-hover rounded-lg transition-colors text-slate-300"
          >
            <span className="text-xl">☰</span>
          </button>
          <div className="font-display font-bold text-white">SkillNest</div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-surface-hover rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            ⏻
          </button>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="lg:hidden glass-card border-0 rounded-none p-4 space-y-2 border-b border-surface-border sticky top-[56px] z-40 bg-surface-card/95 backdrop-blur-md">
            {currentNavItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive(item.path)
                    ? "bg-brand-500/15 text-brand-300"
                    : "text-slate-400 hover:text-white hover:bg-surface-hover"
                }`}
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
              <h1 className="text-3xl lg:text-4xl font-display font-bold text-white mb-2">
                {title}
              </h1>
              {subtitle && (
                <p className="text-slate-400 text-sm lg:text-base">{subtitle}</p>
              )}
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
          </div>
        </div>

        {/* PAGE CONTENT */}
        <div className="flex-1 px-4 lg:px-8 py-6 lg:py-8 overflow-y-auto w-full">
          <div className="max-w-screen-2xl mx-auto w-full">{children}</div>
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
