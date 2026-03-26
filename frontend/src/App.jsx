// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import JoinTeacher from "./pages/JoinTeacher";

// Student pages
import StudentDashboard from "./pages/student/StudentDashboard";
import BrowseCourses from "./pages/student/BrowseCourses";
import MyCourses from "./pages/student/MyCourses";
import StudentClasses from "./pages/student/StudentClasses";

// Teacher pages
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherCourses from "./pages/teacher/TeacherCourses";
import TeacherClasses from "./pages/teacher/TeacherClasses";
import Availability from "./pages/teacher/Availability";
import TeacherStudents from "./pages/teacher/TeacherStudents";
import Earnings from "./pages/teacher/Earnings";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";
import TeacherRequests from "./pages/TeacherRequests";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: "#161b27",
              color: "#e2e8f0",
              border: "1px solid #1e2738",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              borderRadius: "12px",
            },
            success: {
              iconTheme: { primary: "#10b981", secondary: "#161b27" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#161b27" },
            },
          }}
        />

        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/join-teacher" element={<JoinTeacher />} />

          {/* Landing Page */}
          <Route path="/" element={<Home />} />

          {/* Student routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/courses"
            element={
              <ProtectedRoute role="student">
                <BrowseCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/my-courses"
            element={
              <ProtectedRoute role="student">
                <MyCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/classes"
            element={
              <ProtectedRoute role="student">
                <StudentClasses />
              </ProtectedRoute>
            }
          />

          {/* Teacher routes */}
          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute role="teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/courses"
            element={
              <ProtectedRoute role="teacher">
                <TeacherCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/classes"
            element={
              <ProtectedRoute role="teacher">
                <TeacherClasses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/availability"
            element={
              <ProtectedRoute role="teacher">
                <Availability />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/students"
            element={
              <ProtectedRoute role="teacher">
                <TeacherStudents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/earnings"
            element={
              <ProtectedRoute role="teacher">
                <Earnings />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/teacher-requests"
            element={
              <ProtectedRoute role="ADMIN">
                <TeacherRequests />
              </ProtectedRoute>
            }
          />

          {/* 404 fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
