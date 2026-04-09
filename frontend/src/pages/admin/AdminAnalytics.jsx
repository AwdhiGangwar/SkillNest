import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { getAnalytics } from "../../services/api";
import { CardSkeleton } from "../../components/ui";
import toast from "react-hot-toast";

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await getAnalytics();
        setStats(res.data);
      } catch (err) {
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <Layout title="Platform Analytics" subtitle="System-wide performance and engagement metrics">
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array(4).fill(0).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="glass-card p-6 rounded-xl border border-surface-border">
              <p className="text-slate-400 text-sm mb-2">Total Revenue</p>
              <h3 className="text-3xl font-bold text-brand-400">${stats?.totalRevenue || 0}</h3>
              <p className="text-slate-500 text-xs mt-2">Platform earnings</p>
            </div>

            <div className="glass-card p-6 rounded-xl border border-surface-border">
              <p className="text-slate-400 text-sm mb-2">Active Students</p>
              <h3 className="text-3xl font-bold text-emerald-400">{stats?.activeStudents || 0}</h3>
              <p className="text-slate-500 text-xs mt-2">Currently enrolled</p>
            </div>

            <div className="glass-card p-6 rounded-xl border border-surface-border">
              <p className="text-slate-400 text-sm mb-2">Total Courses</p>
              <h3 className="text-3xl font-bold text-violet-400">{stats?.totalCourses || 0}</h3>
              <p className="text-slate-500 text-xs mt-2">On platform</p>
            </div>

            <div className="glass-card p-6 rounded-xl border border-surface-border">
              <p className="text-slate-400 text-sm mb-2">Avg Rating</p>
              <h3 className="text-3xl font-bold text-yellow-400">{stats?.avgRating || 0}⭐</h3>
              <p className="text-slate-500 text-xs mt-2">Overall quality</p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-xl border border-surface-border">
            <h2 className="text-xl font-display font-bold text-white mb-4">Revenue Trend</h2>
            <div className="h-64 flex items-end justify-around gap-2">
              {[45, 60, 32, 78, 92, 55, 20].map((val, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-brand-500/30 rounded-t-lg hover:bg-brand-500/50 transition-all"
                  style={{height: `${val}%`}}
                  title={`${val}%`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-500">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
