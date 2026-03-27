// src/pages/teacher/TeacherCourses.jsx
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { CardSkeleton, EmptyState, Modal } from "../../components/ui";
import { getAllCourses, createCourse } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const EMPTY_FORM = { id: "", title: "", description: "", price: "" };

export default function TeacherCourses() {
  const { profile } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchCourses = async () => {
    try {
      const res = await getAllCourses();
      // Filter only this teacher's courses
      const mine = (res.data || []).filter(
        (c) => c.teacherId === profile?.id || !c.teacherId
      );
      setCourses(mine);
    } catch {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [profile]);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price) return toast.error("Title and price are required");

    setSaving(true);
    try {
      const payload = {
        id: form.id || `course_${Date.now()}`,
        title: form.title.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        teacherId: profile?.id,
        createdAt: Date.now(),
      };
      const res = await createCourse(payload);
      toast.success(typeof res.data === "string" ? res.data : "Course created! 🎉");
      setShowModal(false);
      setForm(EMPTY_FORM);
      await fetchCourses();
    } catch (err) {
      toast.error(err.message || "Failed to create course");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout
      title="My Courses"
      subtitle={`${courses.length} course${courses.length !== 1 ? "s" : ""} created`}
      actions={
        <button onClick={() => setShowModal(true)} className="btn-primary">
          + New Course
        </button>
      }
    >
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : courses.length === 0 ? (
        <EmptyState
          icon="◈"
          title="No courses yet"
          description="Create your first course to start teaching students"
          action={
            <button onClick={() => setShowModal(true)} className="btn-primary">
              Create First Course
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => (
            <TeacherCourseCard key={course.id} course={course} />
          ))}
        </div>
      )}

      {/* Create Course Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setForm(EMPTY_FORM); }}
        title="Create New Course"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Course Title <span className="text-red-400">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Advanced Python Programming"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe what students will learn..."
              rows={3}
              className="input-field resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Price (USD) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="29.99"
                className="input-field pl-8"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => { setShowModal(false); setForm(EMPTY_FORM); }}
              className="btn-ghost flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Course"
              )}
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}

function TeacherCourseCard({ course }) {
  const gradients = [
    "from-brand-500/20 to-cyan-500/10",
    "from-violet-500/20 to-purple-500/10",
    "from-orange-500/20 to-amber-500/10",
    "from-emerald-500/20 to-teal-500/10",
  ];
  const grad = gradients[(course.title?.charCodeAt(0) || 0) % gradients.length];

  return (
    <div className="glass-card overflow-hidden hover:border-brand-500/30 transition-all duration-300 animate-slide-up group">
      <div className={`h-24 bg-gradient-to-br ${grad} flex items-center justify-center text-3xl`}>
        📚
      </div>
      <div className="p-5">
        <h3 className="font-display font-semibold text-white text-base mb-1 line-clamp-1 group-hover:text-brand-300 transition-colors">
          {course.title}
        </h3>
        <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-2">
          {course.description || "No description provided."}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-brand-400">${course.price}</span>
          <span className="text-xs bg-emerald-500/15 text-emerald-400 px-2.5 py-1 rounded-lg font-medium">
            Active
          </span>
        </div>
      </div>
    </div>
  );
}
