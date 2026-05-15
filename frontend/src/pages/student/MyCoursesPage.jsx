import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { getMyCourses, createSupportTicket } from '../../services/api';
import { Modal, CardSkeleton, EmptyState } from '../../components/ui';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function MyCoursesPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketForm, setTicketForm] = useState({ subject: "", message: "" });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseDetail, setShowCourseDetail] = useState(false);
  const [submittingTicket, setSubmittingTicket] = useState(false);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const res = await getMyCourses();
      setCourses(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load your courses");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    if (!ticketForm.subject.trim() || !ticketForm.message.trim()) {
      return toast.error("Please fill in all fields");
    }
    setSubmittingTicket(true);
    try {
      await createSupportTicket({
        ...ticketForm,
        courseId: selectedCourse?.id,
      });
      toast.success("Support ticket submitted successfully!");
      setTicketForm({ subject: "", message: "" });
      setShowTicketModal(false);
    } catch (err) {
      toast.error(err.message || "Failed to submit ticket");
    } finally {
      setSubmittingTicket(false);
    }
  };

  return (
    <Layout
      title="My Enrolled Courses"
      subtitle={`${courses.length} course${courses.length !== 1 ? "s" : ""} in progress`}
    >
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : courses.length === 0 ? (
        <EmptyState
          icon="📚"
          title="No courses enrolled yet"
          description="Start exploring and enroll in a course to begin your learning journey"
        >
          <button
            onClick={() => navigate("/student/courses")}
            className="btn-primary mt-6"
          >
            Browse Courses →
          </button>
        </EmptyState>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <EnrolledCourseCard
              key={course.id}
              course={course}
              onStartLearning={() => navigate(`/course-learning/${course.id}`)}
              onViewDetails={() => {
                setSelectedCourse(course);
                setShowCourseDetail(true);
              }}
              onRaiseTicket={() => {
                setSelectedCourse(course);
                setShowTicketModal(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Course Detail Modal */}
      <Modal
        isOpen={showCourseDetail}
        onClose={() => setShowCourseDetail(false)}
        title={selectedCourse?.title || "Course Details"}
      >
        {selectedCourse && (
          <div className="space-y-6">
            {/* Header */}
            <div className="w-full h-32 rounded-xl bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-surface-border flex items-center justify-center text-5xl">
              ✓
            </div>

            {/* Course Title & Instructor */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded-lg">
                  Enrolled
                </span>
              </div>
              <h3 className="text-2xl font-display font-bold text-white mb-2">
                {selectedCourse.title}
              </h3>
              {selectedCourse.teacherName && (
                <p className="text-slate-400 text-sm">
                  👨‍🏫 Instructor: <span className="text-white font-semibold">{selectedCourse.teacherName}</span>
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <p className="text-slate-400 text-sm leading-relaxed">
                {selectedCourse.description || "No description provided."}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-surface-hover/50 border border-surface-border">
              <div>
                <div className="text-xs text-slate-400 mb-1 font-semibold">Price</div>
                <div className="text-xl font-bold text-emerald-400">₹{selectedCourse.price}</div>
              </div>
              {selectedCourse.duration && (
                <div>
                  <div className="text-xs text-slate-400 mb-1 font-semibold">Duration</div>
                  <div className="text-xl font-bold text-cyan-400">{selectedCourse.duration}h</div>
                </div>
              )}
              {selectedCourse.totalClasses && (
                <div>
                  <div className="text-xs text-slate-400 mb-1 font-semibold">Classes</div>
                  <div className="text-xl font-bold text-violet-400">{selectedCourse.totalClasses}</div>
                </div>
              )}
              {selectedCourse.level && (
                <div>
                  <div className="text-xs text-slate-400 mb-1 font-semibold">Level</div>
                  <div className="text-xl font-bold text-amber-400">{selectedCourse.level}</div>
                </div>
              )}
            </div>

            {/* Modules */}
            {selectedCourse.modules && (
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">📖 Course Modules</h4>
                <div className="space-y-2">
                  {(typeof selectedCourse.modules === 'string'
                    ? selectedCourse.modules.split(',')
                    : selectedCourse.modules
                  ).map((module, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors"
                    >
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span className="text-slate-300 text-sm">{module.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={() => {
                setShowCourseDetail(false);
                navigate(`/course-learning/${selectedCourse.id}`);
              }}
              className="btn-primary w-full py-3"
            >
              Continue Learning →
            </button>
          </div>
        )}
      </Modal>

      {/* Support Ticket Modal */}
      <Modal
        isOpen={showTicketModal}
        onClose={() => {
          setShowTicketModal(false);
          setTicketForm({ subject: "", message: "" });
        }}
        title={`Support Ticket: ${selectedCourse?.title || "Course"}`}
      >
        <form onSubmit={handleSubmitTicket} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={ticketForm.subject}
              onChange={(e) => setTicketForm(s => ({ ...s, subject: e.target.value }))}
              placeholder="e.g., Technical issue with Module 2"
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Message
            </label>
            <textarea
              value={ticketForm.message}
              onChange={(e) => setTicketForm(s => ({ ...s, message: e.target.value }))}
              placeholder="Describe your issue in detail..."
              rows={5}
              className="input-field w-full resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowTicketModal(false);
                setTicketForm({ subject: "", message: "" });
              }}
              className="flex-1 btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingTicket}
              className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submittingTicket ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Ticket"
              )}
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}

// Enrolled Course Card Component
function EnrolledCourseCard({ course, onStartLearning, onViewDetails, onRaiseTicket }) {
  const progressPercent = Math.floor(Math.random() * 100); // Placeholder - should come from API

  const colors = [
    "from-emerald-500/20 to-teal-500/10",
    "from-cyan-500/20 to-blue-500/10",
    "from-violet-500/20 to-purple-500/10",
    "from-pink-500/20 to-rose-500/10",
  ];
  const colorIdx = course.title?.charCodeAt(0) % colors.length || 0;
  const bgColor = colors[colorIdx];

  return (
    <div className="glass-card overflow-hidden group hover:border-brand-500/30 animate-fade-in transition-all duration-300 flex flex-col h-full">
      {/* Course Header */}
      <div className={`h-28 bg-gradient-to-br ${bgColor} flex items-center justify-center text-4xl relative overflow-hidden`}>
        <div className="absolute inset-0 bg-mesh-gradient opacity-10" />
        <span className="relative">📚</span>
      </div>

      {/* Course Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Title & Status */}
        <div className="mb-3">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-display font-semibold text-white text-base line-clamp-2 group-hover:text-brand-300 transition-colors flex-1">
              {course.title}
            </h3>
            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded whitespace-nowrap">
              Enrolled
            </span>
          </div>
          {course.teacherName && (
            <p className="text-slate-400 text-xs">👨‍🏫 {course.teacherName}</p>
          )}
        </div>

        {/* Description */}
        <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-2 flex-1">
          {course.description || "No description"}
        </p>

        {/* Progress Bar */}
        <div className="mb-4 pb-4 border-b border-surface-border/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300">Progress</span>
            <span className="text-xs text-brand-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-surface-hover rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-xs text-center">
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
            onClick={onStartLearning}
            className="flex-1 bg-brand-500/20 hover:bg-brand-500 text-brand-300 hover:text-white px-3 py-2 rounded-lg font-semibold text-xs transition-all duration-200"
          >
            Learn
          </button>
          <button
            onClick={onViewDetails}
            className="flex-1 bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-white px-3 py-2 rounded-lg font-semibold text-xs transition-all duration-200"
          >
            Details
          </button>
          <button
            onClick={onRaiseTicket}
            className="flex-1 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-white px-3 py-2 rounded-lg font-semibold text-xs transition-all duration-200"
          >
            Support
          </button>
        </div>
      </div>
    </div>
  );
}