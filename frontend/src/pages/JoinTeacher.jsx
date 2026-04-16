import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { applyAsTeacher } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function JoinTeacher() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    skills: "",
    experience: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await applyAsTeacher(form);
      toast.success("Application submitted successfully!");
      // Navigate home or to a success page
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-mesh-gradient opacity-20 pointer-events-none" />
      
      <div className="max-w-2xl w-full relative z-10">
        <div className="text-center mb-10 animate-slide-up">
          <h1 className="text-4xl font-display font-bold mb-3">Join as a Teacher</h1>
          <p className="text-slate-400">Share your expertise and inspire the next generation of learners.</p>
        </div>

        <div className="glass-card p-8 animate-fade-in border border-surface-border bg-surface-card/50 backdrop-blur-xl rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="input-field w-full"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="input-field w-full"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="input-field w-full"
                  placeholder="e.g. +1 (555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Key Skills</label>
              <input
                name="skills"
                value={form.skills}
                onChange={handleChange}
                required
                className="input-field w-full"
                placeholder="e.g. React, Python, Data Science (comma separated)"
              />
            </div>

             <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Teaching Experience</label>
              <input
                name="experience"
                value={form.experience}
                onChange={handleChange}
                required
                className="input-field w-full"
                placeholder="e.g. 5 years as Senior Dev, 2 years tutoring"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Bio / Introduction</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                required
                rows={4}
                className="input-field w-full resize-none"
                placeholder="Tell us a bit about yourself and why you want to teach..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 rounded-xl font-semibold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Submit Application"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}