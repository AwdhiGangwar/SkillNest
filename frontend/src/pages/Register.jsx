// src/pages/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, role } = form;

    if (!name || !email || !password) return toast.error("Please fill all fields");
    if (password !== confirmPassword)
      return toast.error("Passwords do not match");
    if (password.length < 6)
      return toast.error("Password must be at least 6 characters");

    setLoading(true);
    try {
      await register(name, email, password, role);
      toast.success("Account created! Welcome to SkillNest 🎉");
      if (role === "teacher") navigate("/teacher/dashboard");
      else navigate("/student/dashboard");
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-brand-500 items-center justify-center text-white font-bold text-xl mb-4">
            SN
          </div>
          <h1 className="text-3xl font-display font-bold text-white">
            Join SkillNest
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Create your account and start learning
          </p>
        </div>

        <div className="glass-card p-8">
          {/* Role selector */}
          <div className="flex rounded-xl border border-surface-border overflow-hidden mb-6">
            {["student", "teacher"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setForm((p) => ({ ...p, role: r }))}
                className={`flex-1 py-2.5 text-sm font-semibold capitalize transition-all duration-200 ${
                  form.role === r
                    ? r === "teacher"
                      ? "bg-orange-500 text-white"
                      : "bg-violet-500 text-white"
                    : "text-slate-400 hover:text-white hover:bg-surface-hover"
                }`}
              >
                {r === "student" ? "👨‍🎓" : "👨‍🏫"} {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Full Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="input-field"
                autoComplete="name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email address
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input-field"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                className="input-field"
                autoComplete="new-password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className="input-field"
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                `Create ${form.role === "teacher" ? "Teacher" : "Student"} Account`
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-surface-border text-center">
            <p className="text-slate-400 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
