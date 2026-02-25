import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ForgotPassword from "../pages/ForgotPassword";
import ProfileSetup from "../pages/ProfileSetup";
import ComponentPlayground from "../pages/ComponentPlayground";
import TeacherDashboard from "../pages/dashboard/teacher/TeacherDashboard";
import TeacherCalendar from "../pages/dashboard/teacher/Calendar";
import TeacherStudents from "../pages/dashboard/teacher/Students";
import TeacherMyEarnings from "../pages/dashboard/teacher/MyEarnings";
import TeacherSettings from "../pages/dashboard/teacher/Settings";
import TeacherLayout from "../components/dashboard/teacher/TeacherLayout";
import StudentDashboard from "../pages/dashboard/student/StudentDashboard";
import AdminDashboard from "../pages/dashboard/admin/AdminDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/profile-setup" element={<ProfileSetup />} />
      <Route path="/dashboard" element={<ComponentPlayground />} />
      <Route path="/dashboard/teacher" element={<TeacherLayout />}>
        <Route index element={<TeacherDashboard />} />
        <Route path="calendar" element={<TeacherCalendar />} />
        <Route path="students" element={<TeacherStudents />} />
        <Route path="my-earnings" element={<TeacherMyEarnings />} />
        <Route path="settings" element={<TeacherSettings />} />
      </Route>
      <Route path="/dashboard/student" element={<StudentDashboard />} />
      <Route path="/dashboard/admin" element={<AdminDashboard />} />
    </Routes>
  );
};

export default AppRoutes;