// src/services/api.js
// All backend API calls go through here

import axios from "axios";
import { auth } from "./firebase";

// In development, use relative path to leverage package.json proxy to avoid CORS
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// Auto-attach Firebase ID token to every request
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
    config.headers.uid = user.uid;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Handle network errors (Backend down / CORS issues)
    if (err.code === "ERR_NETWORK" || err.message === "Network Error") {
      return Promise.reject(
        new Error("Cannot connect to server. Please ensure the backend is running on port 8080.")
      );
    }

    // Handle HTML responses (Proxy 404s or Server 500s masked as HTML)
    if (
      typeof err.response?.data === "string" &&
      err.response.data.trim().startsWith("<")
    ) {
      return Promise.reject(new Error(`Server Error: ${err.response.status} ${err.response.statusText}`));
    }

    const msg =
      err.response?.data?.message ||
      (typeof err.response?.data === "string"
        ? err.response.data
        : JSON.stringify(err.response?.data)) ||
      err.message ||
      "Something went wrong";
    const error = new Error(msg);
    error.status = err.response?.status;
    return Promise.reject(error);
  }
);

// ─── USER APIs ──────────────────────────────────────────────
export const getMe = () => api.get("/api/me");
export const createUser = (userData) => api.post("/api/users", userData);
export const getUserById = (id) => api.get(`/api/users/${id}`);

// ─── COURSE APIs ─────────────────────────────────────────────
export const getAllCourses = () => api.get("/api/courses");
export const getCourseById = (id) => api.get(`/api/courses/${id}`);
export const createCourse = (data) => api.post("/api/courses", data);
export const updateCourse = (id, data) => api.put(`/api/courses/${id}`, data);
export const deleteCourse = (id) => api.delete(`/api/courses/${id}`);

// ─── ENROLLMENT APIs ─────────────────────────────────────────
export const enrollInCourse = (courseId) => api.post("/api/enrollments", { courseId });
export const getMyCourses = () => api.get("/api/my-courses");
export const getEnrollmentsByCourse = (courseId) =>
  api.get(`/api/enrollments/course/${courseId}`);

// ─── CLASS APIs ──────────────────────────────────────────────
export const getTeacherClasses = () => api.get("/api/classes/teacher");
export const getStudentClasses = () => api.get("/api/classes/student");
export const createClass = (data) => api.post("/api/classes", data);
export const rescheduleClass = (id, data) =>
  api.put(`/api/classes/${id}/reschedule`, data);
export const cancelClass = (id) => api.post(`/api/classes/${id}/cancel`);

// ─── AVAILABILITY APIs ───────────────────────────────────────
export const getTeacherAvailability = (teacherId) =>
  api.get(`/api/availability/${teacherId}`);
export const addAvailabilitySlot = (data) => api.post("/api/availability", data);
export const updateAvailabilitySlot = (id, data) =>
  api.put(`/api/availability/${id}`, data);
export const deleteAvailabilitySlot = (id) =>
  api.delete(`/api/availability/${id}`);

// ─── EARNINGS APIs ───────────────────────────────────────────
export const getTeacherEarnings = () => api.get("/api/earnings");
export const getMonthlyEarnings = () => api.get("/api/earnings/monthly");

// ─── HEALTH CHECK ────────────────────────────────────────────
export const checkHealth = () => api.get("/api/health");

// ─── TEACHER APPLICATION ─────────────────────────────────────
export const applyAsTeacher = (data) => api.post("/api/teacher-requests", data);

// ─── ADMIN APIs ──────────────────────────────────────────────
export const getTeacherRequests = () => api.get("/admin/teacher-requests");
export const approveTeacherRequest = (id) => api.put(`/admin/approve/${id}`);
export const rejectTeacherRequest = (id) => api.put(`/admin/reject/${id}`);

export default api;
