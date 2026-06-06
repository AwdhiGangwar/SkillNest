import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";
import { getAllCourses, createCourse, updateCourse, deleteCourse, getEnrollmentsByCourse, getAllUsers, getUserById, updateCourseStatus } from "../../services/api";
import { CardSkeleton, EmptyState, Badge, Modal } from "../../components/ui";
import toast from "react-hot-toast";
import { CheckIcon, XIcon, SquareCheckIcon, Notebook } from "lucide-react";
export default function AdminCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [form, setForm] = useState({
    title: "", description: "", category: "general", price: 0,
    maxStudents: 30, teacherIds: [], teacherId: "",
    duration: 0, level: "beginner", totalClasses: 0, modules: "",
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
      const enrollPromises = allCourses.map(c =>
        getEnrollmentsByCourse(c.id)
          .then(r => ({ id: c.id, count: (r.data || []).length }))
          .catch(() => ({ id: c.id, count: 0 }))
      );
      const enrollResults = await Promise.all(enrollPromises);
      const enrollMap = {};
      enrollResults.forEach(er => { enrollMap[er.id] = er.count; });
      const coursesWithStats = allCourses.map((c) => ({
        ...c,
        teacherCount: (Array.isArray(c.teacherIds) && c.teacherIds.length) ||
          (typeof c.teacherId === 'string' && c.teacherId.trim() !== '' ? 1 : 0),
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
    (async () => {
      try {
        const u = await getAllUsers();
        setUsers(u.data || []);
      } catch (e) {
        console.warn('Failed to fetch users', e);
      }
    })();
  }, []);

  const usersMap = React.useMemo(() => {
    const m = {};
    (users || []).forEach(u => { m[u.uid || u.id] = u; });
    return m;
  }, [users]);

  const teacherList = React.useMemo(() => {
    return (users || []).filter(u =>
      u.role?.toLowerCase() === 'teacher' || u.role?.toLowerCase() === 'admin'
    );
  }, [users]);

  const categories = React.useMemo(() => {
    const map = {};
    (courses || []).forEach(c => {
      const k = c.category || 'general';
      map[k] = (map[k] || 0) + 1;
    });
    return map;
  }, [courses]);

  const openCourseDetails = async (course) => {
    setDetailsCourse(course);
    setLoadingDetails(true);
    try {
      const res = await getEnrollmentsByCourse(course.id);
      const enrolls = res.data || [];
      setCourseStudents(enrolls.map(en => ({ ...en, user: usersMap[en.userId] || null })));
      const teacherIds = (Array.isArray(course.teacherIds) && course.teacherIds.length)
        ? course.teacherIds : (course.teacherId ? [course.teacherId] : []);
      if (teacherIds.length) {
        const missing = teacherIds.filter(tid => !usersMap[tid]);
        const fetched = await Promise.all(
          missing.map(id => getUserById(id).then(r => ({ id, user: r.data })).catch(() => ({ id, user: null })))
        );
        const fetchedMap = {};
        fetched.forEach(f => { fetchedMap[f.id] = f.user; });
        setDetailsTeachers(teacherIds.map(id => usersMap[id] || fetchedMap[id] || null));
      } else {
        setDetailsTeachers([]);
      }
    } catch (e) {
      setCourseStudents([]);
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeDetails = () => {
    setDetailsCourse(null);
    setCourseStudents([]);
    setDetailsTeachers([]);
  };

  const handleOpenModal = (course = null) => {
    if (course) {
      setEditingId(course.id);
      setForm({
        title: course.title || "", description: course.description || "",
        category: course.category || "general", price: course.price || 0,
        maxStudents: course.maxStudents || 30,
        teacherIds: course.teacherIds || (course.teacherId ? [course.teacherId] : []),
        teacherId: course.teacherId || "", duration: course.duration || 0,
        level: course.level || "beginner", totalClasses: course.totalClasses || 0,
        modules: course.modules || "",
      });
    } else {
      setEditingId(null);
      setForm({
        title: "", description: "", category: "general", price: 0,
        maxStudents: 30, teacherIds: [], teacherId: "",
        duration: 0, level: "beginner", totalClasses: 0, modules: "",
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
        toast.success("Course updated!" + <CheckIcon />);
      } else {
        await createCourse({
          ...payload,
          id: `course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        });
        toast.success("Course created! " + <CheckIcon />);
      }
      setShowModal(false);
      setForm({ title: "", description: "", category: "general", price: 0, maxStudents: 30, teacherIds: [], duration: 0, level: "beginner", totalClasses: 0, modules: "" });
      await fetchCourses();
    } catch (err) {
      let errorMessage = "Failed to save course";
      if (err.status === 403) errorMessage = <XIcon /> + " Access Denied: No teacher permissions";
      else if (err.status === 401) errorMessage = <XIcon /> + " Unauthorized: Please log in again";
      else if (err.message) errorMessage = err.message;
      toast.error(errorMessage);
    }
  };

  const handleTogglePublish = async (id, currentStatus) => {
    try {
      await updateCourseStatus(id, !currentStatus);
      toast.success(currentStatus ? "Course unpublished" : "Course published!" + <SquareCheckIcon />);
      fetchCourses();
    } catch (err) {
      toast.error("Failed to update course status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    setDeletingId(id);
    try {
      await deleteCourse(id);
      toast.success("Course deleted!");
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
    <>
      <Layout
        title="Course Management"
        subtitle={`${courses.length} course${courses.length !== 1 ? "s" : ""} on platform`}
        actions={
          <button onClick={() => handleOpenModal()} className="btn-primary">
            + Add Course
          </button>
        }
      >
        <div className="space-y-6">
          {/* Stats */}
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

          {/* Table */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : courses.length === 0 ? (
            <EmptyState
              icon={<Notebook className="w-12 h-12 text-slate-400" />}
              title="No courses yet"
              description="Add your first course to get started"
              action={<button onClick={() => handleOpenModal()} className="btn-primary">Create Course</button>}
            />
          ) : (
            <div className="glass-card overflow-hidden border border-surface-border">
              <div className="mt-6 grid grid-cols-2 md:grid-cols-6 gap-4">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`p-4 rounded-lg text-left ${selectedCategory === null ? 'ring-2 ring-emerald-400 bg-surface-hover/30' : 'bg-surface/20'}`}
                >
                  <p className="text-xs text-slate-400 uppercase">All</p>
                  <h4 className="text-lg font-semibold mt-1">{courses.length} courses</h4>
                </button>
                {Object.keys(categories).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`p-4 rounded-lg text-left ${selectedCategory === cat ? 'ring-2 ring-emerald-400 bg-surface-hover/30' : 'bg-surface/20'}`}
                  >
                    <p className="text-xs text-slate-400 uppercase">{cat}</p>
                    <h4 className="text-lg font-semibold mt-1">{categories[cat]} courses</h4>
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
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {courses.filter(c => !selectedCategory || (c.category || 'general') === selectedCategory).map((course) => (
                    <tr key={course.id} className="hover:bg-surface-hover/30 transition-all group">
                      <td className="px-6 py-5 font-medium text-white">{course.title}</td>
                      <td className="px-6 py-5"><Badge variant="info">{course.category || "General"}</Badge></td>
                      <td className="px-6 py-5 text-emerald-400 font-semibold">₹{(course.price || 0).toFixed(2)}</td>
                      <td className="px-6 py-5 text-center">
                        <button onClick={() => openCourseDetails(course)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 text-sm font-bold">
                          {course.teacherCount}
                        </button>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 text-sm font-bold">
                          {course.studentCount}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <button onClick={() => handleTogglePublish(course.id, course.isPublished)}
                          className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${course.isPublished ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>
                          {course.isPublished ? "Published" : "Draft"}
                        </button>
                      </td>
                      <td className="px-6 py-5 text-slate-300">{course.maxStudents}</td>
                      <td className="px-6 py-5 text-right flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenModal(course)}
                          className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-semibold hover:bg-blue-500 hover:text-white transition-all">
                          Edit
                        </button>
                        <button onClick={() => navigate(`/course-content/${course.id}`)}
                          className="px-3 py-1.5 rounded-lg bg-brand-500/10 text-brand-400 text-xs font-semibold hover:bg-brand-500 hover:text-white transition-all">
                          Manage Content
                        </button>
                        <button onClick={() => handleDelete(course.id)} disabled={deletingId === course.id}
                          className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-semibold hover:bg-red-500 hover:text-white transition-all disabled:opacity-50">
                          {deletingId === course.id ? "..." : "Delete"}
                        </button>
                        <button onClick={() => openCourseDetails(course)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold hover:bg-emerald-500 hover:text-white transition-all">
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Layout>

      {/* ✅ Modals - Layout ke BAHAR */}
      {showModal && (
        <Modal
          isOpen={showModal}
          title={editingId ? "Edit Course" : "Add New Course"}
          onClose={() => setShowModal(false)}
        >
          <div className="max-h-[65vh] overflow-y-auto pr-2">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Course Title</label>
                <input type="text" value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g., React Advanced Concepts" className="input-field w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the course content..." rows={4} className="input-field w-full resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Assign Primary Instructor</label>
                <select value={form.teacherId}
                  onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
                  className="input-field w-full cursor-pointer">
                  <option value="">-- Select a Teacher --</option>
                  {teacherList.map((t) => (
                    <option key={t.uid || t.id} value={t.uid || t.id}>
                      {t.name || t.displayName} ({t.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                  <select value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="input-field w-full cursor-pointer">
                    <option value="general">General</option>
                    <option value="programming">Programming</option>
                    <option value="design">Design</option>
                    <option value="business">Business</option>
                    <option value="language">Language</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Price (₹)</label>
                  <input type="text" inputMode="decimal" value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value.replace(/[^0-9.]/g, '') })}
                    placeholder="0.00" className="input-field w-full" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Level</label>
                  <select value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value })}
                    className="input-field w-full cursor-pointer">
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Duration (Hours)</label>
                  <input type="number" value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) || 0 })}
                    placeholder="0" min="0" className="input-field w-full" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Total Classes</label>
                  <input type="number" value={form.totalClasses}
                    onChange={(e) => setForm({ ...form, totalClasses: parseInt(e.target.value) || 0 })}
                    placeholder="0" min="0" className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Max Students</label>
                  <input type="number" value={form.maxStudents}
                    onChange={(e) => {
                      let v = parseInt(e.target.value) || 0;
                      if (v > 120) { toast.error('Max 120 students'); v = 120; }
                      setForm({ ...form, maxStudents: v });
                    }}
                    placeholder="30" min="1" className="input-field w-full" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Course Modules</label>
                <textarea value={form.modules}
                  onChange={(e) => setForm({ ...form, modules: e.target.value })}
                  placeholder="e.g., Introduction, Variables, Functions..."
                  rows={4} className="input-field w-full resize-none" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-ghost flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">
                  {editingId ? "Update Course" : "Create Course"}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {detailsCourse && (
        <Modal
          isOpen={!!detailsCourse}
          title={`Details: ${detailsCourse.title}`}
          onClose={closeDetails}
        >
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <p className="text-sm">{detailsCourse.description}</p>
            <div>
              <h4 className="font-semibold mb-2">Teachers</h4>
              <ul className="space-y-1">
                {detailsTeachers?.length ? (
                  detailsTeachers.map((t, idx) => (
                    <li key={t?.uid || t?.id || idx}>{t?.displayName || t?.name || t?.email || 'Unknown'}</li>
                  ))
                ) : <li className="text-slate-400">No teachers assigned</li>}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Students ({courseStudents.length})</h4>
              {loadingDetails ? <p>Loading...</p> : (
                <ul className="space-y-1">
                  {courseStudents.map(s => (
                    <li key={s.id || s.userId}>
                      {s.user?.displayName || s.user?.name || s.userId}
                      {s.user && <span className="text-xs text-slate-400 ml-2">({s.user.email})</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}