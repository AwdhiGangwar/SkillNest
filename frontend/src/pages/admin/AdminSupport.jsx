import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { getSupportTickets, updateSupportTicket, deleteSupportTicket } from "../../services/api";
import { CardSkeleton, EmptyState, Badge, Modal } from "../../components/ui";
import toast from "react-hot-toast";

export default function AdminSupport() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showResolvedOnly, setShowResolvedOnly] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

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

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await getSupportTickets();
      setTickets(res.data || []);
    } catch (e) {
      toast.error("Failed to refresh tickets");
    } finally { setLoading(false); }
  };

  const handleResolve = async (id) => {
    try {
      await updateSupportTicket(id, { status: "resolved" });
      toast.success("Ticket marked resolved");
      await refresh();
    } catch (e) {
      toast.error("Failed to update ticket");
    }
  };

  const openCount = tickets.filter((t) => t.status === "open").length;
  const resolvedCount = tickets.filter((t) => t.status === "resolved").length;

  return (
    <>
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

        <div className="flex items-center justify-between mb-4">
          <div />
          <div className="flex items-center gap-3">
            <button onClick={() => { setShowResolvedOnly(s => !s); }} className="btn-ghost text-sm">
              {showResolvedOnly ? 'Show All' : 'Show Resolved'}
            </button>
            <button onClick={refresh} className="btn-ghost text-sm">Refresh</button>
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
                  <th className="px-6 py-4 w-44">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {tickets.filter(t => showResolvedOnly ? t.status === 'resolved' : true).map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-surface-hover/30 transition-colors">
                    <td className="px-6 py-5 font-medium text-white">{ticket.subject}</td>
                    <td className="px-6 py-5 text-slate-400">
                      {ticket.raiser?.name ? (
                        <div>
                          <div className="font-medium text-white">{ticket.raiser.name}</div>
                          <div className="text-xs text-slate-400">{ticket.raiser.email || ticket.userEmail}</div>
                        </div>
                      ) : (
                        (ticket.userEmail || ticket.userId || "Unknown")
                      )}
                    </td>
                    <td className="px-6 py-5 text-slate-500 text-sm">{ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : "N/A"}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <Badge variant={ticket.status === "open" ? "warn" : "success"}>
                          {ticket.status}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button onClick={() => { setSelectedTicket(ticket); setShowDetailModal(true); }} className="btn-ghost text-xs">View</button>
                        {ticket.status === "open" && (
                          <button onClick={() => handleResolve(ticket.id)} className="btn-ghost text-xs">
                            Mark Resolved
                          </button>
                        )}
                        {ticket.status === 'resolved' && (
                          <button onClick={async () => {
                            // confirm before deleting
                            const ok = window.confirm('Delete this resolved ticket?');
                            if (!ok) return;
                            try {
                              await deleteSupportTicket(ticket.id);
                              toast.success('Deleted ticket');
                              await refresh();
                            } catch (e) { toast.error('Failed to delete ticket'); }
                          }} className="btn-ghost text-xs text-red-400">Delete</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
    <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Ticket details">
      {selectedTicket ? (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">{selectedTicket.subject}</h3>
            <p className="text-sm text-slate-400">{selectedTicket.createdAt ? new Date(selectedTicket.createdAt).toLocaleString() : 'N/A'}</p>
          </div>
          <div>
            <p className="text-slate-300">{selectedTicket.message}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">From</h4>
            {selectedTicket.raiser ? (
              <div>
                <div className="font-medium">{selectedTicket.raiser.name}</div>
                <div className="text-xs text-slate-400">{selectedTicket.raiser.email}</div>
              </div>
            ) : (
              <div className="text-xs text-slate-400">{selectedTicket.userEmail || selectedTicket.userId || 'Unknown'}</div>
            )}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowDetailModal(false)} className="btn-ghost">Close</button>
          </div>
        </div>
      ) : null}
    </Modal>
    </>
  );
}
