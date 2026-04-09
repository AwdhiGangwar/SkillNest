import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { CardSkeleton, EmptyState, Badge, Modal } from "../components/ui";
import toast from "react-hot-toast";
import { getSupportTickets, createSupportTicket } from "../services/api";

export default function Support() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subject || !form.message) {
      toast.error("Please fill all fields");
      return;
    }

    setSubmitting(true);
    try {
      await createSupportTicket(form);
      toast.success("Support ticket created!");
      setForm({ subject: "", message: "" });
      setShowModal(false);
      fetchTickets();
    } catch (err) {
      toast.error("Failed to create ticket");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title="Support" subtitle="Get help from our support team">
      <div className="space-y-6">
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary px-6 py-3"
        >
          + Create Support Ticket
        </button>

        {loading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : tickets.length === 0 ? (
          <EmptyState
            icon="🎧"
            title="No support tickets"
            description="Create a ticket if you need help from our support team"
            action={
              <button onClick={() => setShowModal(true)} className="btn-primary">
                Create Ticket
              </button>
            }
          />
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="glass-card p-6 rounded-xl border border-surface-border">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-display font-bold text-white">{ticket.subject}</h3>
                  <Badge variant={ticket.status === "open" ? "info" : "success"}>
                    {ticket.status}
                  </Badge>
                </div>
                <p className="text-slate-300 mb-3">{ticket.message}</p>
                <p className="text-slate-500 text-xs">Created {new Date(ticket.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Support Ticket">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="e.g. Cannot enroll in course"
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Describe your issue..."
              rows={5}
              className="input-field w-full resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="btn-ghost flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex-1"
            >
              {submitting ? "Creating..." : "Create Ticket"}
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
