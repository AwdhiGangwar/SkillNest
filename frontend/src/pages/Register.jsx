import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Player } from "@lottiefiles/react-lottie-player";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student", // Fixed to student only
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = form;

    if (!name || !email || !password) return toast.error("Please fill all fields");
    if (password !== confirmPassword) return toast.error("Passwords do not match");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");

    setLoading(true);
    try {
      await register(name, email, password, "student");
      setSuccess(true);
      toast.success("Account created successfully! 🎉");

      setTimeout(() => {
        navigate("/student/dashboard");
      }, 2200);
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-bg text-light-text dark:bg-surface dark:text-white flex items-center justify-center p-4 overflow-hidden">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT SIDE - Animation & Illustration */}
        <div className="hidden lg:flex flex-col items-center justify-center relative">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold mb-4">
              Welcome to <span className="text-orange-400">CodeCat</span>
            </h1>
            <p className="text-xl text-light-text-secondary dark:text-slate-400 max-w-md">
              Start your personalized learning journey today
            </p>
          </div>

          {!success ? (
            <Player
              autoplay
              loop
              src="/assets/animations/register-animation.json"
              style={{ width: "500px", height: "500px" }}
              className="drop-shadow-2xl"
            />
          ) : (
            <div className="text-center">
              <Player
                autoplay
                loop={false}
                src="/assets/animations/register-animation.json"
                style={{ width: "500px", height: "500px" }}
              />
              <p className="text-3xl font-semibold text-orange-400 mt-8">
                Account Created Successfully!
              </p>
            </div>
          )}
        </div>

        {/* RIGHT SIDE - Registration Form */}
        <div className="glass-card rounded-3xl p-6 lg:p-12 shadow-xl">
          <div className="mb-8 text-center lg:text-left">
            <div className="text-4xl font-display font-bold text-orange-400 mb-4">CodeCat</div>
            <h1 className="text-4xl font-bold text-light-text dark:text-white">Create Student Account</h1>
            <p className="text-light-text-secondary dark:text-slate-400 mt-2">Join the CodeCat learning community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="input-field w-full px-5 py-4 rounded-2xl focus:border-orange-500"
              required
            />

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="input-field w-full px-5 py-4 rounded-2xl focus:border-orange-500"
              required
            />

            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create Password"
              className="input-field w-full px-5 py-4 rounded-2xl focus:border-orange-500"
              required
            />

            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="input-field w-full px-5 py-4 rounded-2xl focus:border-orange-500"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-lg font-semibold rounded-2xl flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create My Account"
              )}
            </button>
          </form>

          <p className="text-center text-slate-400 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-400 hover:text-orange-300 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}