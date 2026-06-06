import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { applyAsTeacher } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

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
      toast.success("Application submitted successfully! 🎉");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-bg text-light-text dark:bg-surface dark:text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/10 via-purple-500/10 to-slate-950/10 dark:from-slate-950/70 dark:via-purple-500/30 dark:to-slate-950 animate-gradient" />

      <div className="max-w-2xl w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">
            Join as a <span className="text-orange-400">Teacher</span>
          </h1>
          <p className="text-light-text-secondary dark:text-slate-400 text-lg max-w-md mx-auto">
            Share your expertise and inspire the next generation of learners
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-8 lg:p-10 rounded-3xl backdrop-blur-xl">
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
                  placeholder="Name"
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
                  placeholder="Email"
                />
              </div>
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
                placeholder="Phone"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Key Skills / Subjects</label>
              <input
                name="skills"
                value={form.skills}
                onChange={handleChange}
                required
                className="input-field w-full"
                placeholder="Skills (e.g. JavaScript, Data Science, etc.)"
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
                placeholder="e.g. 5+ years as Software Engineer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Bio / Introduction</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                required
                rows={5}
                className="input-field w-full resize-none"
                placeholder="Tell us about yourself, your teaching style, and why you want to join CodeCat..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-lg font-semibold rounded-2xl flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting Application...
                </>
              ) : (
                "Submit Teacher Application"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-400 mt-6">
          Want to learn instead?{" "}
          <Link to="/register" className="text-orange-400 hover:text-orange-300 font-medium">
            Register as Student
          </Link>
        </p>
      </div>
    </div>
  );
}