// src/pages/student/StudentDashboard.jsx
<<<<<<< HEAD

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
=======
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { StatCard, CardSkeleton, EmptyState, Badge } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import { getMyCourses, getStudentClasses } from "../../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function StudentDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [courseRes, classRes] = await Promise.allSettled([
          getMyCourses(),
          getStudentClasses(),
        ]);
        if (courseRes.status === "fulfilled") setCourses(courseRes.value.data || []);
        if (classRes.status === "fulfilled") setClasses(classRes.value.data || []);
      } catch (e) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const completedClasses = classes.filter((c) => c.status === "completed");
  const upcomingClasses = classes
    .filter((c) => c.status === "scheduled")
    .sort((a, b) => a.startTime - b.startTime)
>>>>>>> ca9e6a8546d45fdcb2d8dbf6b42011e2c1e874cb
    .slice(0, 3);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
<<<<<<< HEAD
    <>
=======
>>>>>>> ca9e6a8546d45fdcb2d8dbf6b42011e2c1e874cb
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
<<<<<<< HEAD
      <div className="mb-4">
        <button onClick={() => setShowTicketModal(true)} className="btn-ghost">Raise Support Ticket</button>
      </div>
=======
>>>>>>> ca9e6a8546d45fdcb2d8dbf6b42011e2c1e874cb
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array(4).fill(0).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
<<<<<<< HEAD
            <StatCard label="Enrolled Courses" value={courses.length} icon="📚" />
            <StatCard label="Completed Classes" value={completedClasses.length} icon="✅" />
            <StatCard label="Upcoming Classes" value={upcomingClasses.length} icon="📅" />
            <StatCard label="Total Classes" value={classes.length} icon="⏱️" />
=======
            <StatCard
              label="Enrolled Courses"
              value={courses.length}
              icon="📚"
              color="brand"
            />
            <StatCard
              label="Completed Classes"
              value={completedClasses.length}
              icon="✅"
              color="emerald"
            />
            <StatCard
              label="Upcoming Classes"
              value={upcomingClasses.length}
              icon="📅"
              color="amber"
            />
            <StatCard
              label="Total Classes"
              value={classes.length}
              icon="◷"
              color="violet"
            />
>>>>>>> ca9e6a8546d45fdcb2d8dbf6b42011e2c1e874cb
          </>
        )}
      </div>

<<<<<<< HEAD
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
              className="p-4 border-b border-surface-border last:border-0 hover:bg-surface-hover cursor-pointer transition-all transform hover:scale-[1.005] rounded-lg group mb-2"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-surface-text group-hover:text-brand-400 transition-colors font-semibold">{course.title}</h3>
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
=======
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Classes */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-white text-lg">
              Upcoming Classes
            </h2>
            <button
              onClick={() => navigate("/student/classes")}
              className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
            >
              View all →
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array(3).fill(0).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : upcomingClasses.length === 0 ? (
            <EmptyState
              icon="📅"
              title="No upcoming classes"
              description="Enroll in a course and book your first class"
              action={
                <button
                  onClick={() => navigate("/student/courses")}
                  className="btn-primary text-sm"
                >
                  Browse Courses
                </button>
              }
            />
          ) : (
            <div className="space-y-3">
              {upcomingClasses.map((cls) => (
                <ClassCard key={cls.id} cls={cls} />
              ))}
            </div>
          )}
        </div>

        {/* My Courses */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-white text-lg">
              My Courses
            </h2>
            <button
              onClick={() => navigate("/student/my-courses")}
              className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
            >
              View all →
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array(3).fill(0).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : courses.length === 0 ? (
            <EmptyState
              icon="◈"
              title="No courses enrolled"
              description="Find a course that interests you and start learning"
            />
          ) : (
            <div className="space-y-3">
              {courses.slice(0, 4).map((course) => (
                <CourseRow key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

function ClassCard({ cls }) {
  const startDate = cls.startTime
    ? new Date(cls.startTime).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : "TBD";
  const startTime = cls.startTime
    ? new Date(cls.startTime).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-hover border border-surface-border hover:border-brand-500/30 transition-all duration-200">
      <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center text-brand-400 font-bold text-sm">
        {startDate.split(" ")[2] || "?"}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-white truncate">
          {cls.title || "Class Session"}
        </div>
        <div className="text-xs text-slate-400">
          {startDate} · {startTime}
        </div>
      </div>
      {cls.meetingLink && (
        <a
          href={cls.meetingLink}
          target="_blank"
          rel="noreferrer"
          className="text-xs bg-brand-500/15 text-brand-400 hover:bg-brand-500/25 px-3 py-1.5 rounded-lg transition-colors font-medium"
        >
          Join
        </a>
      )}
    </div>
  );
}

function CourseRow({ course }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-hover transition-colors">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500/20 to-violet-500/20 flex items-center justify-center text-sm">
        📖
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-white truncate">{course.title}</div>
        <div className="text-xs text-slate-400">{course.description?.slice(0, 40)}...</div>
      </div>
      <div className="text-xs font-semibold text-brand-400">
        ${course.price}
      </div>
    </div>
  );
}
>>>>>>> ca9e6a8546d45fdcb2d8dbf6b42011e2c1e874cb
