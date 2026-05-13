<<<<<<< HEAD
import axios from "axios";
import { auth } from "./firebase";

// 🌐 Base URL
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

// Axios instance
const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

// ─────────────────────────────────────────────
// 🔐 Attach Firebase Token Automatically
// ─────────────────────────────────────────────
api.interceptors.request.use(
  async (config) => {
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
// ⚠️ Global Error Handling
// ─────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const responseData = error.response?.data;

    console.error(`[API Error] Status: ${status}`, {
      path: error.config?.url,
      method: error.config?.method,
      data: responseData,
      message: error.message
    });

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
=======
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
>>>>>>> ca9e6a8546d45fdcb2d8dbf6b42011e2c1e874cb
export const getAllCourses = () => api.get("/api/courses");
export const getCourseById = (id) => api.get(`/api/courses/${id}`);
export const createCourse = (data) => api.post("/api/courses", data);
export const updateCourse = (id, data) => api.put(`/api/courses/${id}`, data);
<<<<<<< HEAD
export const updateCourseStatus = (id, isPublished) => api.patch(`/api/courses/${id}/status`, { isPublished });
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

export const getEnrollmentRequestsEnriched = () =>
  api.get("/api/enrollment-requests/enriched/all");

export const getEnrollmentStats = () => api.get('/api/enrollments/stats');

// ─────────────────────────────────────────────
// 📅 CLASS APIs
// ─────────────────────────────────────────────
export const getTeacherClasses = () => api.get("/api/classes/teacher");
export const getStudentClasses = () => api.get("/api/classes/student");
export const createClass = (data) => api.post("/api/classes", data);
export const getClassesByCourseId = (courseId) => api.get(`/api/classes/course/${courseId}`);
export const getClassesByCourse = (courseId) => api.get(`/api/classes/course/${courseId}`);
export const deleteClass = (classId) => api.delete(`/api/classes/${classId}`);
export const updateClass = (classId, data) => api.put(`/api/classes/${classId}`, data);

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
export const getMonthlyEarnings = () => api.get("/api/earnings/monthly");

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
  api.post(`/api/teacher-requests/${id}/approve`, approvalData);

export const rejectTeacherRequest = (id) =>
  api.put(`/api/teacher-requests/${id}/reject`);

export const getAllUsers = () => api.get("/api/users");

export const getCategorizedUsers = () => api.get("/api/admin/users/categorized");
export const getAllStudents = () => api.get("/api/admin/users/students");
export const getAllTeachers = () => api.get("/api/admin/users/teachers");
export const getAllBlockedUsers = () => api.get("/api/admin/users/blocked");
export const getStudentsByStatus = (status) => api.get(`/api/admin/users/students/${status}`);
export const getTeachersByStatus = (status) => api.get(`/api/admin/users/teachers/${status}`);

export const blockUser = (id) => api.put(`/api/admin/user/${id}/block`);
export const unblockUser = (id) => api.put(`/api/admin/user/${id}/unblock`);

export const getAdminDashboard = async () => {
   try {
    return await api.get("/api/admin/dashboard", {
      timeout: 30000 // ✅ 30 seconds
    });
  } catch (err) {
    if (err.status === 500) {
      console.warn("[api.js] Admin Dashboard aggregator failed.");
    }
    throw err;
  }
};

export const createTeacher = (teacherData) =>
  api.post("/api/admin/create-teacher", teacherData);

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

export const syncSupportTicket = (ticket) =>
  api.post('/api/admin/support/tickets/sync', ticket);

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
    if (err.status === 404 || err.status === 403) {
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
// 📖 MODULE APIs
// ─────────────────────────────────────────────
export const createModule = (data) => api.post("/api/modules", data);
export const getModule = (moduleId) => api.get(`/api/modules/${moduleId}`);
export const getModulesByCourse = (courseId) => api.get(`/api/modules/course/${courseId}`);
export const updateModule = (moduleId, data) => api.put(`/api/modules/${moduleId}`, data);
export const deleteModule = (moduleId) => api.delete(`/api/modules/${moduleId}`);
export const reorderModules = (courseId, moduleIds) =>
  api.post(`/api/courses/${courseId}/modules/reorder`, { moduleIds });

// ─────────────────────────────────────────────
// 🎬 LESSON APIs
// ─────────────────────────────────────────────
export const createLesson = (data) => api.post("/api/lessons", data);
export const getLesson = (lessonId) => api.get(`/api/lessons/${lessonId}`);
export const getLessonsByModule = (moduleId) => api.get(`/api/lessons/module/${moduleId}`);
export const updateLesson = (lessonId, data) => api.put(`/api/lessons/${lessonId}`, data);
export const deleteLesson = (lessonId) => api.delete(`/api/lessons/${lessonId}`);
export const reorderLessons = (moduleId, lessonIds) =>
  api.post(`/api/modules/${moduleId}/lessons/reorder`, { lessonIds });

// ─────────────────────────────────────────────
// 📊 PROGRESS APIs
// ─────────────────────────────────────────────
export const createProgress = (data) => api.post("/api/progress", data);
export const getProgress = (progressId) => api.get(`/api/progress/${progressId}`);
export const getProgressByLesson = (studentId, lessonId) =>
  api.get(`/api/progress/lesson/${studentId}/${lessonId}`);
export const getCourseProgress = (studentId, courseId, totalLessons) =>
  api.get(`/api/progress/course/${studentId}/${courseId}`, { params: { totalLessons } });
export const markLessonComplete = (studentId, courseId, lessonId) =>
  api.post(`/api/progress/${studentId}/${courseId}/${lessonId}/mark-complete`);
export const updateProgress = (progressId, data) =>
  api.put(`/api/progress/${progressId}`, data);

// ─────────────────────────────────────────────
// ❓ QUIZ APIs
// ─────────────────────────────────────────────
export const createQuiz = (data) => api.post("/api/quizzes", data);
export const getQuiz = (quizId) => api.get(`/api/quizzes/${quizId}`);
export const getQuizzesByLesson = (lessonId) => api.get(`/api/quizzes/lesson/${lessonId}`);
export const updateQuiz = (quizId, data) => api.put(`/api/quizzes/${quizId}`, data);
export const deleteQuiz = (quizId) => api.delete(`/api/quizzes/${quizId}`);

// ─────────────────────────────────────────────
// 📝 ASSIGNMENT APIs
// ─────────────────────────────────────────────
export const createAssignment = (data) => api.post("/api/assignments", data);
export const getAssignment = (assignmentId) => api.get(`/api/assignments/${assignmentId}`);
export const getAssignmentsByLesson = (lessonId) => api.get(`/api/assignments/lesson/${lessonId}`);
export const getAssignmentsByCourse = (courseId) => api.get(`/api/assignments/course/${courseId}`); // ✅ Add kiya
export const updateAssignment = (assignmentId, data) => api.put(`/api/assignments/${assignmentId}`, data);
export const deleteAssignment = (assignmentId) => api.delete(`/api/assignments/${assignmentId}`);

// ─────────────────────────────────────────────
// 📤 SUBMISSION APIs
// ─────────────────────────────────────────────
export const createSubmission = (data) => api.post("/api/submissions", data); // ✅ Add kiya
export const getSubmissionsByAssignment = (assignmentId) =>
  api.get(`/api/submissions/assignment/${assignmentId}`);
export const getMySubmissions = () => api.get("/api/submissions/my");

// ─────────────────────────────────────────────
// 📤 FILE UPLOAD - Cloudinary
// ─────────────────────────────────────────────
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "skillnest_assignments");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/drzjvnmfk/raw/upload`, // ✅ Fixed URL
    { method: "POST", body: formData }
  );

  const data = await res.json();
  return data.secure_url;
};

export default api;
=======
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
export const getTeacherRequests = () => api.get("/api/teacher-requests");
export const approveTeacherRequest = (id) => api.put(`/admin/approve/${id}`);
export const rejectTeacherRequest = (id) => api.put(`/admin/reject/${id}`);

export default api;
>>>>>>> ca9e6a8546d45fdcb2d8dbf6b42011e2c1e874cb
