import React from "react";
import Layout from "../../components/Layout";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <Layout
      title="Admin Dashboard"
      subtitle="Welcome to the management portal"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-8 flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/20 flex items-center justify-center text-3xl">
            📋
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-white mb-2">Teacher Requests</h2>
            <p className="text-slate-400 text-sm">Review and approve new teacher applications.</p>
          </div>
          <Link to="/admin/teacher-requests" className="btn-primary w-full py-3">
            View Teacher Requests
          </Link>
        </div>

        {/* Placeholder for other admin stats/features */}
        <div className="glass-card p-8 flex flex-col items-center text-center space-y-4 opacity-60">
          <div className="w-16 h-16 rounded-2xl bg-slate-500/20 flex items-center justify-center text-3xl">
            📊
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-white mb-2">System Analytics</h2>
            <p className="text-slate-400 text-sm">Monitor platform growth and activity.</p>
          </div>
          <button disabled className="btn-ghost w-full py-3">Coming Soon</button>
        </div>
      </div>
    </Layout>
  );
}