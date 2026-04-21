import React, { useState, useEffect } from "react";
import { getLessonsByModule } from "../services/api";
import toast from "react-hot-toast";

const ModuleSidebar = ({
  modules,
  selectedModule,
  onSelectModule,
  onSelectLesson,
}) => {
  const [expandedModule, setExpandedModule] = useState(null);
  const [moduleLessons, setModuleLessons] = useState({});

  useEffect(() => {
    if (selectedModule) {
      setExpandedModule(selectedModule.id);
      loadLessons(selectedModule.id);
    }
  }, [selectedModule]);

  const loadLessons = async (moduleId) => {
    try {
      if (moduleLessons[moduleId]) return;

      const res = await getLessonsByModule(moduleId);
      setModuleLessons((prev) => ({
        ...prev,
        [moduleId]: res.data || [],
      }));
    } catch (error) {
      toast.error("Failed to load lessons");
    }
  };

  const handleModuleClick = async (module) => {
    onSelectModule(module);
    setExpandedModule(module.id);
    await loadLessons(module.id);

    // Auto-select first lesson
    if (moduleLessons[module.id] && moduleLessons[module.id].length > 0) {
      onSelectLesson(moduleLessons[module.id][0]);
    }
  };

  const handleLessonClick = (lesson) => {
    onSelectLesson(lesson);
  };

  return (
    <div className="w-72 bg-gray-900 text-white shadow-lg overflow-y-auto">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">📚 Course Content</h2>
      </div>

      <div className="p-2">
        {modules.map((module) => (
          <div key={module.id} className="mb-2">
            {/* Module Header */}
            <button
              onClick={() => handleModuleClick(module)}
              className={`w-full text-left px-4 py-3 rounded-lg transition ${
                selectedModule?.id === module.id
                  ? "bg-blue-600 font-semibold"
                  : "hover:bg-gray-800"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📁</span>
                  <div>
                    <p className="font-semibold">{module.title}</p>
                    <p className="text-xs text-gray-400">{module.description}</p>
                  </div>
                </div>
                <span className={`transition ${expandedModule === module.id ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </div>
            </button>

            {/* Lessons List */}
            {expandedModule === module.id && (
              <div className="ml-4 mt-2 bg-gray-800 rounded-lg p-2">
                {moduleLessons[module.id]?.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => handleLessonClick(lesson)}
                    className="w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-700 mb-1 transition flex items-center gap-2"
                  >
                    <span>🎬</span>
                    <div>
                      <p className="font-medium">{lesson.title}</p>
                      <p className="text-xs text-gray-400">{lesson.duration} min</p>
                    </div>
                  </button>
                )) || (
                  <p className="text-xs text-gray-500 p-2">No lessons yet</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModuleSidebar;
