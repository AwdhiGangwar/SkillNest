// src/pages/student/BrowseCourses.jsx
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { CardSkeleton, EmptyState, Modal } from "../../components/ui";
import { getAllCourses, enrollInCourse } from "../../services/api";
import toast from "react-hot-toast";

export default function BrowseCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [enrolling, setEnrolling] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getAllCourses()
      .then((r) => setCourses(r.data || []))
      .catch(() => toast.error("Failed to load courses"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter(
    (c) =>
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleEnroll = async (course) => {
    setEnrolling(course.id);
    try {
      const res = await enrollInCourse(course.id);
      toast.success(
        typeof res.data === "string" ? res.data : "Enrolled successfully! 🎉"
      );
      setSelected(null);
    } catch (err) {
      toast.error(err.message || "Enrollment failed");
    } finally {
      setEnrolling(null);
    }
  };

  return (
    <Layout
      title="Browse Courses"
      subtitle={`${filtered.length} course${filtered.length !== 1 ? "s" : ""} available`}
    >
      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            ⌕
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="input-field pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="◈"
          title="No courses found"
          description={
            search ? `No results for "${search}"` : "No courses available yet"
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEnroll={() => setSelected(course)}
            />
          ))}
        </div>
      )}

      {/* Course Detail Modal */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Course Details"
      >
        {selected && (
          <div className="space-y-5">
            <div className="w-full h-32 rounded-xl bg-gradient-to-br from-brand-500/20 via-violet-500/10 to-surface-border flex items-center justify-center text-5xl">
              📚
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-white mb-1">
                {selected.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {selected.description || "No description provided."}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-surface-hover">
                <div className="text-xs text-slate-400 mb-1">Price</div>
                <div className="text-lg font-bold text-brand-400">
                  ${selected.price}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-surface-hover">
                <div className="text-xs text-slate-400 mb-1">Teacher</div>
                <div className="text-sm font-semibold text-white truncate">
                  {selected.teacherId || "N/A"}
                </div>
              </div>
            </div>
            <button
              onClick={() => handleEnroll(selected)}
              disabled={enrolling === selected.id}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2"
            >
              {enrolling === selected.id ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Enrolling...
                </>
              ) : (
                "Enroll Now →"
              )}
            </button>
          </div>
        )}
      </Modal>
    </Layout>
  );
}

function CourseCard({ course, onEnroll }) {
  const colors = [
    "from-brand-500/20 to-cyan-500/10",
    "from-violet-500/20 to-purple-500/10",
    "from-orange-500/20 to-amber-500/10",
    "from-emerald-500/20 to-teal-500/10",
  ];
  const color = colors[course.title?.charCodeAt(0) % colors.length] || colors[0];

  return (
    <div className="glass-card overflow-hidden hover:border-brand-500/30 transition-all duration-300 group animate-fade-in">
      <div
        className={`h-24 bg-gradient-to-br ${color} flex items-center justify-center text-3xl`}
      >
        📚
      </div>
      <div className="p-5">
        <h3 className="font-display font-semibold text-white text-base mb-1 line-clamp-1 group-hover:text-brand-300 transition-colors">
          {course.title}
        </h3>
        <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-2">
          {course.description || "No description"}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-brand-400">${course.price}</span>
          <button
            onClick={onEnroll}
            className="text-xs bg-brand-500/15 text-brand-400 hover:bg-brand-500 hover:text-white px-4 py-2 rounded-xl transition-all duration-200 font-semibold"
          >
            Enroll
          </button>
        </div>
      </div>
    </div>
  );
}
