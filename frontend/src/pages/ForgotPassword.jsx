import React, { useState } from "react";
import { resetPassword } from "../services/firebase";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    if (!email) return toast.error("Enter your email");

    try {
      await resetPassword(email);
      toast.success("Reset link sent to your email 📩");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleReset} className="glass-card p-6 space-y-4">
        <h2 className="text-xl text-white">Reset Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="btn-primary w-full">
          Send Reset Link
        </button>
      </form>
    </div>
  );
}