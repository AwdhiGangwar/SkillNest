import React, { useState, useEffect } from "react";
import { getCourseProgress, getMyCourses } from "../../services/api";
import Layout from "../../components/Layout";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ProgressDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [courseProgress, setCourseProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      
      // Get enrolled courses
      const coursesRes = await getMyCourses();
      const enrolledCourses = coursesRes.data || [];
      setCourses(enrolledCourses);

      // Get progress for each course
      const progressMap = {};
      for (const course of enrolledCourses) {
        try {
          const progressRes = await getCourseProgress(user.uid, course.id, 50); // approximate total
          progressMap[course.id] = progressRes.data;
        } catch (error) {
          console.error("Error loading progress for course:", error);
          progressMap[course.id] = { progressPercentage: 0, completedLessons: 0 };
        }
      }
      setCourseProgress(progressMap);
    } catch (error) {
      toast.error("Failed to load progress data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage === 0) return "from-gray-400 to-gray-500";
    if (percentage < 25) return "from-red-400 to-red-500";
    if (percentage < 50) return "from-orange-400 to-orange-500";
    if (percentage < 75) return "from-yellow-400 to-yellow-500";
    return "from-green-400 to-green-500";
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </Layout>
    );
  }

  const completedCourses = courses.filter(
    (c) => courseProgress[c.id]?.progressPercentage === 100
  ).length;
  const inProgressCourses = courses.filter(
    (c) => courseProgress[c.id]?.progressPercentage < 100
  ).length;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br  p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-100 mb-2">📊 My Learning Progress</h1>
            <p className="text-gray-600">Track your course completion and achievements</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Courses</p>
                  <p className="text-4xl font-bold text-gray-800">{courses.length}</p>
                </div>
                <span className="text-4xl">📚</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Completed</p>
                  <p className="text-4xl font-bold text-green-600">{completedCourses}</p>
                </div>
                <span className="text-4xl">✅</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">In Progress</p>
                  <p className="text-4xl font-bold text-blue-600">{inProgressCourses}</p>
                </div>
                <span className="text-4xl">⏳</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Avg Progress</p>
                  <p className="text-4xl font-bold text-purple-600">
                    {courses.length > 0
                      ? Math.round(
                          Object.values(courseProgress).reduce((sum, p) => sum + (p?.progressPercentage || 0), 0) /
                            courses.length
                        )
                      : 0}
                    %
                  </p>
                </div>
                <span className="text-4xl">📈</span>
              </div>
            </div>
          </div>

          {/* Courses Progress */}
          <div className="space-y-6">
            {courses.length > 0 ? (
              courses.map((course) => {
                const progress = courseProgress[course.id] || {};
                const percentage = progress.progressPercentage || 0;

                return (
                  <div
                    key={course.id}
                    className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition cursor-pointer"
                    onClick={() => navigate(`/course-learning/${course.id}`)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-800">{course.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{course.description}</p>
                        <div className="flex gap-4 mt-3 text-sm text-gray-500">
                          <span>👨‍🏫 {course.teacherName}</span>
                          <span>📊 {progress.completedLessons || 0} lessons completed</span>
                          {course.level && <span>📈 {course.level}</span>}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${getProgressColor(percentage)}`}>
                          {percentage.toFixed(1)}%
                        </span>
                        <p className="text-gray-500 text-sm mt-1">
                          {percentage === 100 ? "✅ Completed" : "In Progress"}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${getProgressColor(percentage)} transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Course Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-gray-600">Category</p>
                        <p className="font-semibold text-gray-800">{course.category}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-gray-600">Duration</p>
                        <p className="font-semibold text-gray-800">{course.duration} hrs</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-gray-600">Price</p>
                        <p className="font-semibold text-gray-800">${course.price}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-gray-600">Next Lesson</p>
                        <p className="font-semibold text-gray-800">
                          {percentage === 100 ? "Complete!" : "Continue"}
                        </p>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/course-learning/${course.id}`);
                        }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
                      >
                        {percentage === 100 ? "Review Course" : "Continue Learning"}
                      </button>
                      {percentage === 100 && (
                        <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition">
                          🎓 Certificate
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <p className="text-gray-500 text-lg mb-4">No courses enrolled yet</p>
                <button
                  onClick={() => navigate("/student/browse-courses")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                >
                  Browse Courses
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProgressDashboard;
