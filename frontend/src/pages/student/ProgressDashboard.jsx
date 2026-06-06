import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext"; // ✅ Add karo
import { getCourseProgress, getMyCourses } from "../../services/api";
import Layout from "../../components/Layout";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { NotebookTextIcon, Gauge, BadgeCheck, UserCheck } from "lucide-react"; // ✅ Add karo
const ProgressDashboard = () => {
  const { user } = useAuth(); // ✅ useAuth se lo
  const [courses, setCourses] = useState([]);
  const [courseProgress, setCourseProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [user]); // ✅ user dependency

  const loadData = async () => {
    try {
      setLoading(true);

      const coursesRes = await getMyCourses();
      const enrolledCourses = coursesRes.data || [];
      setCourses(enrolledCourses);

      // ✅ user.uid directly use karo
      if (user) {
        const progressMap = {};
        for (const course of enrolledCourses) {
          try {
            const progressRes = await getCourseProgress(user.uid, course.id, 50);
            progressMap[course.id] = progressRes.data;
          } catch (error) {
            progressMap[course.id] = { progressPercentage: 0, completedLessons: 0 };
          }
        }
        setCourseProgress(progressMap);
      }
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
      <Layout title="My Progress">
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
    <Layout title="My Progress"> {/* ✅ title add kiya */}
      <div className="min-h-screen bg-light-bg dark:bg-surface p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-light-text dark:text-white mb-2">📊 My Learning Progress</h1>
            <p className="text-light-text-secondary dark:text-slate-400">Track your course completion and achievements</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white dark:bg-surface-card border-2 border-light-border dark:border-surface-border rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-light-text-secondary text-sm mb-1">Total Courses</p>
                  <p className="text-4xl font-bold text-light-text dark:text-white">{courses.length}</p>
                </div>
                <span className="text-4xl"><NotebookTextIcon /></span>
              </div>
            </div>
            <div className="bg-white dark:bg-surface-card border-2 border-light-border dark:border-surface-border rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-light-text-secondary text-sm mb-1">Completed</p>
                  <p className="text-4xl font-bold text-green-600">{completedCourses}</p>
                </div>
                <span className="text-4xl"><BadgeCheck /></span>
              </div>
            </div>
            <div className="bg-white dark:bg-surface-card border-2 border-light-border dark:border-surface-border rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-light-text-secondary text-sm mb-1">In Progress</p>
                  <p className="text-4xl font-bold text-blue-600">{inProgressCourses}</p>
                </div>
                <span className="text-4xl"><Gauge /></span>
              </div>
            </div>
            <div className="bg-white dark:bg-surface-card border-2 border-light-border dark:border-surface-border rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-light-text-secondary text-sm mb-1">Avg Progress</p>
                  <p className="text-4xl font-bold text-purple-600">
                    {courses.length > 0
                      ? Math.round(
                        Object.values(courseProgress).reduce(
                          (sum, p) => sum + (p?.progressPercentage || 0), 0
                        ) / courses.length
                      )
                      : 0}%
                  </p>
                </div>
                <span className="text-4xl"><Gauge /></span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {courses.length > 0 ? (
              courses.map((course) => {
                const progress = courseProgress[course.id] || {};
                const percentage = progress.progressPercentage || 0;

                return (
                  <div
                    key={course.id}
                    className="bg-white dark:bg-surface-card border-2 border-light-border dark:border-surface-border rounded-lg shadow-lg p-6 hover:shadow-xl transition-all transform hover:scale-[1.01] cursor-pointer"
                    onClick={() => navigate(`/course-learning/${course.id}`)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-light-text dark:text-white">{course.title}</h3>
                        <p className="text-light-text-secondary text-sm mt-1">{course.description}</p>
                        <div className="flex gap-4 mt-3 text-sm text-light-text-secondary dark:text-slate-500">
                          <span><NotebookPen className="inline-block mr-2" /> {course.teacherName}</span>
                          <span><NotebookTextIcon className="inline-block mr-2" /> {progress.completedLessons || 0} lessons completed</span>
                          {course.level && <span><Gauge className="inline-block mr-2" /> {course.level}</span>}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${getProgressColor(percentage)}`}>
                          {percentage.toFixed(1)}%
                        </span>
                        <p className="text-light-text-secondary dark:text-slate-500 text-sm mt-1">
                          {percentage === 100 ? " Completed" : "In Progress"}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="w-full bg-light-border dark:bg-surface-border rounded-full h-4 overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${getProgressColor(percentage)} transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="bg-light-bg-secondary dark:bg-surface-hover p-3 rounded">
                        <p className="text-light-text-secondary">Category</p>
                        <p className="font-semibold text-light-text dark:text-white">{course.category}</p>
                      </div>
                      <div className="bg-light-bg-secondary dark:bg-surface-hover p-3 rounded">
                        <p className="text-light-text-secondary">Duration</p>
                        <p className="font-semibold text-light-text dark:text-white">{course.duration} hrs</p>
                      </div>
                      <div className="bg-light-bg-secondary dark:bg-surface-hover p-3 rounded">
                        <p className="text-light-text-secondary">Price</p>
                        <p className="font-semibold text-light-text dark:text-white">₹{course.price}</p>
                      </div>
                      <div className="bg-light-bg-secondary dark:bg-surface-hover p-3 rounded">
                        <p className="text-light-text-secondary">Next Lesson</p>
                        <p className="font-semibold text-light-text dark:text-white">
                          {percentage === 100 ? "Complete!" : "Continue"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/course-learning/${course.id}`);
                        }}
                        className="flex-1 bg-brand-500 hover:bg-brand-600 text-white py-2 rounded-lg font-semibold transition"
                      >
                        {percentage === 100 ? "Review Course" : "Continue Learning"}
                      </button>
                      {percentage === 100 && (
                        <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-semibold transition">
                          <UserCheck className="inline-block mr-2" /> Certificate
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white dark:bg-surface-card rounded-lg shadow-lg p-12 text-center border-2 border-light-border dark:border-surface-border">
                <p className="text-light-text-secondary dark:text-slate-500 text-lg mb-4">No courses enrolled yet</p>
                <button
                  onClick={() => navigate("/student/courses")}
                  className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-2 rounded-lg"
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