import React, { useEffect, useState, useRef } from "react";
import Layout from "../../components/Layout";
import { CardSkeleton, EmptyState, Badge, Modal } from "../../components/ui";
import toast from "react-hot-toast";
import { getEnrollmentRequests, approveEnrollmentRequest, rejectEnrollmentRequest, getAllCourses, getAllUsers, getEnrollmentsByCourse } from "../../services/api";

export default function AdminEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [enrollmentsByCourse, setEnrollmentsByCourse] = useState({});
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [weeklyCount, setWeeklyCount] = useState(0);
  const [monthlyCount, setMonthlyCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    studentId: "",
    courseId: "",
  });

  // Mock data for enrollments - would come from real API
  const mockEnrollments = [
    { id: 1, studentName: "John Doe", email: "john@example.com", courseName: "React Basics", courseId: "c1", enrolledDate: "2024-01-15", status: "active" },
    { id: 2, studentName: "Jane Smith", email: "jane@example.com", courseName: "Advanced JS", courseId: "c2", enrolledDate: "2024-01-20", status: "active" },
    { id: 3, studentName: "Mike Johnson", email: "mike@example.com", courseName: "React Basics", courseId: "c1", enrolledDate: "2024-02-01", status: "completed" },
    { id: 4, studentName: "Sarah Wilson", email: "sarah@example.com", courseName: "Python Fundamentals", courseId: "c3", enrolledDate: "2024-02-10", status: "active" },
    { id: 5, studentName: "Tom Brown", email: "tom@example.com", courseName: "Web Design", courseId: "c4", enrolledDate: "2024-02-15", status: "active" },
  ];

  const mockCourses = [
    { id: "c1", name: "React Basics", maxSeats: 30 },
    { id: "c2", name: "Advanced JS", maxSeats: 25 },
    { id: "c3", name: "Python Fundamentals", maxSeats: 35 },
    { id: "c4", name: "Web Design", maxSeats: 20 },
  ];

  const mockStudents = [
    { id: "s1", name: "John Doe", email: "john@example.com" },
    { id: "s2", name: "Jane Smith", email: "jane@example.com" },
    { id: "s3", name: "Mike Johnson", email: "mike@example.com" },
    { id: "s4", name: "Sarah Wilson", email: "sarah@example.com" },
    { id: "s5", name: "Tom Brown", email: "tom@example.com" },
  ];

  useEffect(() => {
    (async () => {
      try {
        // fetch real data; fallback to mocks on failure
        let courseRes;
        try {
          courseRes = await getAllCourses();
          setCourses(courseRes.data || []);
        } catch (e) {
          console.warn('Failed to fetch courses, using mock', e);
          setCourses(mockCourses);
          courseRes = { data: mockCourses };
        }

        let usersRes;
        try {
          usersRes = await getAllUsers();
          setStudents(usersRes.data || []);
        } catch (e) {
          console.warn('Failed to fetch users, using mock', e);
          setStudents(mockStudents);
          usersRes = { data: mockStudents };
        }

        // load enrollment requests
        try {
          const res = await getEnrollmentRequests();
          setRequests(res.data || []);
        } catch (e) {
          console.warn('Failed to fetch enrollment requests', e);
        }

        // For each course, fetch enrollments
        const currentCourses = courseRes?.data || mockCourses;
        const enrollPromises = currentCourses.map((c) =>
          getEnrollmentsByCourse(c.id).then((r) => ({ courseId: c.id, enrolls: r.data || [] })).catch(() => ({ courseId: c.id, enrolls: [] }))
        );

        const enrollResults = await Promise.all(enrollPromises);
        const map = {};
        enrollResults.forEach(er => { map[er.courseId] = er.enrolls; });
        setEnrollmentsByCourse(map);

        // fetch stats
        try {
          const sres = await getEnrollmentStats();
          const data = sres.data || {};
          setWeeklyCount(data.weeklyCount || data.weekly || 0);
          setMonthlyCount(data.monthlyCount || data.monthly || 0);
        } catch (e) {
          console.warn('Failed to fetch enrollment stats', e);
        }

      } catch (err) {
        console.error('AdminEnrollments init error', err);
        // fallback to mocks
        setEnrollments(mockEnrollments);
        setCourses(mockCourses);
        setStudents(mockStudents);
        setEnrollmentsByCourse({});
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Calculate unique students
  const uniqueStudents = new Set(enrollments.map((e) => e.email)).size;

  // Calculate enrollment stats by course
  const courseStats = courses.map((course) => {
    const enrolled = enrollments.filter((e) => e.courseId === course.id).length;
    return {
      ...course,
      enrolled,
      available: course.maxSeats - enrolled,
      occupancy: Math.round((enrolled / course.maxSeats) * 100),
    };
  });


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this enrollment?")) return;

    setDeletingId(id);
    try {
      setEnrollments((prev) => prev.filter((e) => e.id !== id));
      toast.success("Enrollment removed successfully!");
    } catch (err) {
      toast.error("Failed to remove enrollment");
    } finally {
      setDeletingId(null);
    }
  };

  const handleOpenModal = () => {
    setForm({ studentId: "", courseId: "" });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.studentId || !form.courseId) {
      toast.error("Please select both student and course");
      return;
    }

    try {
      const student = students.find((s) => s.id === form.studentId);
      const course = courses.find((c) => c.id === form.courseId);

      const newEnrollment = {
        id: enrollments.length + 1,
        studentName: student.name,
        email: student.email,
        courseName: course.name,
        courseId: course.id,
        enrolledDate: new Date().toISOString().split("T")[0],
        status: "active",
      };

      console.log("[AdminEnrollments] Creating enrollment:", newEnrollment);
      setEnrollments([...enrollments, newEnrollment]);
      toast.success("Student enrolled successfully!");
      setShowModal(false);
      setForm({ studentId: "", courseId: "" });
    } catch (err) {
      console.error("[AdminEnrollments] Enrollment error:", {
        status: err.status,
        message: err.message,
        error: err
      });
      
      let errorMessage = "Failed to create enrollment";
      
      if (err.status === 403) {
        errorMessage = "❌ Access Denied: Only students can enroll in courses.";
      } else if (err.status === 401) {
        errorMessage = "❌ Unauthorized: Please log in again.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage);
    }
  };

  const avgCoursesPerStudent = enrollments.length > 0 ? (enrollments.length / uniqueStudents).toFixed(1) : 0;
  const requestsRef = useRef(null);

  return (
    <Layout
      title="Enrollment Management"
      subtitle={`${enrollments.length} total enrollment${enrollments.length !== 1 ? "s" : ""}`}
      actions={
        <div className="flex items-center gap-2">
          <button onClick={handleOpenModal} className="btn-primary">+ Enroll Student</button>
          <button
            onClick={() => requestsRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-ghost flex items-center gap-2"
            title="View enrollment requests"
          >
            Requests
            {requests.length > 0 && (
              <span className="ml-1 inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs">{requests.length}</span>
            )}
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-xl border border-surface-border">
            <p className="text-slate-400 text-sm mb-2">Total Students</p>
            <h3 className="text-3xl font-bold text-brand-400">{uniqueStudents}</h3>
            <p className="text-slate-500 text-xs mt-2">Registered students</p>
          </div>
          <div className="glass-card p-6 rounded-xl border border-surface-border">
            <p className="text-slate-400 text-sm mb-2">Total Enrollments</p>
            <h3 className="text-3xl font-bold text-emerald-400">{enrollments.length}</h3>
            <p className="text-slate-500 text-xs mt-2">Active enrollments</p>
          </div>
          <div className="glass-card p-6 rounded-xl border border-surface-border">
            <p className="text-slate-400 text-sm mb-2">Weekly Enrollments</p>
            <h3 className="text-3xl font-bold text-emerald-400">{weeklyCount}</h3>
            <p className="text-slate-500 text-xs mt-2">Last 7 days</p>
          </div>
          <div className="glass-card p-6 rounded-xl border border-surface-border">
            <p className="text-slate-400 text-sm mb-2">Monthly Enrollments</p>
            <h3 className="text-3xl font-bold text-amber-400">{monthlyCount}</h3>
            <p className="text-slate-500 text-xs mt-2">Last 30 days</p>
          </div>
          <div className="glass-card p-6 rounded-xl border border-surface-border">
            <p className="text-slate-400 text-sm mb-2">Avg Courses/Student</p>
            <h3 className="text-3xl font-bold text-violet-400">{avgCoursesPerStudent}</h3>
            <p className="text-slate-500 text-xs mt-2">Courses per student</p>
          </div>
          <div className="glass-card p-6 rounded-xl border border-surface-border">
            <p className="text-slate-400 text-sm mb-2">Total Courses</p>
            <h3 className="text-3xl font-bold text-amber-400">{courses.length}</h3>
            <p className="text-slate-500 text-xs mt-2">Available courses</p>
          </div>
        </div>

        {/* Course Capacity Overview */}
        <div className="glass-card p-6 rounded-xl border border-surface-border">
          <h3 className="text-lg font-display font-bold text-white mb-6">Course Capacity Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courseStats.map((course) => (
              <div key={course.id} className="p-4 rounded-lg bg-surface-hover border border-surface-border">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-white text-sm">{course.name}</p>
                  <Badge variant={course.occupancy > 80 ? "warn" : "success"}>{course.occupancy}%</Badge>
                </div>
                <div className="space-y-2 text-xs">
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
                      className={`h-2 rounded-full transition-all ${
                        course.occupancy > 80 ? "bg-orange-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${course.occupancy}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Enrollments by Category */}
        <div className="glass-card p-6 rounded-xl border border-surface-border">
          <h3 className="text-lg font-display font-bold text-white mb-4">Enrollments by Category</h3>
          {courses.length === 0 ? (
            <p className="text-slate-400">No courses found</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(courses.reduce((acc, c) => {
                const k = c.category || 'general';
                acc[k] = acc[k] || [];
                acc[k].push(c);
                return acc;
              }, {})).map(([cat, catCourses]) => {
                const totalInCategory = catCourses.reduce((s, cc) => s + ((enrollmentsByCourse[cc.id] || []).length), 0);
                return (
                  <div key={cat} className="border-b border-surface-border pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm text-slate-400 uppercase">{cat}</p>
                        <h4 className="text-lg font-semibold">{totalInCategory} student{totalInCategory !== 1 ? 's' : ''} enrolled</h4>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      {catCourses.map((course) => {
                        const enrolls = enrollmentsByCourse[course.id] || [];
                        return (
                          <div key={course.id} className="p-3 rounded bg-surface/20">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">{course.title || course.name || course.title}</div>
                                <div className="text-sm text-slate-400">{enrolls.length} enrolled</div>
                              </div>
                              <div className="text-sm text-slate-400">Seats: {course.maxStudents || course.maxSeats || '-'}</div>
                            </div>
                            <div className="mt-2 text-sm">
                              {enrolls.length === 0 ? (
                                <div className="text-slate-500">No students enrolled</div>
                              ) : (
                                <ul className="list-disc ml-5 mt-1 max-h-36 overflow-y-auto text-slate-300">
                                  {enrolls.map((en) => (
                                    <li key={en.id || en.studentId}>{(students.find(s => s.id === en.studentId)?.name) || en.studentId}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
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

        {/* Enrollments Table */}
        {/* Enrollment Requests */}
        <div ref={requestsRef} className="glass-card overflow-hidden border border-surface-border p-6 mb-6">
          <h3 className="text-lg font-display font-bold text-white mb-4">Enrollment Requests</h3>
          {requests.length === 0 ? (
            <p className="text-slate-400">No pending requests</p>
          ) : (
            <div className="space-y-3">
              {requests.map((r) => (
                <div key={r.id} className="flex items-center justify-between bg-surface/20 p-3 rounded">
                  <div>
                    <div className="font-medium">Student: {r.studentId}</div>
                    <div className="text-sm text-slate-400">Course: {r.courseId}</div>
                    {r.message && <div className="text-sm mt-1">"{r.message}"</div>}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        try {
                          await approveEnrollmentRequest(r.id);
                          toast.success('Approved');
                          setRequests((prev) => prev.filter(x => x.id !== r.id));
                        } catch (err) {
                          toast.error(err.message || 'Failed to approve');
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold hover:bg-emerald-500 hover:text-white transition-all"
                    >Approve</button>
                    <button
                      onClick={async () => {
                        try {
                          await rejectEnrollmentRequest(r.id);
                          toast.success('Rejected');
                          setRequests((prev) => prev.filter(x => x.id !== r.id));
                        } catch (err) {
                          toast.error(err.message || 'Failed to reject');
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-semibold hover:bg-red-500 hover:text-white transition-all"
                    >Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
          {loading ? (
          <div className="space-y-3">
            {Array(5).fill(0).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : enrollments.length === 0 ? (
          <EmptyState
            icon="🎓"
            title="No enrollments yet"
            description="Enroll your first student to get started"
            action={
              <button onClick={handleOpenModal} className="btn-primary">
                Enroll Student
              </button>
            }
          />
        ) : (
          <div className="glass-card overflow-hidden border border-surface-border">
            <table className="w-full text-left">
              <thead className="bg-surface-hover/50 text-xs uppercase text-slate-400 font-semibold">
                <tr>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Course</th>
                  <th className="px-6 py-4">Enrolled Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {enrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="hover:bg-surface-hover/30 transition-colors group">
                    <td className="px-6 py-5 font-medium text-white">{enrollment.studentName}</td>
                    <td className="px-6 py-5 text-slate-400 text-sm">{enrollment.email}</td>
                    <td className="px-6 py-5 text-slate-300">{enrollment.courseName}</td>
                    <td className="px-6 py-5 text-slate-500 text-sm">{enrollment.enrolledDate}</td>
                    <td className="px-6 py-5">
                      <Badge variant={enrollment.status === "active" ? "success" : "info"}>
                        {enrollment.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-5 text-right">
                      {/* Remove action intentionally hidden per request */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Enroll Student Modal */}
      {showModal && (
        <Modal title="Enroll Student" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Select Student</label>
              <select
                value={form.studentId}
                onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                className="input-field w-full cursor-pointer"
              >
                <option value="">-- Choose a student --</option>
                {students.map((student) => (
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
                  <option key={course.id} value={course.id} disabled={course.available === 0}>
                    {course.name} ({course.available} seats available)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={() => setShowModal(false)} className="btn-ghost flex-1">
                Cancel
              </button>
              <button type="submit" className="btn-primary flex-1">
                Enroll Student
              </button>
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  );
}
