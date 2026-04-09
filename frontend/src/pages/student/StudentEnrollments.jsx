import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { CardSkeleton, EmptyState, Badge } from "../../components/ui";
import { getMyCourses } from "../../services/api";
import toast from "react-hot-toast";

export default function StudentEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnrollments = async () => {
    try {
      const res = await getMyCourses();
      setEnrollments(res.data || []);
    } catch (err) {
      toast.error("Failed to load enrolled courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  return (
    <Layout
      title="My Enrollments"
      subtitle={`${enrollments.length} course${enrollments.length !== 1 ? "s" : ""} enrolled`}
    >
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : enrollments.length === 0 ? (
        <EmptyState
          icon="📚"
          title="No enrollments yet"
          description="Explore and enroll in courses to start learning"
          action={
            <a href="/student/browse-courses" className="btn-primary">
              Browse Courses
            </a>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {enrollments.map((course) => (
            <div key={course.id} className="glass-card p-6 rounded-xl border border-surface-border hover:border-brand-400 transition-all">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-display font-bold text-white flex-1">{course.title}</h3>
                <Badge variant="success">Enrolled</Badge>
              </div>
              
              <p className="text-slate-400 text-sm mb-4 line-clamp-2">{course.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-brand-400 font-semibold">${course.price}</span>
                <span className="text-slate-500 text-sm">👨‍🏫 {course.teacherId}</span>
              </div>

              <button
                className="w-full btn-primary py-2 rounded-lg text-sm"
              >
                View Course
              </button>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
