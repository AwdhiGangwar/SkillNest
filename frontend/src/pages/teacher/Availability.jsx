// src/pages/teacher/Availability.jsx
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { CardSkeleton, EmptyState, Badge, Modal } from "../../components/ui";
import {
  getTeacherAvailability,
  addAvailabilitySlot,
  deleteAvailabilitySlot,
} from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const EMPTY_FORM = { date: "", startTime: "09:00", endTime: "10:00" };

export default function Availability() {
  const { user } = useAuth();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchSlots = async () => {
    if (!user?.uid) return;
    try {
      const res = await getTeacherAvailability(user.uid);
      setSlots(res.data || []);
    } catch {
      toast.error("Failed to load availability");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSlots(); }, [user]);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.date || !form.startTime || !form.endTime)
      return toast.error("Please fill all fields");
    if (form.startTime >= form.endTime)
      return toast.error("End time must be after start time");

    setSaving(true);
    try {
      await addAvailabilitySlot({
        id: `slot_${Date.now()}`,
        teacherId: user.uid,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        status: "available",
      });
      toast.success("Availability slot added!");
      setShowModal(false);
      setForm(EMPTY_FORM);
      await fetchSlots();
    } catch (err) {
      toast.error(err.message || "Failed to add slot");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slot) => {
    if (!window.confirm("Remove this availability slot?")) return;
    try {
      await deleteAvailabilitySlot(slot.id);
      toast.success("Slot removed");
      await fetchSlots();
    } catch (err) {
      toast.error(err.message || "Failed to remove slot");
    }
  };

  // Group slots by date
  const grouped = slots.reduce((acc, slot) => {
    const key = slot.date || "Unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(slot);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort();

  return (
    <Layout
      title="Availability"
      subtitle="Manage when you're available for classes"
      actions={
        <button onClick={() => setShowModal(true)} className="btn-primary">
          + Add Slot
        </button>
      }
    >
      {loading ? (
        <div className="space-y-4">{Array(4).fill(0).map((_, i) => <CardSkeleton key={i} />)}</div>
      ) : slots.length === 0 ? (
        <EmptyState
          icon="◻"
          title="No availability set"
          description="Add your available time slots so students can book classes with you"
          action={
            <button onClick={() => setShowModal(true)} className="btn-primary">
              Add First Slot
            </button>
          }
        />
      ) : (
        <div className="space-y-6">
          {sortedDates.map((date) => {
            const dateObj = new Date(date + "T00:00:00");
            const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" });
            const dateStr = dateObj.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

            return (
              <div key={date} className="glass-card p-6 animate-slide-up">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center">
                    <span className="text-brand-400 font-bold text-xs">{dayName.slice(0, 2)}</span>
                  </div>
                  <div>
                    <div className="font-display font-semibold text-white">{dayName}</div>
                    <div className="text-xs text-slate-400">{dateStr}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  {grouped[date]
                    .sort((a, b) => a.startTime?.localeCompare(b.startTime))
                    .map((slot) => (
                      <SlotRow key={slot.id} slot={slot} onDelete={handleDelete} />
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Slot Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setForm(EMPTY_FORM); }}
        title="Add Availability Slot"
      >
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Date <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="input-field"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Start Time <span className="text-red-400">*</span>
              </label>
              <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                End Time <span className="text-red-400">*</span>
              </label>
              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          {/* Preview */}
          {form.date && form.startTime && form.endTime && (
            <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-sm text-brand-300">
              📅 {new Date(form.date + "T00:00:00").toLocaleDateString("en-US", {
                weekday: "long", month: "long", day: "numeric",
              })} · {form.startTime} – {form.endTime}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => { setShowModal(false); setForm(EMPTY_FORM); }}
              className="btn-ghost flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : "Add Slot"}
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}

function SlotRow({ slot, onDelete }) {
  const statusColors = {
    available: "success",
    booked: "info",
    blocked: "danger",
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-surface-hover hover:bg-surface-border/50 transition-colors group">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-emerald-400" />
        <span className="text-sm font-medium text-white font-mono">
          {slot.startTime} – {slot.endTime}
        </span>
        <Badge variant={statusColors[slot.status] || "default"}>
          {slot.status}
        </Badge>
      </div>
      {slot.status === "available" && (
        <button
          onClick={() => onDelete(slot)}
          className="text-xs text-slate-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
        >
          Remove
        </button>
      )}
      {slot.status === "booked" && (
        <span className="text-xs text-slate-500">
          {slot.studentId ? `Student: ${slot.studentId.slice(0, 8)}...` : "Booked"}
        </span>
      )}
    </div>
  );
}
