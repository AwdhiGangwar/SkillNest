import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import { StatCard, CardSkeleton } from "../components/ui";
import { getAdminDashboard } from "../services/api";
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
        console.error("Admin Dashboard fetch error:", err);
        setDashboardData({
          totalUsers: 0,
          totalCourses: 0,
          totalRevenue: 0,
          openSupportTickets: 0,
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
      subtitle="Platform-wide metrics and management tools"
    >
      {/* Platform Summary Stats */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array(4).fill(0).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Active Users"
            value={dashboardData?.totalUsers || 0}
            icon="👥"
            trend="+12% this month"
          />
          <StatCard
            label="Live Courses"
            value={dashboardData?.totalCourses || 0}
            icon="📚"
            trend="+5 this month"
          />
          <StatCard
            label="Total Revenue"
            value={`$${dashboardData?.totalRevenue?.toFixed(2) || "0.00"}`}
            icon="💰"
            trend="+8.2% this month"
          />
          <StatCard
            label="Open Tickets"
            value={dashboardData?.openSupportTickets || 0}
            icon="🎧"
            trend={`${dashboardData?.openSupportTickets || 0} pending`}
          />
        </div>
      )}

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-display font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickLinkCard
            title="Manage Users"
            description="View, block, and manage user accounts"
            icon="👥"
            link="/admin/users"
            color="blue"
          />
          <QuickLinkCard
            title="Manage Courses"
            description="Create, edit, and monitor courses"
            icon="📚"
            link="/admin/courses"
            color="purple"
          />
          <QuickLinkCard
            title="Teacher Requests"
            description="Review teacher applications"
            icon="📝"
            link="/admin/teacher-requests"
            color="amber"
          />
          <QuickLinkCard
            title="Enrollments"
            description="Manage student enrollments"
            icon="🎓"
            link="/admin/enrollments"
            color="emerald"
          />
          <QuickLinkCard
            title="Analytics"
            description="View platform performance"
            icon="📈"
            link="/admin/analytics"
            color="pink"
          />
          <QuickLinkCard
            title="Support Tickets"
            description="Handle user inquiries"
            icon="🎧"
            link="/admin/support"
            color="cyan"
          />
        </div>
      </div>
    </Layout>
  );
}

function QuickLinkCard({ title, description, icon, link, color }) {
  const colorClasses = {
    blue: "bg-brand-500/15 text-brand-400 hover:text-brand-300",
    purple: "bg-violet-500/15 text-violet-400 hover:text-violet-300",
    amber: "bg-amber-500/15 text-amber-400 hover:text-amber-300",
    emerald: "bg-emerald-500/15 text-emerald-400 hover:text-emerald-300",
    pink: "bg-pink-500/15 text-pink-400 hover:text-pink-300",
    cyan: "bg-cyan-500/15 text-cyan-400 hover:text-cyan-300",
  };

  return (
    <Link
      to={link}
      className="glass-card p-6 rounded-2xl hover:border-surface-border/50 transition-all duration-300 group flex flex-col justify-between h-full"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${colorClasses[color]}`}
        >
          {icon}
        </div>
        <svg
          className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
      <div>
        <h3 className="text-lg font-display font-bold text-white mb-2 group-hover:text-brand-300 transition-colors">
          {title}
        </h3>
        <p className="text-slate-400 text-sm">{description}</p>
      </div>
    </Link>
  );
}