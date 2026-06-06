import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import { getModulesByCourse, getCourseProgress, markLessonComplete, getCourseById } from "../../services/api";
import Layout from "../../components/Layout";
import ModuleSidebar from "../../components/ModuleSidebar";
import LessonViewer from "../../components/LessonViewer";
import ProgressBar from "../../components/ProgressBar";
import toast from "react-hot-toast";
import { Rocket } from "lucide-react";
const CourseLearning = () => {
  const { user } = useAuth(); // ✅ useAuth se lo
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourseData();
  }, [courseId, user]); // ✅ user dependency add karo

  const loadCourseData = async () => {
    try {
      setLoading(true);
      const courseRes = await getCourseById(courseId);
      setCourse(courseRes.data);

      const modulesRes = await getModulesByCourse(courseId);
      setModules(modulesRes.data || []);

      if (modulesRes.data && modulesRes.data.length > 0) {
        setSelectedModule(modulesRes.data[0]);
      }

      // ✅ useAuth ka user use karo
      if (user) {
        const progressRes = await getCourseProgress(
          user.uid,
          courseId,
          calculateTotalLessons(modulesRes.data)
        );
        setProgress(progressRes.data?.progressPercentage || 0);
      }
    } catch (error) {
      toast.error("Failed to load course: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalLessons = (modulesList) => {
    return modulesList.length * 5;
  };

  const handleLessonComplete = async () => {
    try {
      if (!selectedLesson || !user) return; // ✅ user directly

      await markLessonComplete(user.uid, courseId, selectedLesson.id); // ✅
      toast.success("Lesson marked as completed! " + <Rocket className="inline-block ml-2" />);

      const progressRes = await getCourseProgress(user.uid, courseId, 100); // ✅
      setProgress(progressRes.data?.progressPercentage || 0);
    } catch (error) {
      toast.error("Failed to mark lesson complete: " + error.message);
    }
  };

  if (loading) {
    return (
      <Layout title="Course Content">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={course?.title || "Course Content"}>
      <div className="flex h-screen bg-light-bg dark:bg-surface">
        {/* Sidebar */}
        <ModuleSidebar
          modules={modules}
          selectedModule={selectedModule}
          onSelectModule={setSelectedModule}
          onSelectLesson={setSelectedLesson}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-white dark:bg-surface-card shadow-sm border-b border-light-border dark:border-surface-border">
            <div className="p-6">
              <h1 className="text-3xl font-bold text-light-text dark:text-white">{course?.title}</h1>
              <p className="text-light-text-secondary dark:text-slate-400 mt-2">{course?.description}</p>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-light-text-secondary dark:text-slate-400">Overall Progress</span>
                  <span className="text-sm font-bold text-blue-600">{progress.toFixed(1)}%</span>
                </div>
                <ProgressBar progress={progress} />
              </div>
            </div>
          </div>

          {/* Lesson Viewer */}
          <div className="flex-1 overflow-y-auto p-6">
            {selectedLesson ? (
              <LessonViewer
                lesson={selectedLesson}
                onComplete={handleLessonComplete}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-light-text-secondary dark:text-slate-500">
                  <p className="text-light-text-secondary dark:text-gray-500 text-lg">Select a lesson to start learning</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CourseLearning;