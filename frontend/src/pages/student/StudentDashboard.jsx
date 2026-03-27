// src/pages/student/StudentDashboard.jsx
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
    .slice(0, 3);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
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
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array(4).fill(0).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
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
          </>
        )}
      </div>

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
