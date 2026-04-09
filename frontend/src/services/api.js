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
    // Support bypassing interceptor for isolation/debugging
    if (config._skipInterceptor) return config;

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
    const status = error.response?.status;
    const responseData = error.response?.data;

    // 🔍 Enhanced logging for debugging
    console.error(`[API Error] Status: ${status}`, {
      path: error.config?.url,
      method: error.config?.method,
      data: responseData,
      message: error.message
    });

    // 🚨 Network Error
    if (error.code === "ERR_NETWORK") {
      const networkError = new Error("Server not reachable. Please check if backend is running (http://localhost:8080).");
      networkError.status = status;
      return Promise.reject(networkError);
    }

    let message = "Something went wrong";

    if (responseData?.error) {
      message = responseData.error;
    } else if (responseData?.message) {
      message = responseData.message;
    } else if (typeof responseData === "string" && responseData.length > 0) {
      message = responseData;
    } else if (error.message) {
      message = error.message;
    }

    const customError = new Error(message);
    customError.status = status;
    customError.response = error.response;

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

export const approveTeacherRequest = (id, approvalData) =>
  api.post(`/api/admin/teacher-requests/${id}/approve`, approvalData);

export const rejectTeacherRequest = (id) =>
  api.put(`/api/admin/teacher-requests/${id}/reject`);

export const getAllUsers = () => api.get("/api/admin/users");

export const blockUser = (id) => api.put(`/api/admin/user/${id}/block`);

export const unblockUser = (id) => api.put(`/api/admin/user/${id}/unblock`);

export const getAdminDashboard = () => api.get("/api/admin/dashboard");

// Refactored to use more descriptive parameter name to avoid scope confusion
export const createTeacher = (teacherData) =>
  api.post("/api/admin/create-teacher", teacherData);

// Debug function to bypass interceptors if needed
export const createTeacherRaw = (teacherData) =>
  api.post("/admin/create-teacher", teacherData, { _skipInterceptor: true });

// ─────────────────────────────────────────────
// 📊 ANALYTICS APIs
// ─────────────────────────────────────────────
export const getAnalytics = () => api.get("/api/analytics");

// ─────────────────────────────────────────────
// 💳 PAYMENTS APIs
// ─────────────────────────────────────────────
export const getPayments = () => api.get("/api/payments");
export const processPayment = (amount, courseId) =>
  api.post("/api/payments/process", { amount, courseId });

// ─────────────────────────────────────────────
// 🎧 SUPPORT APIs
// ─────────────────────────────────────────────
export const getSupportTickets = () => api.get("/api/support/tickets");
export const createSupportTicket = (data) =>
  api.post("/api/support/tickets", data);

// ─────────────────────────────────────────────
// ⚙️ SETTINGS APIs
// ─────────────────────────────────────────────
export const updateUserProfile = (data) =>
  api.put("/api/users/profile", data);
export const changePassword = (data) =>
  api.post("/api/users/change-password", data);

export default api;