import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import { createTeacher } from "../services/api";
import toast from "react-hot-toast";

export default function CreateTeacher() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    email: searchParams.get("email") || "",
  });

  // Re-sync if URL params change
  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setForm(prev => ({ ...prev, email: emailParam }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!form.name || !form.email) {
    toast.error("Please fill all fields");
    return;
  }

  try {
    setLoading(true);
    await createTeacher(form);
    toast.success("Teacher account created successfully");
    navigate("/admin/users");
  } catch (err) {
    console.error("Create teacher failed:", err);
    toast.error(err?.message || "Failed to create teacher account");
  } finally {
    setLoading(false);
  }
};
  return (
    <Layout 
      title="Create Teacher Account" 
      subtitle="Provision a new account. An invitation link will be sent to the email provided."
    >
      <div className="max-w-full mx-auto">
        <div className="glass-card p-8 animate-fade-in border border-surface-border bg-surface-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Teacher Full Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                className="input-field w-full"
                required
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
                placeholder="jane@example.com"
                className="input-field w-full"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 flex items-center justify-center gap-2"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Create Teacher Account"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}