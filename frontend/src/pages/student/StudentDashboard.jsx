// src/pages/student/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";
import { getMyCourses, getStudentClasses } from "../../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Ticket,
  LayoutDashboard, // Dashboard
  BookOpen,        // My Course
  Search,          // Browse Course
  TrendingUp,      // My Progress
  GraduationCap,   // Classes
  FileText,        // Assignment
  Clock3,          // Time
  ChartColumn,       // Progress
  CalendarDays,    // Calendar
  Waves,            // Wave
  BarChart,
  CheckCircle
} from "lucide-react";
export default function StudentDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [courseRes, classRes] = await Promise.allSettled([
          getMyCourses(),
          getStudentClasses(),
        ]);

        if (courseRes.status === "fulfilled") setCourses(courseRes.value?.data || []);
        if (classRes.status === "fulfilled") setClasses(classRes.value?.data || []);
      } catch (e) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const completedClasses = classes.filter((c) => c.status === "completed");
  const upcomingClasses = classes
    .filter((c) => c.status === "scheduled")
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
    .slice(0, 3);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <Layout
      title={`${greeting}, ${profile?.name?.split(" ")[0] || "there"}`}
      subtitle="Here's what's happening with your learning"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {loading ? (
          Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="h-32 bg-surface-card rounded-3xl animate-pulse" />
            ))
        ) : (
          <>
            <div className="glass-card p-6 rounded-3xl">
              <div className="text-4xl mb-3"><ChartColumn /></div>
              <div className="text-4xl font-bold text-white">{courses.length}</div>
              <div className="text-slate-400 text-sm mt-1">Enrolled Courses</div>
            </div>

            <div className="glass-card p-6 rounded-3xl">
              <div className="text-4xl mb-3"><CheckCircle /></div>
              <div className="text-4xl font-bold text-emerald-400">{completedClasses.length}</div>
              <div className="text-slate-400 text-sm mt-1">Completed Classes</div>
            </div>

            <div className="glass-card p-6 rounded-3xl">
              <div className="text-4xl mb-3"><CalendarDays /></div>
              <div className="text-4xl font-bold text-amber-400">{upcomingClasses.length}</div>
              <div className="text-slate-400 text-sm mt-1">Upcoming Classes</div>
            </div>

            <div className="glass-card p-6 rounded-3xl">
              <div className="text-4xl mb-3"><Clock3 /></div>
              <div className="text-4xl font-bold text-violet-400">{classes.length}</div>
              <div className="text-slate-400 text-sm mt-1">Total Sessions</div>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Classes */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-3">
              <CalendarDays />
              Upcoming Classes
            </h2>
            <button
              onClick={() => navigate("/student/classes")}
              className="text-orange-400 hover:text-orange-300 text-sm font-medium"
            >
              View All →
            </button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-20 bg-surface-hover rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : upcomingClasses.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              No upcoming classes. Browse courses to get started!
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingClasses.map((cls) => (
                <div
                  key={cls.id}
                  onClick={() => navigate("/student/classes")}
                  className="p-5 bg-surface-hover rounded-2xl hover:bg-surface-card border border-transparent hover:border-orange-500/30 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-orange-400 transition-colors">
                        {cls.title}
                      </h3>
                      <p className="text-sm text-slate-400 mt-1">
                        {cls.startTime ? new Date(cls.startTime).toLocaleString() : "TBD"}
                      </p>
                    </div>
                    <span className="px-3 py-1 text-xs bg-orange-500/10 text-orange-400 rounded-full">
                      Live
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Progress Overview */}
        <div className="glass-card p-6 rounded-3xl">
          <h2 className="text-xl font-semibold text-white mb-6 flex gap-2"><ChartColumn />Progress Overview</h2>

          <div className="space-y-8">
            <div>
              <div className="flex justify-between mb-3">
                <span className="text-slate-400">Overall Completion</span>
                <span className="font-semibold text-white">
                  {classes.length > 0
                    ? Math.round((completedClasses.length / classes.length) * 100)
                    : 0}%
                </span>
              </div>
              <div className="h-2 bg-surface-hover rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-full transition-all"
                  style={{
                    width: `${classes.length > 0
                      ? Math.round((completedClasses.length / classes.length) * 100)
                      : 0}%`,
                  }}
                />
              </div>
            </div>

            <div className="pt-6 border-t border-surface-border grid grid-cols-2 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-emerald-400">{completedClasses.length}</div>
                <div className="text-xs text-slate-400 mt-1">Classes Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber-400">{upcomingClasses.length}</div>
                <div className="text-xs text-slate-400 mt-1">Upcoming</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* My Courses */}
      <div className="glass-card p-6 rounded-3xl mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white flex gap-2"><GraduationCap className="h-8 w-8" /> My Courses</h2>
          <button
            onClick={() => navigate("/student/my-courses")}
            className="text-orange-400 hover:text-orange-300 text-sm font-medium"
          >
            View All →
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-40 bg-surface-hover rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            You haven't enrolled in any courses yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.slice(0, 4).map((course) => (
              <div
                key={course.id}
                onClick={() => navigate(`/course-learning/${course.id}`)}
                className="p-6 bg-surface-hover rounded-3xl hover:border-orange-500/30 border border-transparent transition-all cursor-pointer group"
              >
                <h3 className="font-semibold text-white group-hover:text-orange-400 transition-colors line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-slate-400 mt-2 line-clamp-2">
                  {course.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs px-3 py-1 bg-surface-card rounded-full text-slate-300">
                    {course.level || "Beginner"}
                  </span>
                  <span className="text-orange-400 text-sm group-hover:underline">Continue →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}