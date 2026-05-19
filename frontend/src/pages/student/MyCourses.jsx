// src/pages/student/MyCourses.jsx
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { CardSkeleton, EmptyState } from "../../components/ui";
import { getMyCourses } from "../../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getMyCourses()
      .then((r) => setCourses(r.data || []))
      .catch(() => toast.error("Failed to load your courses"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout
      title="My Courses"
      subtitle={`You are enrolled in ${courses.length} course${courses.length !== 1 ? "s" : ""}`}
      actions={
        <button onClick={() => navigate("/student/courses")} className="btn-primary">
          + Enroll in Course
        </button>
      }
    >
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : courses.length === 0 ? (
        <EmptyState
          icon="📚"
          title="No courses yet"
          description="Browse available courses and enroll to start learning"
          action={
            <button onClick={() => navigate("/student/courses")} className="btn-primary">
              Browse Courses
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course, i) => (
            <EnrolledCourseCard key={course.id || i} course={course} />
          ))}
        </div>
      )}
    </Layout>
  );
}

function EnrolledCourseCard({ course }) {
  const gradients = [
    "from-brand-500/20 to-cyan-500/10",
    "from-violet-500/20 to-purple-500/10",
    "from-orange-500/20 to-amber-500/10",
    "from-emerald-500/20 to-teal-500/10",
  ];
  const grad = gradients[(course.title?.charCodeAt(0) || 0) % gradients.length];

  return (
    <div className="glass-card overflow-hidden hover:border-brand-500/30 transition-all duration-300 animate-slide-up group">
      <div className={`h-28 bg-gradient-to-br ${grad} flex items-center justify-center text-4xl`}>
        📖
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display font-semibold text-white text-base line-clamp-1 group-hover:text-brand-300 transition-colors">
            {course.title}
          </h3>
          <span className="text-xs bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-lg font-medium shrink-0">
            Enrolled
          </span>
        </div>
        <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-2">
          {course.description || "No description provided."}
        </p>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Teacher: {course.teacherId?.slice(0, 10) || "N/A"}</span>
          <span className="font-semibold text-brand-400">${course.price}</span>
        </div>
      </div>
    </div>
  );
}
