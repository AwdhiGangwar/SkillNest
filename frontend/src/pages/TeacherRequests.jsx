import React, { useEffect, useState } from "react";
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
  const [approvalForm, setApprovalForm] = useState({ password: "", confirmPassword: "" });

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

  const generatePassword = () => {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setApprovalForm({ password, confirmPassword: password });
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

  const handleReject = async (id) => {
    setProcessingId(id);
    try {
      await rejectTeacherRequest(id);
      toast.success("Request rejected.");
      setRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (err) {
      toast.error(err.message || "Failed to reject request");
    } finally {
      setProcessingId(null);
    }
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
      await approveTeacherRequest(selectedRequest.id, {
        name: selectedRequest.name,
        email: selectedRequest.email,
        password: approvalForm.password,
      });
      toast.success("Teacher account created! 🎉");
      closeApprovalModal();
      setRequests((prev) => prev.filter((req) => req.id !== selectedRequest.id));
    } catch (err) {
      toast.error(err.message || "Failed to approve request");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <>
      <Layout title="Teacher Requests" subtitle="Pending approval requests">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array(3).fill(0).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : requests.length === 0 ? (
          <EmptyState
            icon="👥"
            title="No pending requests"
            description="New teacher requests will appear here"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map((req) => (
              <div key={req.id} className="glass-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{req.name}</h3>
                    <p className="text-slate-400 text-sm">{req.email}</p>
                  </div>
                  <Badge color="yellow">Pending</Badge>
                </div>

                {req.phone && <p className="text-sm mb-2"><strong>Phone:</strong> {req.phone}</p>}
                {req.skills && <p className="text-sm mb-2"><strong>Skills:</strong> {req.skills}</p>}
                {req.experience && <p className="text-sm mb-2"><strong>Experience:</strong> {req.experience}</p>}
                {req.bio && <p className="text-sm text-slate-400 italic">"{req.bio}"</p>}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => openApprovalModal(req)}
                    disabled={!!processingId}
                    className="flex-1 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-all disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(req.id)}
                    disabled={!!processingId}
                    className="flex-1 px-6 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-all disabled:opacity-50"
                  >
                    {processingId === req.id ? "Processing..." : "Reject"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Layout>

      {/* ✅ Password Modal */}
      {showApprovalModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-dark rounded-2xl p-8 w-full max-w-md border border-surface-border">
            <h2 className="text-2xl font-bold text-white mb-2">Create Teacher Account</h2>
            <p className="text-slate-400 mb-6">Set a password for {selectedRequest.name}</p>

            <form onSubmit={handleApprovalSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  value={selectedRequest.email}
                  disabled
                  className="input-field w-full opacity-60 cursor-not-allowed"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-300">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="text-xs text-brand-400 hover:text-brand-300"
                  >
                    🔄 Generate
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={approvalForm.password}
                    onChange={(e) => setApprovalForm({ ...approvalForm, password: e.target.value })}
                    className="input-field flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(approvalForm.password);
                      toast.success("Password copied!");
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white"
                  >
                    📋
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Confirm Password <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  value={approvalForm.confirmPassword}
                  onChange={(e) => setApprovalForm({ ...approvalForm, confirmPassword: e.target.value })}
                  className="input-field w-full"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeApprovalModal}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!!processingId}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold disabled:opacity-50"
                >
                  {processingId ? "Creating..." : "Create & Approve ✅"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}