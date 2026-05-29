import React, { useEffect, useState, useRef } from "react";
import Layout from "../../components/Layout";
import { CardSkeleton, EmptyState, Badge, Modal } from "../../components/ui";
import toast from "react-hot-toast";
import {
  getEnrollmentRequests, approveEnrollmentRequest, rejectEnrollmentRequest,
  getAllCourses, getAllUsers, getEnrollmentsByCourse, getEnrollmentStats
} from "../../services/api";
import api from "../../services/api";

export default function AdminEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [enrollmentsByCourse, setEnrollmentsByCourse] = useState({});
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [weeklyCount, setWeeklyCount] = useState(0);
  const [monthlyCount, setMonthlyCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ studentId: "", courseId: "" });
  const requestsRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // ✅ Courses fetch karo
      let courseData = [];
      try {
        const courseRes = await getAllCourses();
        courseData = courseRes.data || [];
        setCourses(courseData);
      } catch (e) {
        console.warn('Failed to fetch courses', e);
      }

      // ✅ Users fetch karo
      let userData = [];
      try {
        const usersRes = await getAllUsers();
        userData = usersRes.data || [];
        setStudents(userData);
      } catch (e) {
        console.warn('Failed to fetch users', e);
      }

      // ✅ Enrollment requests fetch karo
      try {
        const res = await getEnrollmentRequests();
        const plainRequests = res.data || [];
        const enrichedRequests = plainRequests.map(req => {
          const student = userData.find(s => s.id === req.studentId);
          const course = courseData.find(c => c.id === req.courseId);
          return {
            ...req,
            studentName: student?.name || req.studentId,
            studentEmail: student?.email || '',
            courseName: course?.title || course?.name || req.courseId
          };
        });
        setRequests(enrichedRequests);
      } catch (e) {
        console.warn('Failed to fetch enrollment requests', e);
      }

      // ✅ Enrollments by course fetch karo
      const enrollPromises = courseData.map((c) =>
        getEnrollmentsByCourse(c.id)
          .then((r) => ({ courseId: c.id, enrolls: r.data || [] }))
          .catch(() => ({ courseId: c.id, enrolls: [] }))
      );
      const enrollResults = await Promise.all(enrollPromises);
      const map = {};
      enrollResults.forEach(er => { map[er.courseId] = er.enrolls; });
      setEnrollmentsByCourse(map);

      // ✅ Stats fetch karo
      try {
        const sres = await getEnrollmentStats();
        const data = sres.data || {};
        setWeeklyCount(data.weeklyCount || 0);
        setMonthlyCount(data.monthlyCount || 0);
      } catch (e) {
        console.warn('Failed to fetch stats', e);
      }

    } catch (err) {
      console.error('AdminEnrollments load error', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Course stats calculate karo
  const courseStats = courses.map((course) => {
    const enrolls = enrollmentsByCourse[course.id] || [];
    const maxSeats = course.maxStudents || course.maxSeats || 30;
    const enrolled = enrolls.length;
    return {
      ...course,
      enrolled,
      maxSeats,
      available: maxSeats - enrolled,
      occupancy: Math.round((enrolled / maxSeats) * 100),
    };
  });

  const totalEnrollments = Object.values(enrollmentsByCourse).reduce((sum, e) => sum + e.length, 0);
  const uniqueStudentIds = new Set(
    Object.values(enrollmentsByCourse).flat().map(e => e.studentId)
  ).size;

  const handleOpenModal = () => {
    setForm({ studentId: "", courseId: "" });
    setShowModal(true);
  };

  // ✅ Admin enrollment - backend pe direct call
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.studentId || !form.courseId) {
      toast.error("Please select both student and course");
      return;
    }

    setSubmitting(true);
    try {
      // ✅ Direct admin enrollment endpoint
      await api.post("/api/enrollment-requests/admin-enroll", {
        studentId: form.studentId,
        courseId: form.courseId,
      });

      toast.success("Student enrolled successfully! ✅");
      setShowModal(false);
      setForm({ studentId: "", courseId: "" });
      await loadData(); // ✅ Refresh data
    } catch (err) {
      let errorMessage = "Failed to enroll student";
      if (err.status === 403) errorMessage = "❌ Access Denied";
      else if (err.status === 401) errorMessage = "❌ Unauthorized: Please log in again";
      else if (err.message) errorMessage = err.message;
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Layout
        title="Enrollment Management"
        subtitle={`${totalEnrollments} total enrollments`}
        actions={
          <div className="flex items-center gap-2">
            <button onClick={handleOpenModal} className="btn-primary">
              + Enroll Student
            </button>
            <button
              onClick={() => requestsRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-ghost flex items-center gap-2"
            >
              Requests
              {requests.length > 0 && (
                <span className="ml-1 inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs">
                  {requests.length}
                </span>
              )}
            </button>
          </div>
        }
      >
        <div className="space-y-6">

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="glass-card p-6 rounded-xl border border-surface-border">
              <p className="text-slate-400 text-sm mb-2">Total Students</p>
              <h3 className="text-3xl font-bold text-brand-400">{uniqueStudentIds}</h3>
              <p className="text-slate-500 text-xs mt-2">Unique students</p>
            </div>
            <div className="glass-card p-6 rounded-xl border border-surface-border">
              <p className="text-slate-400 text-sm mb-2">Total Enrollments</p>
              <h3 className="text-3xl font-bold text-emerald-400">{totalEnrollments}</h3>
              <p className="text-slate-500 text-xs mt-2">Active enrollments</p>
            </div>
            <div className="glass-card p-6 rounded-xl border border-surface-border">
              <p className="text-slate-400 text-sm mb-2">Weekly</p>
              <h3 className="text-3xl font-bold text-emerald-400">{weeklyCount}</h3>
              <p className="text-slate-500 text-xs mt-2">Last 7 days</p>
            </div>
            <div className="glass-card p-6 rounded-xl border border-surface-border">
              <p className="text-slate-400 text-sm mb-2">Monthly</p>
              <h3 className="text-3xl font-bold text-amber-400">{monthlyCount}</h3>
              <p className="text-slate-500 text-xs mt-2">Last 30 days</p>
            </div>
            <div className="glass-card p-6 rounded-xl border border-surface-border">
              <p className="text-slate-400 text-sm mb-2">Total Courses</p>
              <h3 className="text-3xl font-bold text-amber-400">{courses.length}</h3>
              <p className="text-slate-500 text-xs mt-2">Available courses</p>
            </div>
            <div className="glass-card p-6 rounded-xl border border-surface-border">
              <p className="text-slate-400 text-sm mb-2">Pending Requests</p>
              <h3 className="text-3xl font-bold text-violet-400">{requests.length}</h3>
              <p className="text-slate-500 text-xs mt-2">Awaiting approval</p>
            </div>
          </div>

          {/* Course Capacity Overview */}
          <div className="glass-card p-6 rounded-xl border border-surface-border">
            <h3 className="text-lg font-display font-bold text-white mb-6">Course Capacity Overview</h3>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array(4).fill(0).map((_, i) => <CardSkeleton key={i} />)}
              </div>
            ) : courseStats.length === 0 ? (
              <p className="text-slate-400">No courses found</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {courseStats.map((course) => (
                  <div key={course.id} className="p-4 rounded-lg bg-surface-hover border border-surface-border">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-white text-sm truncate flex-1 mr-2">
                        {course.title || course.name}
                      </p>
                      <Badge variant={course.occupancy > 80 ? "warn" : "success"}>
                        {course.occupancy}%
                      </Badge>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>Enrolled:</span>
                        <span className="text-emerald-400 font-semibold">{course.enrolled}/{course.maxSeats}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Available:</span>
                        <span className="text-blue-400 font-semibold">{course.available} seats</span>
                      </div>
                      <div className="w-full bg-surface-border rounded-full h-2 mt-2">
                        <div
                          className={`h-2 rounded-full transition-all ${course.occupancy > 80 ? "bg-orange-500" : "bg-emerald-500"}`}
                          style={{ width: `${Math.min(course.occupancy, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Enrollments by Category */}
          <div className="glass-card p-6 rounded-xl border border-surface-border">
            <h3 className="text-lg font-display font-bold text-white mb-4">Enrollments by Category</h3>
            {courses.length === 0 ? (
              <p className="text-slate-400">No courses found</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(
                  courses.reduce((acc, c) => {
                    const k = c.category || 'general';
                    acc[k] = acc[k] || [];
                    acc[k].push(c);
                    return acc;
                  }, {})
                ).map(([cat, catCourses]) => {
                  const totalInCategory = catCourses.reduce(
                    (s, cc) => s + ((enrollmentsByCourse[cc.id] || []).length), 0
                  );
                  return (
                    <div key={cat} className="border-b border-surface-border pb-4">
                      <div className="mb-3">
                        <p className="text-sm text-slate-400 uppercase font-semibold">{cat}</p>
                        <h4 className="text-lg font-semibold text-white">
                          {totalInCategory} student{totalInCategory !== 1 ? 's' : ''} enrolled
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {catCourses.map((course) => {
                          const enrolls = enrollmentsByCourse[course.id] || [];
                          return (
                            <div key={course.id} className="p-3 rounded-lg bg-surface/20 border border-surface-border">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <div className="font-medium text-white text-sm">{course.title || course.name}</div>
                                  <div className="text-xs text-slate-400">{enrolls.length} enrolled</div>
                                </div>
                                <div className="text-xs text-slate-400">
                                  Seats: {course.maxStudents || course.maxSeats || '-'}
                                </div>
                              </div>
                              {enrolls.length === 0 ? (
                                <p className="text-slate-500 text-xs">No students enrolled</p>
                              ) : (
                                <ul className="list-disc ml-4 max-h-28 overflow-y-auto text-slate-300 text-xs space-y-1">
                                  {enrolls.map((en) => (
                                    <li key={en.id || en.studentId}>
                                      {students.find(s => s.id === en.studentId)?.name || en.studentId}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Enrollment Requests */}
          <div ref={requestsRef} className="glass-card p-6 rounded-xl border border-surface-border">
            <h3 className="text-lg font-display font-bold text-white mb-4">
              Enrollment Requests
              {requests.length > 0 && (
                <span className="ml-2 bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full">
                  {requests.length} pending
                </span>
              )}
            </h3>
            {requests.length === 0 ? (
              <p className="text-slate-400">No pending requests</p>
            ) : (
              <div className="space-y-3">
                {requests.map((r) => (
                  <div key={r.id} className="flex items-center justify-between bg-surface/20 p-4 rounded-lg border border-surface-border">
                    <div className="flex-1">
                      <div className="font-medium text-white">
                        👤 {r.studentName || r.studentId}
                        {r.studentEmail && (
                          <span className="text-slate-400 text-sm ml-2">({r.studentEmail})</span>
                        )}
                      </div>
                      <div className="text-sm text-slate-400 mt-1">
                        📚 {r.courseName || r.courseId}
                      </div>
                      {r.message && (
                        <div className="text-sm text-slate-300 mt-1">💬 "{r.message}"</div>
                      )}
                      <div className="text-xs text-slate-500 mt-1">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          try {
                            await approveEnrollmentRequest(r.id);
                            toast.success('✅ Approved');
                            setRequests(prev => prev.filter(x => x.id !== r.id));
                          } catch (err) {
                            toast.error(err.message || 'Failed to approve');
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold hover:bg-emerald-500 hover:text-white transition-all"
                      >
                        Approve
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            await rejectEnrollmentRequest(r.id);
                            toast.success('❌ Rejected');
                            setRequests(prev => prev.filter(x => x.id !== r.id));
                          } catch (err) {
                            toast.error(err.message || 'Failed to reject');
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-semibold hover:bg-red-500 hover:text-white transition-all"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </Layout>

      {/* ✅ Modal - Layout ke bahar */}
      {showModal && (
        <Modal
          isOpen={showModal}
          title="Enroll Student"
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Select Student</label>
              <select
                value={form.studentId}
                onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                className="input-field w-full cursor-pointer"
              >
                <option value="">-- Choose a student --</option>
                {students
                  .filter(s => s.role?.toLowerCase() === 'student')
                  .map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} ({student.email})
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Select Course</label>
              <select
                value={form.courseId}
                onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                className="input-field w-full cursor-pointer"
              >
                <option value="">-- Choose a course --</option>
                {courseStats.map((course) => (
                  <option key={course.id} value={course.id} disabled={course.available <= 0}>
                    {course.title || course.name} ({course.available} seats available)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="btn-ghost flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enrolling...
                  </>
                ) : "Enroll Student"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}