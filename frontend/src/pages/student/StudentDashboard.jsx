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
        if (courseRes.status === "fulfilled")
          setCourses(courseRes.value.data || []);
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
    hour < 12
      ? "Good morning"
      : hour < 17
      ? "Good afternoon"
      : "Good evening";

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
      {/* Statistics */}
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
              icon="⏱️"
              color="violet"
            />
          </>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Upcoming Classes - Larger Section */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold text-lg text-white flex items-center gap-2">
              📅 Upcoming Classes
            </h2>
            <button
              onClick={() => navigate("/student/classes")}
              className="text-xs text-brand-400 hover:text-brand-300 transition-colors font-medium"
            >
              View all →
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array(3).fill(0).map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-surface-hover rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : upcomingClasses.length === 0 ? (
            <EmptyState
              icon="📅"
              title="No upcoming classes"
              description="Book your first class from an enrolled course"
            />
          ) : (
            <div className="space-y-3">
              {upcomingClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="p-4 bg-surface-hover rounded-xl hover:border-brand-500/30 border border-transparent transition-all duration-200 group cursor-pointer"
                  onClick={() => navigate(`/student/classes`)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold group-hover:text-brand-300 transition-colors">
                        {cls.title || "Class"}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        {cls.startTime
                          ? new Date(cls.startTime).toLocaleString()
                          : "Time TBD"}
                      </p>
                    </div>
                    <Badge variant="primary">
                      {cls.status?.charAt(0).toUpperCase() + cls.status?.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Progress Section */}
        <div className="glass-card p-6">
          <h2 className="font-display font-semibold text-lg text-white mb-6 flex items-center gap-2">
            📊 Progress
          </h2>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-300">Completion Rate</span>
                <span className="text-sm font-semibold text-brand-400">
                  {courses.length > 0
                    ? Math.round((completedClasses.length / classes.length) * 100) ||
                      0
                    : 0}
                  %
                </span>
              </div>
              <div className="w-full bg-surface-hover rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-brand-500 to-brand-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      courses.length > 0
                        ? Math.round(
                            (completedClasses.length / classes.length) * 100
                          ) || 0
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-surface-border">
              <p className="text-xs text-slate-400 mb-3">Quick Stats</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Classes Attended</span>
                  <span className="text-white font-semibold">
                    {completedClasses.length}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Pending Classes</span>
                  <span className="text-amber-400 font-semibold">
                    {upcomingClasses.length}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Total Learning</span>
                  <span className="text-brand-400 font-semibold">
                    {classes.length} sessions
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* My Courses Section */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-semibold text-lg text-white flex items-center gap-2">
            📚 My Courses
          </h2>
          <button
            onClick={() => navigate("/student/my-courses")}
            className="text-xs text-brand-400 hover:text-brand-300 transition-colors font-medium"
          >
            View all →
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array(3).fill(0).map((_, i) => (
              <div
                key={i}
                className="h-20 bg-surface-hover rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <EmptyState
            icon="📚"
            title="No courses yet"
            description="Start your learning journey by enrolling in a course"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.slice(0, 6).map((course) => (
              <div
                key={course.id}
                className="p-4 bg-surface-hover rounded-xl hover:border-brand-500/30 border border-transparent transition-all duration-200 group cursor-pointer"
                onClick={() =>
                  navigate(`/course-learning/${course.id}`)
                }
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-white font-semibold text-sm group-hover:text-brand-300 transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <span className="text-xs bg-brand-500/20 text-brand-300 px-2 py-1 rounded-lg whitespace-nowrap ml-2">
                    {course.level || "Beginner"}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-1 mb-3">
                  {course.description}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 w-20 h-1.5 bg-surface-border rounded-full">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
                        style={{ width: "60%" }}
                      />
                    </div>
                    <span className="text-xs text-slate-400">60%</span>
                  </div>
                  <span className="text-xs text-brand-400 group-hover:underline">
                    →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
