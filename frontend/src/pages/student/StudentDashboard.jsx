// src/pages/student/StudentDashboard.jsx

import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { StatCard, CardSkeleton, EmptyState } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// ✅ IMPORTANT: use API functions instead of axios
import { getMyCourses } from "../../services/api";

export default function StudentDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

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
            <div key={course.id} className="p-3 border-b">
              <h3 className="text-white">{course.title}</h3>
              <p className="text-gray-400 text-sm">{course.description}</p>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}