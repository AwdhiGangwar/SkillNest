import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { getTeacherRequests, approveTeacherRequest, rejectTeacherRequest } from "../../services/api";
import { EmptyState } from "../../components/ui";
import toast from "react-hot-toast";

export default function TeacherRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await getTeacherRequests();
      setRequests(res.data || []);
    } catch {
      toast.error("Could not load teacher requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleAction = async (id, action) => {
    try {
      if (action === 'approve') await approveTeacherRequest(id);
      else await rejectTeacherRequest(id);
      toast.success(`Teacher request ${action}ed`);
      fetchRequests();
    } catch (err) {
      toast.error(err.message || "Action failed");
    }
  };

  return (
    <Layout title="Teacher Requests" subtitle="Review and verify teacher account applications">
      {loading ? (
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => <div key={i} className="h-20 glass-card animate-pulse" />)}
        </div>
      ) : requests.length === 0 ? (
        <EmptyState icon="📝" title="No pending requests" description="All teacher applications have been processed." />
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-surface-hover/50 text-xs uppercase text-slate-400 font-semibold">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-surface-hover/30 transition-colors">
                  <td className="px-6 py-5">
                    <div className="font-medium text-white">{req.name}</div>
                  </td>
                  <td className="px-6 py-5 text-slate-400 text-sm">{req.email}</td>
                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleAction(req.id, 'reject')}
                        className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500 hover:text-white transition-all"
                      >
                        Reject
                      </button>
                      <button 
                        onClick={() => handleAction(req.id, 'approve')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                      >
                        Approve
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}