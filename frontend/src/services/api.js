import axios from "axios";
import { auth } from "./firebase";

// 🌐 Base URL
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
// ⚠️ Global Error Handling (FIXED)
// ─────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("🔥 FULL ERROR:", error);
    console.log("🔥 STATUS:", error.response?.status);
    console.log("🔥 DATA:", error.response?.data);

    // 🚨 Network Error
    if (error.code === "ERR_NETWORK") {
      return Promise.reject(
        new Error("🚨 Server not reachable. Check backend (port 8080)")
      );
    }

    let message = "Something went wrong";

    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (typeof error.response?.data === "string") {
      message = error.response.data;
    } else if (error.message) {
      message = error.message;
    }

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
  api.put(`/api/admin/approve/${id}`);

export const rejectTeacherRequest = (id) =>
  api.put(`/api/admin/reject/${id}`);

// 🔥 IMPORTANT: CREATE TEACHER
export const createTeacher = (data) =>
  api.post("/api/admin/create-teacher", data);

export default api;