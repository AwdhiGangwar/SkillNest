import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { CardSkeleton, EmptyState, Modal } from "../../components/ui";
import { getAllCourses, enrollInCourse, createEnrollmentRequest } from "../../services/api";
import toast from "react-hot-toast";

export default function BrowseCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [enrolling, setEnrolling] = useState(null);
  const [selected, setSelected] = useState(null);
  const [requestingCourse, setRequestingCourse] = useState(null);
  const [requestMessage, setRequestMessage] = useState("");

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
      setCourses(courses.map(c => c.id === course.id ? { ...c, enrolled: true } : c));
      setSelected(null);
    } catch (err) {
      toast.error(err.message || "Enrollment failed");
    } finally {
      setEnrolling(null);
    }
  };

  const handleRequestEnrollment = async () => {
    if (!requestingCourse) return;
    try {
      await createEnrollmentRequest({ 
        courseId: requestingCourse.id, 
        message: requestMessage 
      });
      toast.success("Enrollment request submitted successfully!");
      setRequestingCourse(null);
      setRequestMessage("");
    } catch (err) {
      toast.error(err.message || "Failed to submit request");
    }
  };

  return (
    <Layout
      title="Browse Courses"
      subtitle={`Discover ${filtered.length} amazing course${filtered.length !== 1 ? "s" : ""} available`}
    >
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses by name..."
            className="input-field pl-12 w-full"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="◈"
          title="No courses found"
          description={
            search ? `Try a different search term` : "No courses available yet. Check back soon!"
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onViewDetails={() => setSelected(course)}
              onRequest={() => setRequestingCourse(course)}
            />
          ))}
        </div>
      )}

      {/* Course Detail Modal */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.title || "Course Details"}
      >
        {selected && (
          <div className="space-y-6">
            {/* Header Gradient */}
            <div className="w-full h-32 rounded-xl bg-gradient-to-br from-brand-500/20 via-violet-500/10 to-surface-border flex items-center justify-center text-5xl">
              📚
            </div>

            {/* Course Info */}
            <div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-2xl font-display font-bold text-white mb-2">
                    {selected.title}
                  </h3>
                  {selected.teacherName && (
                    <p className="text-slate-300 text-sm">👨‍🏫 {selected.teacherName}</p>
                  )}
                </div>
                {selected.level && (
                  <span className="px-3 py-1 bg-brand-500/20 text-brand-300 text-xs font-semibold rounded-lg">
                    {selected.level}
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                {selected.description || "No description provided."}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-surface-hover/50 border border-surface-border">
              <div>
                <div className="text-xs text-slate-400 mb-1 font-semibold">Price</div>
                <div className="text-xl font-bold text-brand-400">₹{selected.price || "Free"}</div>
              </div>
              {selected.duration && (
                <div>
                  <div className="text-xs text-slate-400 mb-1 font-semibold">Duration</div>
                  <div className="text-xl font-bold text-cyan-400">{selected.duration}h</div>
                </div>
              )}
              {selected.totalClasses && (
                <div>
                  <div className="text-xs text-slate-400 mb-1 font-semibold">Classes</div>
                  <div className="text-xl font-bold text-violet-400">{selected.totalClasses}</div>
                </div>
              )}
              {selected.maxStudents && (
                <div>
                  <div className="text-xs text-slate-400 mb-1 font-semibold">Capacity</div>
                  <div className="text-xl font-bold text-amber-400">{selected.maxStudents}</div>
                </div>
              )}
            </div>

            {/* Modules Section */}
            {selected.modules && (
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">📖 Course Modules</h4>
                <div className="space-y-2">
                  {(typeof selected.modules === 'string' 
                    ? selected.modules.split(',') 
                    : selected.modules
                  ).map((module, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-3 p-3 rounded-lg bg-surface-hover/30 border border-surface-border/50 hover:border-brand-500/30 transition-colors"
                    >
                      <span className="text-brand-400 font-bold text-sm">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-slate-300 text-sm">{module.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => handleEnroll(selected)}
                disabled={enrolling === selected.id}
                className="flex-1 btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
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
              <button
                onClick={() => {
                  setSelected(null);
                  setRequestingCourse(selected);
                }}
                className="flex-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:text-amber-200 px-4 py-3 rounded-xl font-semibold transition-all duration-200 border border-amber-500/30"
              >
                Request
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Request Enrollment Modal */}
      <Modal
        isOpen={!!requestingCourse}
        onClose={() => {
          setRequestingCourse(null);
          setRequestMessage("");
        }}
        title={`Request Enrollment: ${requestingCourse?.title || ""}`}
      >
        {requestingCourse && (
          <div className="space-y-5">
            <p className="text-slate-400 text-sm">
              Submit a request to enroll in this course. You can include a message for the admin.
            </p>
            <textarea
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              placeholder="Add a message (optional)..."
              rows={4}
              className="input-field w-full resize-none"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setRequestingCourse(null);
                  setRequestMessage("");
                }}
                className="flex-1 btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestEnrollment}
                className="flex-1 btn-primary"
              >
                Send Request
              </button>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
}

// Course Card Component
function CourseCard({ course, onViewDetails, onRequest }) {
  const colors = [
    "from-brand-500/20 to-cyan-500/10",
    "from-violet-500/20 to-purple-500/10",
    "from-orange-500/20 to-amber-500/10",
    "from-emerald-500/20 to-teal-500/10",
    "from-pink-500/20 to-rose-500/10",
  ];
  const colorIdx = course.title?.charCodeAt(0) % colors.length || 0;
  const bgColor = colors[colorIdx];

  return (
    <div className="glass-card overflow-hidden hover:border-brand-500/30 group animate-fade-in transition-all duration-300 flex flex-col h-full">
      {/* Course Image/Icon */}
      <div className={`h-28 bg-gradient-to-br ${bgColor} flex items-center justify-center text-4xl relative overflow-hidden`}>
        <div className="absolute inset-0 bg-mesh-gradient opacity-10" />
        <span className="relative">📚</span>
      </div>

      {/* Course Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-3">
          <h3 className="font-display font-semibold text-white text-base mb-1 line-clamp-2 group-hover:text-brand-300 transition-colors">
            {course.title}
          </h3>
          {course.teacherName && (
            <p className="text-slate-400 text-xs">👨‍🏫 {course.teacherName}</p>
          )}
        </div>

        <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-2 flex-1">
          {course.description || "No description"}
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-t border-b border-surface-border/50 text-center text-xs">
          {course.totalClasses && (
            <div>
              <div className="font-bold text-brand-400">{course.totalClasses}</div>
              <div className="text-slate-400">Classes</div>
            </div>
          )}
          {course.duration && (
            <div>
              <div className="font-bold text-cyan-400">{course.duration}h</div>
              <div className="text-slate-400">Duration</div>
            </div>
          )}
          <div>
            <div className="font-bold text-emerald-400">₹{course.price}</div>
            <div className="text-slate-400">Price</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onViewDetails}
            className="flex-1 bg-brand-500/20 hover:bg-brand-500 text-brand-300 hover:text-white px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-200"
          >
            Details
          </button>
          <button
            onClick={onRequest}
            className="flex-1 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-white px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-200"
          >
            Request
          </button>
        </div>
      </div>
    </div>
  );
}
