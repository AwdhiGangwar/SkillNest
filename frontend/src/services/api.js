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

// ===================== ENROLLMENT REQUEST APIs =====================
export const createEnrollmentRequest = (data) =>
  api.post("/api/enrollment-requests", data);

export const getEnrollmentRequests = () =>
  api.get("/api/enrollment-requests");

export const approveEnrollmentRequest = (id) =>
  api.post(`/api/enrollment-requests/${id}/approve`);

export const rejectEnrollmentRequest = (id, reason) =>
  api.post(`/api/enrollment-requests/${id}/reject`, reason || "");

// Get enriched enrollment requests with student and course details
export const getEnrollmentRequestsEnriched = () =>
  api.get("/api/enrollment-requests/enriched/all");

// Enrollment stats
export const getEnrollmentStats = () => api.get('/api/enrollments/stats');

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

// Request users from the user-service route. The gateway routes `/api/users/**` to user-service.
export const getAllUsers = () => api.get("/api/users");

// =============== NEW: CATEGORIZED USERS APIs ===============
export const getCategorizedUsers = () => api.get("/api/admin/users/categorized");
export const getAllStudents = () => api.get("/api/admin/users/students");
export const getAllTeachers = () => api.get("/api/admin/users/teachers");
export const getAllBlockedUsers = () => api.get("/api/admin/users/blocked");
export const getStudentsByStatus = (status) => api.get(`/api/admin/users/students/${status}`);
export const getTeachersByStatus = (status) => api.get(`/api/admin/users/teachers/${status}`);

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
export const getPaymentSummary = () => api.get("/api/payments/summary");
export const getTeacherPayouts = () => api.get("/api/payments/teacher-payouts");

// ─────────────────────────────────────────────
// 🎧 SUPPORT APIs
// ─────────────────────────────────────────────
export const getSupportTickets = async () => {
  try {
    return await api.get("/api/admin/support/tickets");
  } catch (err) {
    if (err.status === 404) {
      return api.get("/api/support/tickets");
    }
    throw err;
  }
};

export const createSupportTicket = async (data) => {
  try {
    const payload = { ...data };
    // attach user email when available so admin can see raiser even if auth middleware isn't present
    try {
      const user = auth.currentUser;
      if (user && user.email) payload.userEmail = user.email;
    } catch (e) {}
    return await api.post("/api/admin/support/tickets", payload);
  } catch (err) {
    if (err.status === 404) {
      return api.post("/api/support/tickets", data);
    }
    throw err;
  }
};

export const syncSupportTicket = (ticket) => api.post('/api/admin/support/tickets/sync', ticket);

export const updateSupportTicket = async (id, updates) => {
  try {
    return await api.put(`/api/admin/support/tickets/${id}`, updates);
  } catch (err) {
    if (err.status === 404) {
      return api.put(`/api/support/tickets/${id}`, updates);
    }
    throw err;
  }
};

export const deleteSupportTicket = async (id) => {
  try {
    return await api.delete(`/api/admin/support/tickets/${id}`);
  } catch (err) {
    // Try non-admin route when admin route is not available or permission is denied
    if (err.status === 404 || err.status === 403) {
      console.warn('[deleteSupportTicket] falling back to non-admin endpoint', { id, status: err.status });
      return api.delete(`/api/support/tickets/${id}`);
    }
    throw err;
  }
};

// ─────────────────────────────────────────────
// ⚙️ SETTINGS APIs
// ─────────────────────────────────────────────
export const updateUserProfile = (data) =>
  api.put("/api/users/profile", data);
export const changePassword = (data) =>
  api.post("/api/users/change-password", data);

// ─────────────────────────────────────────────
// 📖 MODULE APIs (Course Content Management)
// ─────────────────────────────────────────────
export const createModule = (data) =>
  api.post("/api/modules", data);

export const getModule = (moduleId) =>
  api.get(`/api/modules/${moduleId}`);

export const getModulesByCourse = (courseId) =>
  api.get(`/api/modules/course/${courseId}`);

export const updateModule = (moduleId, data) =>
  api.put(`/api/modules/${moduleId}`, data);

export const deleteModule = (moduleId) =>
  api.delete(`/api/modules/${moduleId}`);

export const reorderModules = (moduleId, moduleIds) =>
  api.post(`/api/modules/${moduleId}/reorder`, { moduleIds });

// ─────────────────────────────────────────────
// 🎬 LESSON APIs (Course Content Management)
// ─────────────────────────────────────────────
export const createLesson = (data) =>
  api.post("/api/lessons", data);

export const getLesson = (lessonId) =>
  api.get(`/api/lessons/${lessonId}`);

export const getLessonsByModule = (moduleId) =>
  api.get(`/api/lessons/module/${moduleId}`);

export const updateLesson = (lessonId, data) =>
  api.put(`/api/lessons/${lessonId}`, data);

export const deleteLesson = (lessonId) =>
  api.delete(`/api/lessons/${lessonId}`);

export const reorderLessons = (lessonId, lessonIds) =>
  api.post(`/api/lessons/${lessonId}/reorder`, { lessonIds });

// ─────────────────────────────────────────────
// 📊 PROGRESS APIs (Course Content Management)
// ─────────────────────────────────────────────
export const createProgress = (data) =>
  api.post("/api/progress", data);

export const getProgress = (progressId) =>
  api.get(`/api/progress/${progressId}`);

export const getProgressByLesson = (studentId, lessonId) =>
  api.get(`/api/progress/lesson/${studentId}/${lessonId}`);

export const getCourseProgress = (studentId, courseId, totalLessons) =>
  api.get(`/api/progress/course/${studentId}/${courseId}`, { params: { totalLessons } });

export const markLessonComplete = (studentId, courseId, lessonId) =>
  api.post(`/api/progress/${studentId}/${courseId}/${lessonId}/mark-complete`);

export const updateProgress = (progressId, data) =>
  api.put(`/api/progress/${progressId}`, data);

// ─────────────────────────────────────────────
// ❓ QUIZ APIs (Course Content Management)
// ─────────────────────────────────────────────
export const createQuiz = (data) =>
  api.post("/api/quizzes", data);

export const getQuiz = (quizId) =>
  api.get(`/api/quizzes/${quizId}`);

export const getQuizzesByLesson = (lessonId) =>
  api.get(`/api/quizzes/lesson/${lessonId}`);

export const updateQuiz = (quizId, data) =>
  api.put(`/api/quizzes/${quizId}`, data);

export const deleteQuiz = (quizId) =>
  api.delete(`/api/quizzes/${quizId}`);

// ─────────────────────────────────────────────
// 📝 ASSIGNMENT APIs (Course Content Management)
// ─────────────────────────────────────────────
export const createAssignment = (data) =>
  api.post("/api/assignments", data);

export const getAssignment = (assignmentId) =>
  api.get(`/api/assignments/${assignmentId}`);

export const getAssignmentsByLesson = (lessonId) =>
  api.get(`/api/assignments/lesson/${lessonId}`);

export const updateAssignment = (assignmentId, data) =>
  api.put(`/api/assignments/${assignmentId}`, data);

export const deleteAssignment = (assignmentId) =>
  api.delete(`/api/assignments/${assignmentId}`);

export default api;