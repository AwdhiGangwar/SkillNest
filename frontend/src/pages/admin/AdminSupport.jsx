import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { getSupportTickets } from "../../services/api";
import { CardSkeleton, EmptyState, Badge } from "../../components/ui";
import toast from "react-hot-toast";

export default function AdminSupport() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await getSupportTickets();
        setTickets(res.data || []);
      } catch (err) {
        toast.error("Failed to load support tickets");
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const openCount = tickets.filter((t) => t.status === "open").length;
  const resolvedCount = tickets.filter((t) => t.status === "resolved").length;

  return (
    <Layout
      title="Support Tickets"
      subtitle={`${tickets.length} ticket${tickets.length !== 1 ? "s" : ""} (${openCount} open)`}
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-xl border border-surface-border">
            <p className="text-slate-400 text-sm mb-2">Total Tickets</p>
            <h3 className="text-3xl font-bold text-brand-400">{tickets.length}</h3>
          </div>
          <div className="glass-card p-6 rounded-xl border border-surface-border">
            <p className="text-slate-400 text-sm mb-2">Open Issues</p>
            <h3 className="text-3xl font-bold text-orange-400">{openCount}</h3>
          </div>
          <div className="glass-card p-6 rounded-xl border border-surface-border">
            <p className="text-slate-400 text-sm mb-2">Resolved</p>
            <h3 className="text-3xl font-bold text-emerald-400">{resolvedCount}</h3>
          </div>
        </div>

        {/* Tickets Table */}
        {loading ? (
          <div className="space-y-3">
            {Array(5).fill(0).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : tickets.length === 0 ? (
          <EmptyState icon="🎧" title="No support tickets" description="All issues are resolved" />
        ) : (
          <div className="glass-card overflow-hidden border border-surface-border">
            <table className="w-full text-left">
              <thead className="bg-surface-hover/50 text-xs uppercase text-slate-400 font-semibold">
                <tr>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">From</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-surface-hover/30 transition-colors">
                    <td className="px-6 py-5 font-medium text-white">{ticket.subject}</td>
                    <td className="px-6 py-5 text-slate-400">{ticket.userEmail || "Unknown"}</td>
                    <td className="px-6 py-5 text-slate-500 text-sm">{ticket.createdAt || "N/A"}</td>
                    <td className="px-6 py-5">
                      <Badge variant={ticket.status === "open" ? "warn" : "success"}>
                        {ticket.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
