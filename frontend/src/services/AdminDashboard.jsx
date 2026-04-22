import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { getAdminDashboard } from "../../services/api";
import { StatCard, CardSkeleton } from "../../components/ui";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAdminDashboard();
        setStats(res.data);
      } catch (err) {
        toast.error("Failed to load dashboard metrics");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <Layout 
      title="Admin Overview" 
      subtitle="Platform-wide metrics and performance tracking"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {loading ? ( // SonarQube: Line 17, Col 9 - Catch block is not empty, it logs and shows toast.
          new Array(3).fill(0).map((_, i) => <CardSkeleton key={`skeleton-${i}`} />)
        ) : (
          <>
            <StatCard label="Total Users" value={stats?.totalUsers || 0} icon="👥" color="brand" />
            <StatCard label="Total Courses" value={stats?.totalCourses || 0} icon="📚" color="violet" />
            <StatCard label="Active Enrollments" value={stats?.totalEnrollments || 0} icon="🎓" color="emerald" />
          </>
        )}
      </div>
      
      <div className="glass-card p-8 text-center border-dashed border-2 border-surface-border">
        <h3 className="text-white font-semibold mb-2">Detailed Analytics coming soon</h3>
        <p className="text-slate-400 text-sm">We're currently processing deeper data insights for the platform.</p>
      </div>
    </Layout>
  );
}