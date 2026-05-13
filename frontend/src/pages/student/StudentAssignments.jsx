import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Layout from "../../components/Layout";
import toast from "react-hot-toast";
import api from "../../services/api";
import { createSubmission } from "../../services/api";

const CLOUD_NAME = "drzjvnmfk";
const UPLOAD_PRESET = "skillnest_assignments";

export default function StudentAssignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [submitted, setSubmitted] = useState({});

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const enrollRes = await api.get("/api/my-courses");
      const courses = enrollRes.data || [];

      const allAssignments = [];
      for (const course of courses) {
        try {
          const res = await api.get(`/api/assignments/course/${course.id}`);
          const courseAssignments = (res.data || []).map(a => ({
            ...a,
            courseName: course.title
          }));
          allAssignments.push(...courseAssignments);
        } catch (e) {}
      }

      setAssignments(allAssignments);

      // ✅ Already submitted check karo
      try {
        const subRes = await api.get("/api/submissions/my");
        const mySubmissions = subRes.data || [];
        const submittedMap = {};
        mySubmissions.forEach(sub => {
          submittedMap[sub.assignmentId] = true;
        });
        setSubmitted(submittedMap);
      } catch (e) {
        console.error("Failed to fetch submissions:", e);
      }

    } catch (err) {
      toast.error("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (assignmentId, file) => {
    if (!file) return;

    // ✅ Already submitted check
    if (submitted[assignmentId]) {
      toast.error("You have already submitted this assignment!");
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF and Word documents allowed!");
      return;
    }

    setUploading(prev => ({ ...prev, [assignmentId]: true }));
    setUploadProgress(prev => ({ ...prev, [assignmentId]: 0 }));

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("public_id",
        `assignments/${assignmentId}/${user.uid}_${Date.now()}`);

      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(prev => ({ ...prev, [assignmentId]: progress }));
        }
      };

      xhr.onload = async () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          const fileUrl = data.secure_url;

          try {
            await createSubmission({
              assignmentId,
              studentId: user.uid,
              fileUrl,
              fileName: file.name,
              submittedAt: new Date().toISOString()
            });

            toast.success("Assignment submitted! ✅");
            setSubmitted(prev => ({ ...prev, [assignmentId]: true }));
          } catch (err) {
            // ✅ Already submitted error handle karo
            if (err.message?.includes("Already submitted")) {
              toast.error("Already submitted!");
              setSubmitted(prev => ({ ...prev, [assignmentId]: true }));
            } else {
              toast.error("Submission failed: " + err.message);
            }
          }
        } else {
          toast.error("Upload failed!");
        }
        setUploading(prev => ({ ...prev, [assignmentId]: false }));
      };

      xhr.onerror = () => {
        toast.error("Upload failed!");
        setUploading(prev => ({ ...prev, [assignmentId]: false }));
      };

      xhr.open("POST",
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`);
      xhr.send(formData);

    } catch (err) {
      toast.error("Submission failed: " + err.message);
      setUploading(prev => ({ ...prev, [assignmentId]: false }));
    }
  };

  return (
    <Layout title="My Assignments" subtitle="Submit your course assignments">
      {loading ? (
        <div className="text-slate-400 text-center py-20">Loading...</div>
      ) : assignments.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">📝</p>
          <p className="text-surface-text font-semibold">No assignments yet</p>
          <p className="text-slate-400 text-sm mt-2">
            Enroll in a course to see assignments
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {assignments.map((assignment) => (
            <div key={assignment.id}
              className="glass-card p-6 border border-surface-border">

              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-surface-text font-bold text-lg">
                    {assignment.title}
                  </h3>
                  <p className="text-brand-400 text-sm">
                    📚 {assignment.courseName}
                  </p>
                </div>
                {assignment.dueDate && (
                  <span className="text-xs bg-red-500/10 text-red-400
                                   px-3 py-1 rounded-full border border-red-500/20">
                    Due: {assignment.dueDate}
                  </span>
                )}
              </div>

              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                {assignment.description}
              </p>

              {/* ✅ Submitted check */}
              {submitted[assignment.id] ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30
                                rounded-xl p-4 text-emerald-400 text-sm font-medium">
                  ✅ Assignment Submitted Successfully!
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="block text-sm text-slate-400 mb-2">
                    Upload your submission (PDF or Word):
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload(
                      assignment.id, e.target.files[0] /* Add transform for hover scale */
                    )}
                    disabled={uploading[assignment.id]}
                    className="text-slate-300 text-sm file:mr-4 file:py-2
                               file:px-4 file:rounded-xl file:border-0
                               file:bg-brand-500 file:text-white
                               file:cursor-pointer hover:file:bg-brand-600"
                  />

                  {uploading[assignment.id] && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Uploading...</span>
                        <span>{uploadProgress[assignment.id]}%</span>
                      </div>
                      <div className="w-full bg-surface-border rounded-full h-2">
                        <div
                          className="bg-brand-500 h-2 rounded-full transition-all"
                          style={{ width: `${uploadProgress[assignment.id]}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}