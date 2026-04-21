import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getModulesByCourse,
  getLessonsByModule,
  createModule,
  updateModule,
  deleteModule,
  createLesson,
  updateLesson,
  deleteLesson,
  getCourseById,
  getQuizzesByLesson,
  getAssignmentsByLesson,
  createQuiz,
  deleteQuiz,
  createAssignment,
  deleteAssignment,
} from "../../services/api";
import Layout from "../../components/Layout";
import toast from "react-hot-toast";

const AdminContentManager = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);

  // Form states
  const [moduleForm, setModuleForm] = useState({ title: "", description: "" });
  const [lessonForm, setLessonForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    notesPdfUrl: "",
    duration: 0,
  });
  const [quizForm, setQuizForm] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
  });
  const [assignmentForm, setAssignmentForm] = useState({
    title: "",
    description: "",
    attachmentUrl: "",
  });

  useEffect(() => {
    loadCourseData();
  }, [courseId]);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      const courseRes = await getCourseById(courseId);
      setCourse(courseRes.data);

      const modulesRes = await getModulesByCourse(courseId);
      setModules(modulesRes.data || []);
    } catch (error) {
      toast.error("Failed to load course: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadLessons = async (moduleId) => {
    try {
      const lessonsRes = await getLessonsByModule(moduleId);
      setLessons(lessonsRes.data || []);
    } catch (error) {
      toast.error("Failed to load lessons: " + error.message);
    }
  };

  const handleModuleClick = (module) => {
    setSelectedModule(module);
    loadLessons(module.id);
  };

  const handleCreateModule = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...moduleForm,
        courseId,
        orderNo: modules.length + 1,
      };
      await createModule(payload);
      toast.success("Module created successfully!");
      setModuleForm({ title: "", description: "" });
      setShowModuleForm(false);
      loadCourseData();
    } catch (error) {
      toast.error("Failed to create module: " + error.message);
    }
  };

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...lessonForm,
        moduleId: selectedModule.id,
        orderNo: lessons.length + 1,
      };
      await createLesson(payload);
      toast.success("Lesson created successfully!");
      setLessonForm({
        title: "",
        description: "",
        videoUrl: "",
        notesPdfUrl: "",
        duration: 0,
      });
      setShowLessonForm(false);
      loadLessons(selectedModule.id);
    } catch (error) {
      toast.error("Failed to create lesson: " + error.message);
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (window.confirm("Are you sure you want to delete this module?")) {
      try {
        await deleteModule(moduleId);
        toast.success("Module deleted!");
        loadCourseData();
      } catch (error) {
        toast.error("Failed to delete module: " + error.message);
      }
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      try {
        await deleteLesson(lessonId);
        toast.success("Lesson deleted!");
        loadLessons(selectedModule.id);
      } catch (error) {
        toast.error("Failed to delete lesson: " + error.message);
      }
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
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Content Manager</h1>
            <p className="text-gray-600">{course?.title}</p>
            <p className="text-gray-500 text-sm mt-2">Manage your course modules and lessons</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Modules List Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Modules</h2>
                  <button
                    onClick={() => setShowModuleForm(!showModuleForm)}
                    className="text-2xl text-blue-600 hover:text-blue-700"
                  >
                    +
                  </button>
                </div>

                {/* Module Form */}
                {showModuleForm && (
                  <form onSubmit={handleCreateModule} className="mb-4 p-4 bg-blue-50 rounded-lg">
                    <input
                      type="text"
                      placeholder="Module Title"
                      value={moduleForm.title}
                      onChange={(e) =>
                        setModuleForm({ ...moduleForm, title: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded mb-2"
                      required
                    />
                    <textarea
                      placeholder="Description"
                      value={moduleForm.description}
                      onChange={(e) =>
                        setModuleForm({ ...moduleForm, description: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded mb-2 text-sm"
                    />
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm"
                    >
                      Create Module
                    </button>
                  </form>
                )}

                {/* Modules List */}
                <div className="space-y-2">
                  {modules.map((module) => (
                    <div
                      key={module.id}
                      className={`p-3 rounded-lg cursor-pointer transition ${
                        selectedModule?.id === module.id
                          ? "bg-blue-100 border-2 border-blue-600"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                      onClick={() => handleModuleClick(module)}
                    >
                      <p className="font-semibold text-gray-800">{module.title}</p>
                      <p className="text-xs text-gray-600">{module.description}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteModule(module.id);
                        }}
                        className="text-xs text-red-600 hover:underline mt-2"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content - Lessons */}
            <div className="lg:col-span-3">
              {selectedModule ? (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {selectedModule.title} - Lessons
                    </h2>
                    <button
                      onClick={() => setShowLessonForm(!showLessonForm)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                      + Add Lesson
                    </button>
                  </div>

                  {/* Lesson Form */}
                  {showLessonForm && (
                    <form onSubmit={handleCreateLesson} className="mb-6 p-4 bg-blue-50 rounded-lg">
                      <input
                        type="text"
                        placeholder="Lesson Title"
                        value={lessonForm.title}
                        onChange={(e) =>
                          setLessonForm({ ...lessonForm, title: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded mb-2"
                        required
                      />
                      <textarea
                        placeholder="Description"
                        value={lessonForm.description}
                        onChange={(e) =>
                          setLessonForm({ ...lessonForm, description: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded mb-2"
                      />
                      <input
                        type="url"
                        placeholder="Video URL (YouTube embed)"
                        value={lessonForm.videoUrl}
                        onChange={(e) =>
                          setLessonForm({ ...lessonForm, videoUrl: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded mb-2"
                      />
                      <input
                        type="url"
                        placeholder="Notes PDF URL"
                        value={lessonForm.notesPdfUrl}
                        onChange={(e) =>
                          setLessonForm({ ...lessonForm, notesPdfUrl: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded mb-2"
                      />
                      <input
                        type="number"
                        placeholder="Duration (minutes)"
                        value={lessonForm.duration}
                        onChange={(e) =>
                          setLessonForm({
                            ...lessonForm,
                            duration: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border rounded mb-2"
                        required
                      />
                      <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                      >
                        Create Lesson
                      </button>
                    </form>
                  )}

                  {/* Lessons List */}
                  <div className="space-y-4">
                    {lessons.length > 0 ? (
                      lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="border border-gray-300 rounded-lg p-4 hover:shadow-lg transition"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-bold text-gray-800">{lesson.title}</h3>
                              <p className="text-sm text-gray-600">{lesson.description}</p>
                            </div>
                            <button
                              onClick={() => handleDeleteLesson(lesson.id)}
                              className="text-red-600 hover:text-red-700 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                          <div className="flex gap-4 text-xs text-gray-500">
                            <span>⏱️ {lesson.duration} min</span>
                            {lesson.videoUrl && <span>🎬 Has Video</span>}
                            {lesson.notesPdfUrl && <span>📄 Has Notes</span>}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">No lessons yet</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <p className="text-gray-500 text-lg">Select a module to manage lessons</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminContentManager;
