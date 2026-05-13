<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllCourses, enrollInCourse, createEnrollmentRequest } from '../../services/api';
import toast from 'react-hot-toast';

const BrowseCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);
  const { user } = useAuth();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestCourse, setRequestCourse] = useState(null);
  const [requestMessage, setRequestMessage] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await getAllCourses(); // ✅ use api.js
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses", err);
      alert("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId, title) => {
    if (!window.confirm(`Enroll in "${title}" ?`)) return;

    setEnrollingId(courseId);

    try {
      await enrollInCourse(courseId); // ✅ gateway + token handled
      toast.success('✅ Enrollment Successful!');
      fetchCourses();
    } catch (err) {
      toast.error(err.message || 'Enrollment failed');
    } finally {
      setEnrollingId(null);
    }
  };

  const handleOpenDetailModal = (course) => {
    setSelectedCourse(course);
    setShowDetailModal(true);
  };

  if (loading) return <div className="text-center py-10">Loading courses...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-surface-text">Available Courses</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            onClick={() => handleOpenDetailModal(course)}
            className="bg-surface-card border border-surface-border rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-[1.02] flex flex-col"
          >
            {course.imageUrl && (
              <img
                src={course.imageUrl}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
            )}

            <div className="p-5 flex flex-col flex-1">
              <div className="mb-2">
                <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                  {course.level || 'Beginner'}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-surface-text">{course.title}</h3>
              
              {course.teacherName && (
                <p className="text-sm text-purple-600 font-medium mb-2">
                  👨‍🏫 {course.teacherName}
                </p>
              )}

              <p className="text-gray-600 text-sm line-clamp-2 mb-3 flex-1">
                {course.description}
              </p>

              {course.modules && (
                <div className="mb-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Modules</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(typeof course.modules === 'string' ? course.modules.split(',') : course.modules)
                      .slice(0, 3)
                      .map((module, idx) => (
                        <span key={idx} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100 truncate max-w-[100px]">
                          {module.trim()}
                        </span>
                      ))}
                    {(typeof course.modules === 'string' ? course.modules.split(',') : course.modules).length > 3 && (
                      <span className="text-[10px] text-slate-400 font-medium">+ more</span>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 text-xs text-blue-600 mb-4 py-3 border-y">
                {course.totalClasses && (
                  <div className="text-center">
                    <span className="block font-semibold text-surface-text">{course.totalClasses}</span>
                    <span className="text-xs">Classes</span>
                  </div>
                )}
                {course.duration && (
                  <div className="text-center">
                    <span className="block font-semibold text-surface-text">{course.duration}h</span>
                    <span className="text-xs">Duration</span>
                  </div>
                )}
                <div className="text-center">
                  <span className="block font-semibold text-emerald-500 font-bold text-sm">₹{course.price}</span>
                  <span className="text-xs">Price</span>
                </div>
              </div>

              <div className="flex gap-2">
               
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setRequestCourse(course);
                    setShowRequestModal(true);
                  }}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-xl font-medium transition text-sm"
                >
                  Request
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <p className="text-center text-slate-500 mt-10">
          No courses available at the moment.
        </p>
      )}

      {/* Request Enrollment Modal */}
      {showRequestModal && requestCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowRequestModal(false)} />
          <div className="bg-surface-card rounded-xl p-6 z-10 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-3">Request Enrollment: {requestCourse.title}</h3>
            <p className="text-sm text-gray-600 mb-4">You can add an optional message for the admin.</p>
            <textarea value={requestMessage} onChange={(e) => setRequestMessage(e.target.value)} className="w-full input-field mb-4" rows={4} />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowRequestModal(false)} className="btn-ghost">Cancel</button>
              <button
                onClick={async () => {
                  try {
                    await createEnrollmentRequest({ courseId: requestCourse.id, message: requestMessage });
                    toast.success('Request submitted');
                    setShowRequestModal(false);
                    setRequestMessage("");
                  } catch (err) {
                    toast.error(err.message || 'Failed to submit request');
                  }
                }}
                className="btn-primary"
              >Send Request</button>
            </div>
          </div>
=======
// src/pages/student/BrowseCourses.jsx
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { CardSkeleton, EmptyState, Modal } from "../../components/ui";
import { getAllCourses, enrollInCourse } from "../../services/api";
import toast from "react-hot-toast";

export default function BrowseCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [enrolling, setEnrolling] = useState(null);
  const [selected, setSelected] = useState(null);

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
      setSelected(null);
    } catch (err) {
      toast.error(err.message || "Enrollment failed");
    } finally {
      setEnrolling(null);
    }
  };

  return (
    <Layout
      title="Browse Courses"
      subtitle={`${filtered.length} course${filtered.length !== 1 ? "s" : ""} available`}
    >
      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            ⌕
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="input-field pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="◈"
          title="No courses found"
          description={
            search ? `No results for "${search}"` : "No courses available yet"
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEnroll={() => setSelected(course)}
            />
          ))}
>>>>>>> ca9e6a8546d45fdcb2d8dbf6b42011e2c1e874cb
        </div>
      )}

      {/* Course Detail Modal */}
<<<<<<< HEAD
      {showDetailModal && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDetailModal(false)} />
          <div className="bg-surface-card rounded-2xl z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedCourse.imageUrl && (
              <img
                src={selectedCourse.imageUrl}
                alt={selectedCourse.title}
                className="w-full h-64 object-cover"
              />
            )}
            
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="mb-2">
                    <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded">
                      {selectedCourse.level || 'Beginner'} • {selectedCourse.category || 'General'}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-surface-text mb-2">{selectedCourse.title}</h2>
                  {selectedCourse.teacherName && (
                    <p className="text-lg text-surface-text font-semibold">
                      👨‍🏫 Instructor: {selectedCourse.teacherName}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Course Description</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedCourse.description}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pb-8 border-b">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Price</p>
                  <p className="text-2xl font-bold text-green-600">₹{selectedCourse.price}</p>
                </div>
                {selectedCourse.duration && (
                  <div>
                    <p className="text-black text-sm mb-1">Duration</p>
                    <p className="text-2xl font-bold text-black">{selectedCourse.duration}</p>
                  </div>
                )}
                {selectedCourse.totalClasses && (
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Total Classes</p>
                    <p className="text-2xl font-bold text-blue-600">{selectedCourse.totalClasses}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-600 text-sm mb-1">Max Students</p>
                  <p className="text-2xl font-bold text-amber-600">{selectedCourse.maxStudents || 'Unlimited'}</p>
                </div>
              </div>

              {selectedCourse.modules && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">📚 Course Modules</h3>
                  <div className="space-y-2">
                    {(typeof selectedCourse.modules === 'string' ? selectedCourse.modules.split(',') : selectedCourse.modules)
                      .map((module, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <span className="text-blue-600 font-bold">{idx + 1}.</span>
                          <span className="text-gray-700">{module.trim()}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setRequestCourse(selectedCourse);
                    setShowRequestModal(true);
                  }}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold transition"
                >
                  Request Enrollment
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 px-6 py-3 rounded-xl font-semibold transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseCourses;
=======
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Course Details"
      >
        {selected && (
          <div className="space-y-5">
            <div className="w-full h-32 rounded-xl bg-gradient-to-br from-brand-500/20 via-violet-500/10 to-surface-border flex items-center justify-center text-5xl">
              📚
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-white mb-1">
                {selected.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {selected.description || "No description provided."}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-surface-hover">
                <div className="text-xs text-slate-400 mb-1">Price</div>
                <div className="text-lg font-bold text-brand-400">
                  ${selected.price}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-surface-hover">
                <div className="text-xs text-slate-400 mb-1">Teacher</div>
                <div className="text-sm font-semibold text-white truncate">
                  {selected.teacherId || "N/A"}
                </div>
              </div>
            </div>
            <button
              onClick={() => handleEnroll(selected)}
              disabled={enrolling === selected.id}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2"
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
          </div>
        )}
      </Modal>
    </Layout>
  );
}

function CourseCard({ course, onEnroll }) {
  const colors = [
    "from-brand-500/20 to-cyan-500/10",
    "from-violet-500/20 to-purple-500/10",
    "from-orange-500/20 to-amber-500/10",
    "from-emerald-500/20 to-teal-500/10",
  ];
  const color = colors[course.title?.charCodeAt(0) % colors.length] || colors[0];

  return (
    <div className="glass-card overflow-hidden hover:border-brand-500/30 transition-all duration-300 group animate-fade-in">
      <div
        className={`h-24 bg-gradient-to-br ${color} flex items-center justify-center text-3xl`}
      >
        📚
      </div>
      <div className="p-5">
        <h3 className="font-display font-semibold text-white text-base mb-1 line-clamp-1 group-hover:text-brand-300 transition-colors">
          {course.title}
        </h3>
        <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-2">
          {course.description || "No description"}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-brand-400">${course.price}</span>
          <button
            onClick={onEnroll}
            className="text-xs bg-brand-500/15 text-brand-400 hover:bg-brand-500 hover:text-white px-4 py-2 rounded-xl transition-all duration-200 font-semibold"
          >
            Enroll
          </button>
        </div>
      </div>
    </div>
  );
}
>>>>>>> ca9e6a8546d45fdcb2d8dbf6b42011e2c1e874cb
