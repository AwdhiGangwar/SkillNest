import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getModulesByCourse, getLessonsByModule, getCourseProgress, markLessonComplete, getCourseById } from "../../services/api";
import Layout from "../../components/Layout";
import ModuleSidebar from "../../components/ModuleSidebar";
import LessonViewer from "../../components/LessonViewer";
import ProgressBar from "../../components/ProgressBar";
import toast from "react-hot-toast";

const CourseLearning = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUserId(user?.uid);
    loadCourseData();
  }, [courseId]);

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

      // Load progress
      const user = JSON.parse(localStorage.getItem("user"));
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
    // This will be calculated on backend
    return modulesList.length * 5; // approximate
  };

  const handleLessonComplete = async () => {
    try {
      if (!selectedLesson || !userId) return;

      await markLessonComplete(userId, courseId, selectedLesson.id);
      toast.success("Lesson marked as completed! 🎉");
      
      // Reload progress
      const progressRes = await getCourseProgress(userId, courseId, 100);
      setProgress(progressRes.data?.progressPercentage || 0);
    } catch (error) {
      toast.error("Failed to mark lesson complete: " + error.message);
    }
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

  return (
    <Layout>
      <div className="flex h-screen bg-gray-100 ">
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
          <div className="bg-white shadow-sm border-b">
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-800">{course?.title}</h1>
              <p className="text-gray-600 mt-2">{course?.description}</p>
              
              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
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
                <div className="text-center">
                  <p className="text-gray-500 text-lg">Select a lesson to start learning</p>
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
