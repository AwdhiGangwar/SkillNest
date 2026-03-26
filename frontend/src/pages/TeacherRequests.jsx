import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { CardSkeleton, EmptyState, Badge } from "../../components/ui";
import { getTeacherRequests, approveTeacherRequest, rejectTeacherRequest } from "../../services/api";
import toast from "react-hot-toast";

export default function TeacherRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

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
                    onClick={() => handleAction(req.id, "approve")}
                    disabled={!!processingId}
                    className="flex-1 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {processingId === req.id ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Approve"}
                  </button>
                  <button
                    onClick={() => handleAction(req.id, "reject")}
                    disabled={!!processingId}
                    className="flex-1 px-6 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {processingId === req.id ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Reject"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}