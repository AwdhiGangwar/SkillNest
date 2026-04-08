// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute Component
 * Wraps routes that require authentication and specific roles
 * 
 * Usage:
 * <ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>
 * <ProtectedRoute role="teacher"><TeacherDashboard /></ProtectedRoute>
 * <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
 */
function ProtectedRoute({ children, role = null }) {
  const { user, profile, loading } = useAuth();

  // Show loading state while checking Firebase auth OR fetching the profile
  if (loading || (user && !profile)) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-12 h-12 rounded-full border-4 border-surface-border border-t-brand-500 animate-spin mb-4" />
          </div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if no user is logged into Firebase
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Normalize roles to avoid case-sensitivity issues (e.g., ADMIN vs admin)
  const userRole = profile.role?.toLowerCase();
  const requiredRole = role?.toLowerCase();

  // Check role-based access if role specified
  if (requiredRole && userRole !== requiredRole) {
    // Redirect to appropriate dashboard based on role
    if (userRole === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (userRole === "teacher") return <Navigate to="/teacher/dashboard" replace />;
    if (userRole === "student") return <Navigate to="/student/dashboard" replace />;
    return <Navigate to="/login" state={{ from: globalThis.location.pathname }} replace />;
  }

  // User is authenticated and has required role (or no role specified)
  return children;
}

export default ProtectedRoute;
