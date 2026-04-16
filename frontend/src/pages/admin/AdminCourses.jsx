import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { getAllCourses, createCourse, updateCourse, deleteCourse, getEnrollmentsByCourse, getAllUsers, getUserById } from "../../services/api";
import { CardSkeleton, EmptyState, Badge, Modal } from "../../components/ui";
import toast from "react-hot-toast";

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "general",
    price: 0,
    maxStudents: 30,
    teacherIds: [],
  });
  const [users, setUsers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [detailsCourse, setDetailsCourse] = useState(null);
  const [courseStudents, setCourseStudents] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsTeachers, setDetailsTeachers] = useState([]);

  const fetchCourses = async () => {
    try {
      const res = await getAllCourses();
      const allCourses = res.data || [];

      // Fetch enrollments for all courses in parallel to compute real student counts
      const enrollPromises = allCourses.map(c => getEnrollmentsByCourse(c.id).then(r => ({ id: c.id, count: (r.data || []).length })).catch(() => ({ id: c.id, count: 0 })));
      const enrollResults = await Promise.all(enrollPromises);
      const enrollMap = {};
      enrollResults.forEach(er => { enrollMap[er.id] = er.count; });

      const coursesWithStats = allCourses.map((c) => ({
        ...c,
        teacherCount: (Array.isArray(c.teacherIds) && c.teacherIds.length) || (typeof c.teacherId === 'string' && c.teacherId.trim() !== '' ? 1 : 0),
        studentCount: enrollMap[c.id] || 0,
        totalSeats: c.maxStudents || 30,
      }));

      setCourses(coursesWithStats);
    } catch (err) {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    // fetch users for teacher selection
    (async () => {
      try {
        const u = await getAllUsers();
        setUsers(u.data || []);
      } catch (e) {
        console.warn('Failed to fetch users for teacher selection', e);
      }
    })();
  }, []);

  const usersMap = React.useMemo(() => {
    const m = {};
    (users || []).forEach(u => { m[u.uid || u.id] = u; });
    return m;
  }, [users]);

  const categories = React.useMemo(() => {
    const map = {};
    (courses || []).forEach(c => {
      const k = c.category || 'general';
      map[k] = (map[k] || 0) + 1;
    });
    return map;
  }, [courses]);

  const categoryMeta = {
    programming: {
      bg: 'bg-indigo-600',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-white">
          <path d="M16 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    design: {
      bg: 'bg-pink-600',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-white">
          <path d="M3 21l3-3c0 0 3-1 6-4s4-6 4-6l3-3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14.5 5.5l4 4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    business: {
      bg: 'bg-emerald-600',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-white">
          <rect x="3" y="11" width="4" height="8" rx="1" />
          <rect x="9" y="7" width="4" height="12" rx="1" />
          <rect x="15" y="3" width="4" height="16" rx="1" />
        </svg>
      )
    },
    language: {
      bg: 'bg-amber-500',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-white">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    general: {
      bg: 'bg-slate-700',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-white">
          <path d="M3 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14l-6-3-6 3V5z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    }
  };

  const openCourseDetails = async (course) => {
    setDetailsCourse(course);
    setLoadingDetails(true);
    try {
      const res = await getEnrollmentsByCourse(course.id);
      const enrolls = res.data || [];
      const students = enrolls.map(en => ({ ...en, user: usersMap[en.userId] || null }));
      setCourseStudents(students);
      // Resolve teacher user objects (use cached usersMap first, fetch missing ones)
      const teacherIds = (Array.isArray(course.teacherIds) && course.teacherIds.length) ? course.teacherIds : (course.teacherId ? [course.teacherId] : []);
      if (teacherIds.length) {
        const missing = teacherIds.filter(tid => !usersMap[tid]);
        const fetched = await Promise.all(missing.map(id => getUserById(id).then(r => ({ id, user: r.data })).catch(() => ({ id, user: null }))));
        const fetchedMap = {};
        fetched.forEach(f => { fetchedMap[f.id] = f.user; });
        const teacherObjs = teacherIds.map(id => usersMap[id] || fetchedMap[id] || null);
        setDetailsTeachers(teacherObjs);
      } else {
        setDetailsTeachers([]);
      }
    } catch (e) {
      setCourseStudents([]);
      console.warn('Failed to load enrollments', e);
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeDetails = () => { setDetailsCourse(null); setCourseStudents([]); setDetailsTeachers([]); };

  const handleOpenModal = (course = null) => {
    if (course) {
      setEditingId(course.id);
      setForm({
        title: course.title || "",
        description: course.description || "",
        category: course.category || "general",
        price: course.price || 0,
        maxStudents: course.maxStudents || 30,
        teacherIds: course.teacherIds || (course.teacherId ? [course.teacherId] : []),
      });
    } else {
      setEditingId(null);
      setForm({
        title: "",
        description: "",
        category: "general",
        price: 0,
        maxStudents: 30,
        teacherIds: [],
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const payload = { ...form, price: parseFloat(form.price) || 0 };
      if (payload.maxStudents > 120) payload.maxStudents = 120;

      if (editingId) {
        await updateCourse(editingId, payload);
        toast.success("Course updated successfully! ✅");
      } else {
        const courseData = {
          ...payload,
          id: `course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        };
        console.log("[AdminCourses] Creating course:", courseData);
        await createCourse(courseData);
        toast.success("Course created successfully! ✅");
      }
      setShowModal(false);
      setForm({ title: "", description: "", category: "general", price: 0, maxStudents: 30, teacherIds: [] });
      await fetchCourses();
    } catch (err) {
      console.error("[AdminCourses] Course save error:", {
        status: err.status,
        message: err.message,
        error: err
      });
      
      let errorMessage = "Failed to save course";
      
      if (err.status === 403) {
        errorMessage = "❌ Access Denied: You don't have teacher permissions. Please ensure your account is set as a teacher.";
      } else if (err.status === 401) {
        errorMessage = "❌ Unauthorized: Please log in again. Your session may have expired.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) return;

    setDeletingId(id);
    try {
      await deleteCourse(id);
      toast.success("Course deleted successfully!");
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      toast.error(err.message || "Failed to delete course");
    } finally {
      setDeletingId(null);
    }
  };

  const totalStudents = courses.reduce((sum, c) => sum + c.studentCount, 0);
  const avgStudentsPerCourse = courses.length > 0 ? Math.round(totalStudents / courses.length) : 0;
  const totalTeachers = courses.reduce((sum, c) => sum + c.teacherCount, 0);

  return (
    <Layout
      title="Course Management"
      subtitle={`${courses.length} course${courses.length !== 1 ? "s" : ""} on platform`}
      actions={
        <>
          <button onClick={() => handleOpenModal()} className="btn-primary">
            + Add Course
          </button>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-xl border border-surface-border">
            <p className="text-slate-400 text-sm mb-2">Total Courses</p>
            <h3 className="text-3xl font-bold text-brand-400">{courses.length}</h3>
            <p className="text-slate-500 text-xs mt-2">Active courses</p>
          </div>
          <div className="glass-card p-6 rounded-xl border border-surface-border">
            <p className="text-slate-400 text-sm mb-2">Total Students</p>
            <h3 className="text-3xl font-bold text-emerald-400">{totalStudents}</h3>
            <p className="text-slate-500 text-xs mt-2">Enrolled across all courses</p>
          </div>
          <div className="glass-card p-6 rounded-xl border border-surface-border">
            <p className="text-slate-400 text-sm mb-2">Avg Students/Course</p>
            <h3 className="text-3xl font-bold text-violet-400">{avgStudentsPerCourse}</h3>
            <p className="text-slate-500 text-xs mt-2">Average enrollment</p>
          </div>
          <div className="glass-card p-6 rounded-xl border border-surface-border">
            <p className="text-slate-400 text-sm mb-2">Total Teachers</p>
            <h3 className="text-3xl font-bold text-amber-400">{totalTeachers}</h3>
            <p className="text-slate-500 text-xs mt-2">Instructors on platform</p>
          </div>
        </div>

        {/* Courses Table */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : courses.length === 0 ? (
          <EmptyState
            icon="📚"
            title="No courses yet"
            description="Add your first course to get started"
            action={
              <button onClick={() => handleOpenModal()} className="btn-primary">
                Create Course
              </button>
            }
          />
        ) : (
          <div className="glass-card overflow-hidden border border-surface-border">
            {/* Category Summary (clean, text-only) */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-6 gap-4">
              <button
                key="all"
                onClick={() => setSelectedCategory(null)}
                className={`p-4 rounded-lg transition-all hover:shadow-md text-left ${selectedCategory === null ? 'ring-2 ring-emerald-400 bg-surface-hover/30' : 'bg-surface/20'}`}
              >
                <p className="text-xs text-slate-400 uppercase">All</p>
                <h4 className="text-lg font-semibold mt-1">{courses.length} course{courses.length !== 1 ? 's' : ''}</h4>
              </button>
              {Object.keys(categories).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`p-4 rounded-lg transition-all hover:shadow-md text-left ${selectedCategory === cat ? 'ring-2 ring-emerald-400 bg-surface-hover/30' : 'bg-surface/20'}`}
                >
                  <p className="text-xs text-slate-400 uppercase">{cat}</p>
                  <h4 className="text-lg font-semibold mt-1">{categories[cat]} course{categories[cat] !== 1 ? 's' : ''}</h4>
                </button>
              ))}
            </div>

            <table className="w-full text-left">
              <thead className="bg-surface-hover/50 text-xs uppercase text-slate-400 font-semibold">
                <tr>
                  <th className="px-6 py-4">Course Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Teachers</th>
                  <th className="px-6 py-4">Students</th>
                  <th className="px-6 py-4">Max Seats</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {(courses.filter(c => !selectedCategory || (c.category || 'general') === selectedCategory)).map((course) => (
                  <tr key={course.id} className="hover:bg-surface-hover/30 transition-colors group">
                    <td className="px-6 py-5 font-medium text-white">{course.title}</td>
                    <td className="px-6 py-5">
                      <Badge variant="info">{course.category || "General"}</Badge>
                    </td>
                    <td className="px-6 py-5 text-emerald-400 font-semibold">₹{(course.price || 0).toFixed ? (course.price || 0).toFixed(2) : course.price || 0}</td>
                    <td className="px-6 py-5 text-center">
                      <button
                        onClick={() => openCourseDetails(course)}
                        title={`View teachers for ${course.title}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 text-sm font-bold hover:bg-amber-500/30 transition-colors cursor-pointer"
                      >
                        {course.teacherCount}
                      </button>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 text-sm font-bold">
                        {course.studentCount}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-slate-300">{course.maxStudents || course.totalSeats}</td>
                      <td className="px-6 py-5 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(course)}
                        className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-semibold hover:bg-blue-500 hover:text-white transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(course.id)}
                        disabled={deletingId === course.id}
                        className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-semibold hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                      >
                        {deletingId === course.id ? "..." : "Delete"}
                      </button>
                      <button
                        onClick={() => openCourseDetails(course)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold hover:bg-emerald-500 hover:text-white transition-all"
                      >
                        Details
                      </button>
                      
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add/Edit Course Modal */}
        {showModal && (
          <Modal
            title={editingId ? "Edit Course" : "Add New Course"}
            onClose={() => setShowModal(false)}
          >
            <div className="max-h-[65vh] overflow-y-auto pr-2">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Course Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g., React Advanced Concepts"
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe the course content..."
                    rows={4}
                    className="input-field w-full resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="input-field w-full cursor-pointer"
                    >
                      <option value="general">General</option>
                      <option value="programming">Programming</option>
                      <option value="design">Design</option>
                      <option value="business">Business</option>
                      <option value="language">Language</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Price (₹)</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={form.price}
                      onChange={(e) => {
                        const cleaned = e.target.value.replace(/[^0-9.]/g, '');
                        setForm({ ...form, price: cleaned });
                      }}
                      placeholder="0.00"
                      className="input-field w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Max Students</label>
                  <input
                    type="number"
                    value={form.maxStudents}
                    onChange={(e) => {
                      let v = parseInt(e.target.value) || 0;
                      if (v < 1) v = 1;
                      if (v > 120) {
                        toast.error('Maximum students per course is 120');
                        v = 120;
                      }
                      setForm({ ...form, maxStudents: v });
                    }}
                    placeholder="30"
                    min="1"
                    className="input-field w-full"
                  />
                </div>

                {/* Assign teachers removed from admin modal per request */}

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
                    className="btn-primary flex-1"
                  >
                    {editingId ? "Update Course" : "Create Course"}
                  </button>
                </div>
              </form>
            </div>
          </Modal>
        )}
        {/* Details Modal */}
        {detailsCourse && (
          <Modal title={`Details: ${detailsCourse.title}`} onClose={closeDetails}>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              <p className="text-sm">{detailsCourse.description}</p>
              <div>
                <h4 className="font-semibold">Teachers</h4>
                <ul>
                  {detailsTeachers && detailsTeachers.length ? (
                    detailsTeachers.map((t, idx) => (
                      <li key={t && (t.uid || t.id) ? (t.uid || t.id) : idx}>{t ? (t.displayName || t.name || t.email || 'Unknown') : 'Unknown'}</li>
                    ))
                  ) : (
                    (detailsCourse.teacherIds && detailsCourse.teacherIds.length ? detailsCourse.teacherIds : (detailsCourse.teacherId ? [detailsCourse.teacherId] : [])).map(tid => (
                      <li key={tid}>{(usersMap[tid] && (usersMap[tid].displayName || usersMap[tid].name)) || tid}</li>
                    ))
                  )}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold">Students ({courseStudents.length})</h4>
                {loadingDetails ? <p>Loading...</p> : (
                  <ul>
                    {courseStudents.map(s => (
                      <li key={s.id || s.userId}>
                        {(s.user && (s.user.displayName || s.user.name)) || s.userId} {s.user && <span className="text-xs text-slate-400">({s.user.email})</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </Modal>
        )}
      </div>
    </Layout>
  );
}
