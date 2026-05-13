import React from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
<<<<<<< HEAD
import { StatCard, CardSkeleton } from "../components/ui";
import { getAdminDashboard } from "../services/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await getAdminDashboard();
        setDashboardData(res.data);
      } catch (err) {
        // ✅ Error pe bhi dashboard dikhao — empty data ke saath
        console.error("Admin Dashboard fetch error:", err);
        setDashboardData({
          totalUsers: 0,
          totalCourses: 0,
          totalRevenue: 0,
          openSupportTickets: 0
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <Layout
      title="Admin Dashboard"
      subtitle="Platform-wide metrics and quick access to management tools"
    >
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array(4).fill(0).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Platform Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Active Users" value={dashboardData?.totalUsers || 0} icon="👥" color="brand" />
            <StatCard label="Live Courses" value={dashboardData?.totalCourses || 0} icon="📚" color="violet" />
            <StatCard label="Platform Revenue" value={`$${dashboardData?.totalRevenue?.toFixed(2) || '0.00'}`} icon="💰" color="green" />
            <StatCard label="Support Tickets" value={dashboardData?.openSupportTickets || 0} icon="🎧" color="pink" />
          </div>

          {/* Quick Links / Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <QuickLinkCard title="Manage Users" description="View, block, and unblock user accounts." icon="👥" link="/admin/users" />
            <QuickLinkCard title="Manage Courses" description="Create, edit, and publish courses." icon="📚" link="/admin/courses" />
            <QuickLinkCard title="Review Enrollments" description="Approve or reject student enrollment requests." icon="🎓" link="/admin/enrollments" />
            <QuickLinkCard title="Teacher Applications" description="Review and approve new teacher requests." icon="📝" link="/admin/teacher-requests" />
            <QuickLinkCard title="Platform Analytics" description="Deep dive into platform performance." icon="📈" link="/admin/analytics" />
            <QuickLinkCard title="Support Tickets" description="Handle user support inquiries." icon="🎧" link="/admin/support" />
          </div>
        </div>
      )}
    </Layout>
  );
}

// Helper component for quick links
function QuickLinkCard({ title, description, icon, link }) {
  return (
    <Link to={link} className="glass-card p-6 rounded-xl border border-surface-border hover:border-brand-500/30 transition-all duration-300 group flex flex-col justify-between">
      <div>
        <div className="w-12 h-12 rounded-xl bg-brand-500/15 flex items-center justify-center text-2xl mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-brand-300 transition-colors">{title}</h3>
        <p className="text-slate-400 text-sm">{description}</p>
      </div>
      <span className="mt-4 text-brand-400 group-hover:text-brand-300 transition-colors text-sm font-medium flex items-center gap-1">
        Go to {title} <span className="group-hover:translate-x-1 transition-transform">→</span>
      </span>
    </Link>
  );
=======

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
>>>>>>> ca9e6a8546d45fdcb2d8dbf6b42011e2c1e874cb
}