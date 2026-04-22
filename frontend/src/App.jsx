// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth & Public Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import JoinTeacher from "./pages/JoinTeacher";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import BrowseCourses from "./pages/student/BrowseCourses";     // Browse Courses Page
import MyCourses from "./pages/student/MyCoursesPage";        // My Enrolled Courses
import StudentClasses from "./pages/student/StudentClasses";
import CourseLearning from "./pages/student/CourseLearning";  // Course Learning Module
import ProgressDashboard from "./pages/student/ProgressDashboard"; // Progress Dashboard

// Teacher Pages
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherCourses from "./pages/teacher/TeacherCourses";
import TeacherClasses from "./pages/teacher/TeacherClasses";
import Availability from "./pages/teacher/Availability";
import TeacherStudents from "./pages/teacher/TeacherStudents";
import Earnings from "./pages/teacher/Earnings";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import TeacherRequests from "./pages/TeacherRequests";
import CreateTeacher from "./pages/CreateTeacher";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminEnrollments from "./pages/admin/AdminEnrollments";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminSupport from "./pages/admin/AdminSupport";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminContentManager from "./pages/admin/AdminContentManager"; // Content Manager

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
          }}
        />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/join-teacher" element={<JoinTeacher />} />

          {/* Student Routes */}
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
          <Route
            path="/course-learning/:courseId"
            element={
              <ProtectedRoute role="student">
                <CourseLearning />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/progress"
            element={
              <ProtectedRoute role="student">
                <ProgressDashboard />
              </ProtectedRoute>
            }
          />

          {/* Teacher Routes */}
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

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/teacher-requests"
            element={
              <ProtectedRoute role="admin">
                <TeacherRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/create-teacher"
            element={
              <ProtectedRoute role="admin">
                <CreateTeacher />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role="admin">
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courses"
            element={
              <ProtectedRoute role="admin">
                <AdminCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/enrollments"
            element={
              <ProtectedRoute role="admin">
                <AdminEnrollments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute role="admin">
                <AdminAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payments"
            element={
              <ProtectedRoute role="admin">
                <AdminPayments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/support"
            element={
              <ProtectedRoute role="admin">
                <AdminSupport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute role="admin">
                <AdminSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/course-content/:courseId"
            element={
              <ProtectedRoute>
                <AdminContentManager />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}