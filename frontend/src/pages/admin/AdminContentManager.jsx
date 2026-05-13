import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { 
  getModulesByCourse, getLessonsByModule, createModule, createLesson, 
  createAssignment, createClass, getCourseById, reorderModules, reorderLessons,
  getClassesByCourse, deleteModule, deleteLesson, deleteClass,
  getAssignmentsByCourse, getSubmissionsByAssignment
} from "../../services/api";
import Layout from "../../components/Layout";
import { Modal } from "../../components/ui";
import toast from "react-hot-toast";

const AdminContentManager = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [liveClasses, setLiveClasses] = useState([]);
  const [activeTab, setActiveTab] = useState("curriculum");

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const cRes = await getCourseById(courseId);
        setCourse(cRes.data);
        fetchModules();
        fetchLiveClasses();
      } catch (e) { toast.error("Course not found"); }
    };
    loadInitialData();
  }, [courseId]);

  const fetchModules = async () => {
    try {
      const res = await getModulesByCourse(courseId);
      setModules(res.data || []);
    } catch (err) {
      toast.error("Failed to load modules");
    }
  };

  const fetchLiveClasses = async () => {
    try {
      const res = await getClassesByCourse(courseId);
      setLiveClasses(res.data || []);
    } catch (err) { console.error("Classes error", err); }
  };

  const handleSelectModule = async (mod) => {
    setSelectedModule(mod);
    try {
      const res = await getLessonsByModule(mod.id);
      setLessons(res.data || []);
    } catch (err) {
      toast.error("Failed to load lessons");
    }
  };

  const handleDeleteModule = async (id) => {
    if (!window.confirm("Delete module and all its lessons?")) return;
    try {
      await deleteModule(id);
      toast.success("Module deleted");
      fetchModules();
      if (selectedModule?.id === id) setSelectedModule(null);
    } catch (e) { toast.error("Delete failed"); }
  };

  const handleAddModule = async (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    try {
      await createModule({ courseId, title, orderNo: modules.length + 1 });
      toast.success("Module added");
      fetchModules();
      setShowModuleModal(false);
    } catch (err) {
      toast.error("Error creating module");
    }
  };

  const handleReorder = async (type, index, direction) => {
    const items = type === 'module' ? [...modules] : [...lessons];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;
    [items[index], items[newIndex]] = [items[newIndex], items[index]];
    const ids = items.map(i => i.id);
    try {
      if (type === 'module') {
        await reorderModules(courseId, ids);
        setModules(items);
      } else {
        await reorderLessons(selectedModule.id, ids);
        setLessons(items);
      }
      toast.success("Order updated");
    } catch (e) { toast.error("Reorder failed"); }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await createLesson({
        moduleId: selectedModule.id,
        courseId,
        title: formData.get("title"),
        type: formData.get("type"),
        videoUrl: formData.get("url"),
        duration: parseInt(formData.get("duration")) || 0,
      });
      toast.success("Lesson added!");
      handleSelectModule(selectedModule);
    } catch (e) { toast.error("Failed to add lesson"); }
  };

  const handleScheduleClass = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await createClass({
        courseId,
        title: formData.get("title"),
        startTime: formData.get("startTime"),
        meetingLink: formData.get("link"),
        status: "scheduled"
      });
      toast.success("Class scheduled!");
      fetchLiveClasses();
      e.target.reset();
    } catch (e) { toast.error("Failed to schedule class"); }
  };

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await createAssignment({
        courseId,
        title: formData.get("title"),
        description: formData.get("description"),
        dueDate: formData.get("dueDate")
      });
      toast.success("Assignment created!");
      e.target.reset();
    } catch (e) { toast.error("Failed to create assignment"); }
  };

  return (
    <Layout title={course?.title || "Content Manager"} subtitle="Manage Curriculum, Assignments & Live Classes">
      <div className="flex gap-4 mb-8 border-b border-surface-border">
        {["curriculum", "assignments", "classes"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 capitalize font-medium transition-all ${activeTab === tab ? 'text-brand-400 border-b-2 border-brand-400' : 'text-slate-400'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "curriculum" && (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-surface-text">Course Modules</h3>
              <button onClick={() => setShowModuleModal(true)} className="btn-primary py-1 px-3 text-xs">+ Module</button>
            </div>
            <div className="space-y-2">
              {modules.map((m, idx) => (
                <div key={m.id} onClick={() => handleSelectModule(m)} className={`p-4 rounded-xl cursor-pointer border transition-all group ${selectedModule?.id === m.id ? "bg-brand-500/10 border-brand-500" : "bg-surface-card border-surface-border"}`}>
                  <div className="flex justify-between items-center transform hover:scale-[1.01] transition-transform">
                    <span className="text-white font-medium">{m.title}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400">
                      <button onClick={(e) => {e.stopPropagation(); handleReorder('module', idx, 'up')}} className="p-1 hover:text-brand-400">▲</button>
                      <button onClick={(e) => {e.stopPropagation(); handleReorder('module', idx, 'down')}} className="p-1 hover:text-brand-400">▼</button>
                      <button onClick={(e) => {e.stopPropagation(); handleDeleteModule(m.id)}} className="p-1 text-red-400 hover:text-red-300">×</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-8 bg-surface-card rounded-2xl p-6 border border-surface-border">
            {selectedModule ? (
              <div className="space-y-6">
                <div className="flex justify-between border-b border-surface-border pb-4">
                  <h3 className="text-lg font-bold text-surface-text">Lessons in {selectedModule.title}</h3>
                </div>
                <form onSubmit={handleAddLesson} className="grid grid-cols-2 gap-3 bg-surface/30 p-4 rounded-xl">
                  <input name="title" placeholder="Lesson Title" className="input-field text-sm" required />
                  <select name="type" className="input-field text-sm">
                    <option value="VIDEO">Video Lecture</option>
                    <option value="PDF">PDF Resources</option>
                  </select>
                  <input name="url" placeholder="Video URL or PDF Link" className="input-field text-sm" required />
                  <input name="duration" placeholder="Duration (min)" className="input-field text-sm" />
                  <button type="submit" className="col-span-2 btn-primary py-2">Add Lesson</button>
                </form>
                <div className="space-y-2">
                  {lessons.map((l, idx) => (
                    <div key={l.id} className="p-3 bg-surface-hover rounded-lg flex justify-between items-center border border-surface-border group">
                      <div className="flex items-center gap-3 transform hover:scale-[1.01] transition-transform">
                        <span className="text-slate-400 text-xs">{idx + 1}</span>
                        <span className="text-white text-sm">{l.type === 'VIDEO' ? '🎬' : '📄'} {l.title}</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleReorder('lesson', idx, 'up')} className="text-xs text-slate-500 hover:text-white">▲</button>
                        <button onClick={() => handleReorder('lesson', idx, 'down')} className="text-xs text-slate-500 hover:text-white">▼</button>
                        <button onClick={async () => { await deleteLesson(l.id); handleSelectModule(selectedModule); }} className="text-red-400 text-xs hover:underline">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : <div className="text-center py-20 text-slate-500">Select a module to manage its lessons</div>}
          </div>
        </div>
      )}

      {activeTab === "classes" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-6">Schedule Live Session</h3>
            <form onSubmit={handleScheduleClass} className="space-y-4 text-surface-text">
              <input name="title" placeholder="Class Topic" className="input-field w-full" required />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Start Time</label>
                  <input name="startTime" type="datetime-local" className="input-field w-full" required />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Meeting Tool</label>
                  <select className="input-field w-full"><option>Google Meet</option><option>Zoom</option></select>
                </div>
              </div>
              <input name="link" placeholder="Paste Meeting Link Here" className="input-field w-full" required />
              <button type="submit" className="btn-primary w-full py-3">Schedule & Notify Students</button>
            </form>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-surface-text mb-6">Scheduled Classes</h3>
            <div className="space-y-3">
              {liveClasses.map(c => (
                <div key={c.id} className="p-4 bg-surface/30 border border-surface-border rounded-xl flex justify-between items-center text-surface-text transform hover:scale-[1.01] transition-transform">
                  <div>
                    <p className="text-white font-medium">{c.title}</p>
                    <p className="text-xs text-slate-400">{new Date(c.startTime).toLocaleString()}</p>
                  </div>
                  <button onClick={async () => { await deleteClass(c.id); fetchLiveClasses(); }} className="text-red-400 text-sm">Cancel</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "assignments" && (
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-surface-text mb-6">Create New Assignment</h3>
            <form onSubmit={handleAddAssignment} className="space-y-4">
              <input name="title" placeholder="Assignment Title" className="input-field w-full" required />
              <textarea name="description" placeholder="Instructions for students..." rows={4} className="input-field w-full" required />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Due Date</label>
                  <input name="dueDate" type="date" className="input-field w-full" required />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Max Score</label>
                  <input type="number" defaultValue={100} className="input-field w-full" />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full py-3">Publish Assignment</button>
            </form>
          </div>
          <SubmissionsViewer courseId={courseId} />
        </div>
      )}

      <Modal isOpen={showModuleModal} onClose={() => setShowModuleModal(false)} title="New Module">
        <form onSubmit={handleAddModule} className="space-y-4">
          <input name="title" placeholder="e.g., Introduction to React" className="input-field w-full" required />
          <button type="submit" className="btn-primary w-full py-2">Create Module</button>
        </form>
      </Modal>
    </Layout>
  );
};

function SubmissionsViewer({ courseId }) {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewingFile, setViewingFile] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, [courseId]);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await getAssignmentsByCourse(courseId);
      setAssignments(res.data || []);
    } catch (e) {
      toast.error("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async (assignmentId) => {
    if (expanded === assignmentId) {
      setExpanded(null);
      return;
    }
    try {
      const res = await getSubmissionsByAssignment(assignmentId);
      setSubmissions(prev => ({ ...prev, [assignmentId]: res.data || [] }));
      setExpanded(assignmentId);
    } catch (e) {
      toast.error("Failed to load submissions");
    }
  };

  // ✅ PDF viewer URL - Google Docs Viewer use karo
  const getViewerUrl = (fileUrl) => {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
  };

  // ✅ Download URL - fl_attachment flag add karo
  const getDownloadUrl = (fileUrl) => {
    return fileUrl.replace('/raw/upload/', '/raw/upload/fl_attachment/');
  };

  if (loading) return <div className="text-slate-400">Loading assignments...</div>;
  if (assignments.length === 0) return (
    <div className="text-center py-10 bg-surface/10 rounded-2xl border-2 border-dashed border-surface-border">
      <p className="text-slate-500">No assignments created yet.</p>
    </div>
  );

  return (
    <>
      {/* ✅ PDF Viewer Modal */}
      {viewingFile && (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col">
          <div className="flex justify-between items-center p-4 bg-surface-card border-b border-surface-border">
            <p className="text-surface-text font-semibold">{viewingFile.fileName}</p>
            <button
              onClick={() => setViewingFile(null)}
              className="text-slate-400 hover:text-white text-xl px-3"
            >
              ✕ Close
            </button>
          </div>
          <iframe
            src={getViewerUrl(viewingFile.fileUrl)}
            className="flex-1 w-full"
            title="File Viewer"
          />
        </div>
      )}

      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-surface-text mb-6">Student Submissions</h3>
        <div className="space-y-4">
          {assignments.map(assignment => (
            <div key={assignment.id} className="border border-surface-border rounded-xl overflow-hidden">
              <button
                onClick={() => fetchSubmissions(assignment.id)}
                className="w-full p-4 flex justify-between items-center bg-surface-card hover:bg-surface-hover transition-all"
              >
                <div className="text-left text-surface-text">
                  <p className="text-white font-semibold">{assignment.title}</p>
                  <p className="text-xs text-slate-400">Due: {assignment.dueDate}</p>
                </div>
                <span className="text-slate-400 text-sm">
                  {expanded === assignment.id ? "▲ Hide" : "▼ View Submissions"}
                </span>
              </button>

              {expanded === assignment.id && (
                <div className="p-4 space-y-3 bg-surface/30">
                  {!submissions[assignment.id] || submissions[assignment.id].length === 0 ? (
                    <p className="text-slate-500 text-sm">No submissions yet.</p>
                  ) : (
                    submissions[assignment.id].map(sub => (
                      <div key={sub.id} className="flex items-center justify-between p-3 bg-surface-card rounded-lg border border-surface-border">
                        <div className="text-surface-text">
                          <p className="text-white text-sm font-medium">{sub.fileName}</p>
                          <p className="text-xs text-slate-400">
                            Student: {sub.studentId?.slice(0, 8)}... | {sub.submittedAt?.slice(0, 10)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {/* ✅ View - Google Docs Viewer */} {/* bg-slate-700 changed to bg-surface-hover */}
                          <button
                            onClick={() => setViewingFile(sub)}
                            className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg transition-all"
                          >
                            View 👁️
                          </button>
                          {/* ✅ Download - fl_attachment */}
                          <a
                            href={getDownloadUrl(sub.fileUrl)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs bg-brand-500 hover:bg-brand-600 text-white px-3 py-1.5 rounded-lg transition-all"
                          >
                            Download 📥
                          </a>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
export default AdminContentManager;