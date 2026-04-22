// src/pages/student/StudentDashboard.jsx

import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { StatCard, CardSkeleton, EmptyState, Modal } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// ✅ IMPORTANT: use API functions instead of axios
import { getMyCourses } from "../../services/api";
import { createSupportTicket } from "../../services/api";

export default function StudentDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketForm, setTicketForm] = useState({ subject: "", message: "" });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // ✅ FIXED API CALL
      const coursesRes = await getMyCourses();

      setCourses(coursesRes.data || []);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const completedClasses = classes.filter((c) => c.status === "completed");
  const upcomingClasses = classes
    .filter((c) => c.status === "scheduled")
    .slice(0, 3);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <>
    <Layout
      title={`${greeting}, ${profile?.name?.split(" ")[0] || "there"} 👋`}
      subtitle="Here's an overview of your learning journey"
      actions={
        <button
          onClick={() => navigate("/student/courses")}
          className="btn-primary"
        >
          Browse Courses
        </button>
      }
    >
      <div className="mb-4">
        <button onClick={() => setShowTicketModal(true)} className="btn-ghost">Raise Support Ticket</button>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array(4).fill(0).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            <StatCard label="Enrolled Courses" value={courses.length} icon="📚" />
            <StatCard label="Completed Classes" value={completedClasses.length} icon="✅" />
            <StatCard label="Upcoming Classes" value={upcomingClasses.length} icon="📅" />
            <StatCard label="Total Classes" value={classes.length} icon="⏱️" />
          </>
        )}
      </div>

      {/* My Courses */}
      <div className="glass-card p-6">
        <h2 className="text-lg text-white mb-4">My Courses</h2>

        {loading ? (
          <CardSkeleton />
        ) : courses.length === 0 ? (
          <EmptyState
            title="No courses yet"
            description="Start learning by enrolling in a course"
          />
        ) : (
          courses.map((course) => (
            <div 
              key={course.id} 
              onClick={() => navigate(`/course-learning/${course.id}`)}
              className="p-4 border-b border-surface-border last:border-0 hover:bg-surface-hover cursor-pointer transition-all rounded-lg group mb-2"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-white group-hover:text-brand-400 transition-colors font-semibold">{course.title}</h3>
                <span className="text-xs text-brand-400 font-medium group-hover:underline">Resume Learning →</span>
              </div>
              <p className="text-slate-400 text-sm line-clamp-1 mt-1">
                {course.description}
              </p>
            </div>
          ))
        )}
      </div>
    </Layout>
    <Modal isOpen={showTicketModal} onClose={() => setShowTicketModal(false)} title="Raise Support Ticket">
      <form onSubmit={async (e) => {
        e.preventDefault();
        if (!ticketForm.subject || !ticketForm.message) return toast.error("Fill subject and message");
        try {
          await createSupportTicket(ticketForm);
          toast.success("Ticket submitted");
          setTicketForm({ subject: "", message: "" });
          setShowTicketModal(false);
        } catch (err) {
          toast.error("Failed to submit ticket");
        }
      }} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
          <input value={ticketForm.subject} onChange={(e) => setTicketForm(s => ({...s, subject: e.target.value}))} className="input-field w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
          <textarea value={ticketForm.message} onChange={(e) => setTicketForm(s => ({...s, message: e.target.value}))} rows={5} className="input-field w-full resize-none" />
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => setShowTicketModal(false)} className="btn-ghost flex-1">Cancel</button>
          <button type="submit" className="btn-primary flex-1">Submit Ticket</button>
        </div>
      </form>
    </Modal>
    </>
  );
}