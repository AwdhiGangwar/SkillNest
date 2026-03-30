// src/services/api.js

import axios from "axios";
import { auth } from "./firebase";

// ✅ Always use API Gateway
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

// Axios instance
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// ─────────────────────────────────────────────
// 🔐 Attach Firebase Token Automatically
// ─────────────────────────────────────────────
api.interceptors.request.use(
  async (config) => {
    let user = auth.currentUser;

    // 🔥 wait until user available
    if (!user) {
      await new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged((u) => {
          user = u;
          unsubscribe();
          resolve();
        });
      });
    }

    if (user) {
      const token = await user.getIdToken(true);
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─────────────────────────────────────────────
// ⚠️ Global Error Handling
// ─────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🚨 Network / CORS / Backend down
    if (error.code === "ERR_NETWORK") {
      return Promise.reject(
        new Error("🚨 Server not reachable. Make sure API Gateway is running on port 8080")
      );
    }

    // 🚨 HTML response (proxy / backend crash)
    if (
      typeof error.response?.data === "string" &&
      error.response.data.startsWith("<")
    ) {
      return Promise.reject(
        new Error(`🚨 Server Error: ${error.response.status}`)
      );
    }

    // 🧠 Proper message extraction
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      "Something went wrong";

    const customError = new Error(message);
    customError.status = error.response?.status;

    return Promise.reject(customError);
  }
);

// ─────────────────────────────────────────────
// 👤 USER APIs
// ─────────────────────────────────────────────
export const getMe = () => api.get("/api/me");
export const createUser = (data) => api.post("/api/users", data);
export const getUserById = (id) => api.get(`/api/users/${id}`);

// ─────────────────────────────────────────────
// 📚 COURSE APIs
// ─────────────────────────────────────────────
export const getAllCourses = () => api.get("/api/courses");
export const getCourseById = (id) => api.get(`/api/courses/${id}`);
export const createCourse = (data) => api.post("/api/courses", data);
export const updateCourse = (id, data) => api.put(`/api/courses/${id}`, data);
export const deleteCourse = (id) => api.delete(`/api/courses/${id}`);

// ─────────────────────────────────────────────
// 🎓 ENROLLMENT APIs
// ─────────────────────────────────────────────
export const enrollInCourse = (courseId) =>
  api.post("/api/enrollments", { courseId });

export const getMyCourses = () => api.get("/api/my-courses");

export const getEnrollmentsByCourse = (courseId) =>
  api.get(`/api/enrollments/course/${courseId}`);

// ─────────────────────────────────────────────
// 📅 CLASS APIs
// ─────────────────────────────────────────────
export const getTeacherClasses = () => api.get("/api/classes/teacher");
export const getStudentClasses = () => api.get("/api/classes/student");
export const createClass = (data) => api.post("/api/classes", data);
export const rescheduleClass = (id, data) =>
  api.put(`/api/classes/${id}/reschedule`, data);
export const cancelClass = (id) =>
  api.post(`/api/classes/${id}/cancel`);

// ─────────────────────────────────────────────
// 🕒 AVAILABILITY APIs
// ─────────────────────────────────────────────
export const getTeacherAvailability = (teacherId) =>
  api.get(`/api/availability/${teacherId}`);

export const addAvailabilitySlot = (data) =>
  api.post("/api/availability", data);

export const updateAvailabilitySlot = (id, data) =>
  api.put(`/api/availability/${id}`, data);

export const deleteAvailabilitySlot = (id) =>
  api.delete(`/api/availability/${id}`);

// ─────────────────────────────────────────────
// 💰 EARNINGS APIs
// ─────────────────────────────────────────────
export const getTeacherEarnings = () => api.get("/api/earnings");
export const getMonthlyEarnings = () =>
  api.get("/api/earnings/monthly");

// ─────────────────────────────────────────────
// 🧪 HEALTH CHECK
// ─────────────────────────────────────────────
export const checkHealth = () => api.get("/api/health");

// ─────────────────────────────────────────────
// 🧑‍🏫 TEACHER REQUEST
// ─────────────────────────────────────────────
export const applyAsTeacher = (data) =>
  api.post("/api/teacher-requests", data);

// ─────────────────────────────────────────────
// 🛠️ ADMIN APIs
// ─────────────────────────────────────────────
export const getTeacherRequests = () =>
  api.get("/api/teacher-requests");

export const approveTeacherRequest = (id) =>
  api.put(`/admin/approve/${id}`);

export const rejectTeacherRequest = (id) =>
  api.put(`/admin/reject/${id}`);

// ─────────────────────────────────────────────
export default api;