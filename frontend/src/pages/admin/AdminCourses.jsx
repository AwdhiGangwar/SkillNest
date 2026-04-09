import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { getAllCourses, createCourse, updateCourse, deleteCourse } from "../../services/api";
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
  });

  const fetchCourses = async () => {
    try {
      const res = await getAllCourses();
      // Mock additional data for demonstration
      const coursesWithStats = (res.data || []).map((c) => ({
        ...c,
        teacherCount: Math.floor(Math.random() * 3) + 1,
        studentCount: Math.floor(Math.random() * 50),
        totalSeats: 30,
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
  }, []);

  const handleOpenModal = (course = null) => {
    if (course) {
      setEditingId(course.id);
      setForm({
        title: course.title || "",
        description: course.description || "",
        category: course.category || "general",
        price: course.price || 0,
        maxStudents: course.maxStudents || 30,
      });
    } else {
      setEditingId(null);
      setForm({
        title: "",
        description: "",
        category: "general",
        price: 0,
        maxStudents: 30,
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
      if (editingId) {
        await updateCourse(editingId, form);
        toast.success("Course updated successfully! ✅");
      } else {
        const courseData = {
          ...form,
          id: `course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        };
        console.log("[AdminCourses] Creating course:", courseData);
        await createCourse(courseData);
        toast.success("Course created successfully! ✅");
      }
      setShowModal(false);
      setForm({ title: "", description: "", category: "general", price: 0, maxStudents: 30 });
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
        <button onClick={() => handleOpenModal()} className="btn-primary">
          + Add Course
        </button>
      }
    >
      <div className="space-y-6">
        {/* Stats Cards */}
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
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-surface-hover/30 transition-colors group">
                    <td className="px-6 py-5 font-medium text-white">{course.title}</td>
                    <td className="px-6 py-5">
                      <Badge variant="info">{course.category || "General"}</Badge>
                    </td>
                    <td className="px-6 py-5 text-emerald-400 font-semibold">${course.price || 0}</td>
                    <td className="px-6 py-5 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 text-sm font-bold">
                        {course.teacherCount}
                      </span>
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Course Modal */}
      {showModal && (
        <Modal
          title={editingId ? "Edit Course" : "Add New Course"}
          onClose={() => setShowModal(false)}
        >
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
                <label className="block text-sm font-medium text-slate-300 mb-2">Price ($)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="input-field w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Max Students</label>
              <input
                type="number"
                value={form.maxStudents}
                onChange={(e) => setForm({ ...form, maxStudents: parseInt(e.target.value) })}
                placeholder="30"
                min="1"
                className="input-field w-full"
              />
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
                className="btn-primary flex-1"
              >
                {editingId ? "Update Course" : "Create Course"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  );
}
