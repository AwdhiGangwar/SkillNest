// src/pages/teacher/TeacherCourses.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { CardSkeleton, EmptyState, Modal } from "../../components/ui";
import { getAllCourses, createCourse } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const EMPTY_FORM = { 
  id: "", 
  title: "", 
  description: "", 
  price: "", 
  maxStudents: 30 
};

export default function TeacherCourses() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchCourses = async () => {
    try {
      const res = await getAllCourses();
      const mine = (res.data || []).filter(
        (c) => c.teacherId === profile?.id 
      );
      setCourses(mine);
    } catch (err) {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile?.id) {
      fetchCourses();
    }
  }, [profile]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price) {
      return toast.error("Title and price are required");
    }

    setSaving(true);
    try {
      const maxStudents = Math.min(parseInt(form.maxStudents) || 30, 120);

      const payload = {
        id: form.id || `course_${Date.now()}`,
        title: form.title.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        teacherId: profile?.id,
        maxStudents: maxStudents,
        createdAt: Date.now(),
      };

      const res = await createCourse(payload);
      toast.success("Course created successfully! 🎉");

      setShowModal(false);
      setForm(EMPTY_FORM);
      await fetchCourses();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to create course";
      toast.error(errorMsg);
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
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
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
              Max Students
            </label>
            <input
              type="number"
              name="maxStudents"
              value={form.maxStudents}
              onChange={handleChange}
              min="1"
              max="120"
              className="input-field"
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
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
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
              className="btn-primary flex-1"
            >
              {saving ? "Creating..." : "Create Course"}
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}

function TeacherCourseCard({ course }) {
  const navigate = useNavigate();

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
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-bold text-brand-400">${course.price}</span>
          <span className="text-xs bg-emerald-500/15 text-emerald-400 px-2.5 py-1 rounded-lg font-medium">
            Active
          </span>
        </div>

        <button 
          onClick={() => navigate(`/course-content/${course.id}`)}
          className="w-full py-2 bg-surface-hover hover:bg-brand-500/20 border border-surface-border hover:border-brand-500/50 text-white text-xs font-semibold rounded-lg transition-all"
        >
          Manage Content
        </button>
      </div>
    </div>
  );
}