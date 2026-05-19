// src/pages/teacher/TeacherRequests.jsx
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { CardSkeleton, EmptyState, Badge } from "../components/ui";
import { getTeacherRequests, approveTeacherRequest, rejectTeacherRequest } from "../services/api";
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
      // Remove from list
      setRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (err) {
      toast.error(err.message || `Failed to ${action} request`);
    } finally {
      setProcessingId(null);
    }
  };

  return (
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

              {req.phone && (
                <p className="text-sm mb-2"><strong>Phone:</strong> {req.phone}</p>
              )}
              {req.skills && (
                <p className="text-sm mb-2"><strong>Skills:</strong> {req.skills}</p>
              )}
              {req.experience && (
                <p className="text-sm mb-2"><strong>Experience:</strong> {req.experience}</p>
              )}
              {req.bio && (
                <p className="text-sm text-slate-400 italic">"{req.bio}"</p>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => handleAction(req.id, "approve")}
                  disabled={!!processingId}
                  className="flex-1 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-all disabled:opacity-50"
                >
                  {processingId === req.id ? "Processing..." : "Approve"}
                </button>

                <button
                  onClick={() => handleAction(req.id, "reject")}
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
  );
}