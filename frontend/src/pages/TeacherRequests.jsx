import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { CardSkeleton, EmptyState, Badge } from "../components/ui";
import { getTeacherRequests, approveTeacherRequest, rejectTeacherRequest } from "../services/api";
import toast from "react-hot-toast";

export default function TeacherRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [approvalForm, setApprovalForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const fetchRequests = async () => {
    try {
      const res = await getTeacherRequests();
      setRequests(res.data || []);
    } catch (err) {
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, action) => {
    setProcessingId(id);
    try {
      if (action === "approve") {
        await approveTeacherRequest(id);
        toast.success("Request approved successfully!");
      } else {
        await rejectTeacherRequest(id);
        toast.success("Request rejected.");
      }
      // Update local state without full reload
      setRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (err) {
      toast.error(err.message || `Failed to ${action} request`);
    } finally {
      setProcessingId(null);
    }
  };

  const generatePassword = () => {
    const length = 12;
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setApprovalForm((prev) => ({ ...prev, password, confirmPassword: password }));
  };

  const handleApprovalSubmit = async (e) => {
    e.preventDefault();
    if (!approvalForm.password || !approvalForm.confirmPassword) {
      toast.error("Please fill in password fields");
      return;
    }
    if (approvalForm.password !== approvalForm.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (approvalForm.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setProcessingId(selectedRequest.id);
    try {
      // Create teacher account with email and password
      await approveTeacherRequest(selectedRequest.id, {
        name: selectedRequest.name,
        email: selectedRequest.email,
        password: approvalForm.password,
      });
      
      toast.success("Teacher account created and approved! 🎉");
      setShowApprovalModal(false);
      setApprovalForm({ password: "", confirmPassword: "" });
      setRequests((prev) => prev.filter((req) => req.id !== selectedRequest.id));
      setSelectedRequest(null);
    } catch (err) {
      toast.error(err.message || "Failed to approve and create account");
    } finally {
      setProcessingId(null);
    }
  };

  const openApprovalModal = (request) => {
    setSelectedRequest(request);
    setApprovalForm({ password: "", confirmPassword: "" });
    generatePassword();
    setShowApprovalModal(true);
  };

  const closeApprovalModal = () => {
    setShowApprovalModal(false);
    setSelectedRequest(null);
    setApprovalForm({ password: "", confirmPassword: "" });
  };

  return (
    <Layout
      title="Teacher Requests"
      subtitle={`${requests.length} pending applications`}
    >
      {loading ? (
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : requests.length === 0 ? (
        <EmptyState
          icon="✅"
          title="All caught up!"
          description="There are no pending teacher applications at the moment."
        />
      ) : (
        <div className="grid gap-6">
          {requests.map((req) => (
            <div key={req.id} className="glass-card p-6 animate-fade-in border border-surface-border">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-brand-500/10 flex items-center justify-center text-xl">
                      👤
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-bold text-white">{req.name}</h3>
                      <p className="text-brand-400 text-sm">{req.email}</p>
                    </div>
                    <Badge variant="info" className="ml-auto md:ml-0">Pending</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500 block mb-1">Skills</span>
                      <p className="text-slate-200">{req.skills}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">Experience</span>
                      <p className="text-slate-200">{req.experience}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 block mb-1 text-sm">Bio</span>
                    <p className="text-slate-300 text-sm leading-relaxed italic">
                      "{req.bio}"
                    </p>
                  </div>
                </div>

                <div className="flex md:flex-col gap-3 justify-end shrink-0">
                  <button
                    onClick={() => handleAction(req.id, "reject")}
                    disabled={!!processingId}
                    className="flex-1 px-6 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {processingId === req.id ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Reject"}
                  </button>
                  <button
                    onClick={() => openApprovalModal(req)}
                    disabled={!!processingId}
                    className="flex-1 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {processingId === req.id ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Approve"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-dark rounded-2xl p-8 w-full max-w-md border border-surface-border animate-fade-in">
            <h2 className="text-2xl font-display font-bold text-white mb-2">Create Teacher Account</h2>
            <p className="text-slate-400 mb-6">Set a password for {selectedRequest.name}</p>

            <form onSubmit={handleApprovalSubmit} className="space-y-4">
              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={selectedRequest.email}
                  disabled
                  className="input-field bg-slate-800/50 opacity-60 cursor-not-allowed w-full"
                />
              </div>

              {/* Teacher Name (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Teacher Name
                </label>
                <input
                  type="text"
                  value={selectedRequest.name}
                  disabled
                  className="input-field bg-slate-800/50 opacity-60 cursor-not-allowed w-full"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-300">
                    Temporary Password <span className="text-red-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="text-xs text-brand-400 hover:text-brand-300 font-semibold"
                  >
                    🔄 Generate
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={approvalForm.password}
                    onChange={(e) => setApprovalForm({ ...approvalForm, password: e.target.value })}
                    placeholder="Auto-generated password"
                    className="input-field flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(approvalForm.password);
                      toast.success("Password copied!");
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition-all"
                    title="Copy to clipboard"
                  >
                    📋
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Confirm Password <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  value={approvalForm.confirmPassword}
                  onChange={(e) => setApprovalForm({ ...approvalForm, confirmPassword: e.target.value })}
                  placeholder="Re-enter password"
                  className="input-field w-full"
                />
              </div>

              {/* Info Text */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-xs text-blue-200">
                ℹ️ This password will be sent to the teacher. They can change it after login.
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeApprovalModal}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!!processingId || !approvalForm.password || !approvalForm.confirmPassword}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {processingId ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create & Approve ✅"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}