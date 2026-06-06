// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Player } from "@lottiefiles/react-lottie-player";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please fill all fields");

    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (profile) {
      const redirectTo = location.state?.from;
      const role = profile.role?.toLowerCase();

      if (redirectTo) {
        navigate(redirectTo, { replace: true });
        return;
      }

      if (role === "admin") navigate("/admin/dashboard", { replace: true });
      else if (role === "teacher") navigate("/teacher/dashboard", { replace: true });
      else navigate("/student/dashboard", { replace: true });
    }
  }, [profile, navigate, location]);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] animate-[pulse_8s_ease-in-out_infinite]" />
      </div>

      <div className="w-full max-w-6xl relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 animate-slide-up">
        {/* Left Side - Animation */}
        <div className="hidden lg:flex flex-1 justify-center items-center">
          <div className="w-full max-w-md relative">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-violet-500/10 rounded-[3rem] blur-3xl -z-10" />

            <
              Player
              autoplay
              loop
              src="/assets/animations/login-animation.json"
              style={{ width: "500px", height: "500px" }}
              className="drop-shadow-2xl"
            />

            <div className="text-center mt-8">
              <p className="text-slate-400 text-sm max-w-xs mx-auto">
                Your learning journey begins with a single secure sign-in
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md lg:flex-1">
          {/* Header */}
          <div className="text-center mb-10">

            {/* <img src="/Logo.png" alt="SkillNest" className="w-22  lg:mx-0 inline-flex w-22 mb-5 mt-4 h-14 mx-auto" /> */}
            <h1 className="text-4xl font-display font-bold text-white tracking-tight">
              Welcome back
            </h1>
            <p className="text-slate-400 mt-1 text-lg">
              Sign in to continue your learning journey
            </p>
          </div>

          {/* Login Form Card */}
          <div className="glass-card p-8 md:p-10 rounded-3xl border border-white/5">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email"
                  className="input-field w-full"
                  autoComplete="email"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field w-full"
                  autoComplete="current-password"
                  required
                />
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end -mt-2">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-brand-400 hover:text-brand-300 transition-all duration-200 font-medium"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-3 py-3.5 text-base font-semibold rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Signup Link */}
            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-slate-400 text-sm">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-brand-400 hover:text-brand-300 font-semibold transition-colors inline-flex items-center gap-1 group"
                >
                  Create one
                  <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </Link>
              </p>
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Secured with Firebase Authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
}