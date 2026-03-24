// src/pages/teacher/Earnings.jsx
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { StatCard, CardSkeleton, EmptyState } from "../../components/ui";
import { getTeacherEarnings, getMonthlyEarnings, getTeacherClasses } from "../../services/api";
import toast from "react-hot-toast";

const RATE_PER_CLASS = 10; // $10 per completed class

export default function Earnings() {
  const [earnings, setEarnings] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [earnRes, monthRes, clsRes] = await Promise.allSettled([
          getTeacherEarnings(),
          getMonthlyEarnings(),
          getTeacherClasses(),
        ]);
        if (earnRes.status === "fulfilled") setEarnings(earnRes.value.data);
        if (monthRes.status === "fulfilled") setMonthly(monthRes.value.data || []);
        if (clsRes.status === "fulfilled") setClasses(clsRes.value.data || []);
      } catch {
        toast.error("Failed to load earnings");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const completedClasses = classes.filter((c) => c.status === "completed");
  const totalEarnings = earnings?.totalEarnings ?? completedClasses.length * RATE_PER_CLASS;

  // Compute monthly from classes if API not available
  const monthlyData = monthly.length > 0 ? monthly : buildMonthlyFromClasses(completedClasses);

  return (
    <Layout
      title="Earnings"
      subtitle={`You earn $${RATE_PER_CLASS} per completed class`}
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array(4).fill(0).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            <StatCard label="Total Earnings" value={`$${totalEarnings}`} icon="💰" color="amber" />
            <StatCard
              label="This Month"
              value={`$${earnings?.monthlyEarnings ?? (monthlyData[0]?.amount || 0)}`}
              icon="📈"
              color="emerald"
            />
            <StatCard label="Classes Conducted" value={completedClasses.length} icon="✅" color="brand" />
            <StatCard label="Rate per Class" value={`$${RATE_PER_CLASS}`} icon="⭐" color="violet" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly breakdown */}
        <div className="glass-card p-6">
          <h2 className="font-display font-semibold text-white text-lg mb-5">Monthly Breakdown</h2>
          {loading ? (
            <div className="space-y-3">{Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)}</div>
          ) : monthlyData.length === 0 ? (
            <EmptyState icon="📊" title="No earnings yet" description="Complete classes to start earning" />
          ) : (
            <div className="space-y-3">
              {monthlyData.slice(0, 8).map((m, i) => (
                <MonthRow key={i} month={m} max={Math.max(...monthlyData.map((x) => x.amount))} />
              ))}
            </div>
          )}
        </div>

        {/* Recent completed classes */}
        <div className="glass-card p-6">
          <h2 className="font-display font-semibold text-white text-lg mb-5">Recent Earnings</h2>
          {loading ? (
            <div className="space-y-3">{Array(5).fill(0).map((_, i) => <CardSkeleton key={i} />)}</div>
          ) : completedClasses.length === 0 ? (
            <EmptyState icon="✅" title="No completed classes" description="Conduct classes to earn" />
          ) : (
            <div className="space-y-2">
              {completedClasses
                .sort((a, b) => (b.startTime || 0) - (a.startTime || 0))
                .slice(0, 8)
                .map((cls) => (
                  <EarningRow key={cls.id} cls={cls} rate={RATE_PER_CLASS} />
                ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

function MonthRow({ month, max }) {
  const pct = max > 0 ? (month.amount / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-400 w-20 shrink-0">{month.label}</span>
      <div className="flex-1 h-2 bg-surface-border rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-bold text-amber-400 w-16 text-right">${month.amount}</span>
    </div>
  );
}

function EarningRow({ cls, rate }) {
  const date = cls.startTime
    ? new Date(cls.startTime).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      })
    : "Unknown date";

  return (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-hover transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center text-sm">
          ✅
        </div>
        <div>
          <div className="text-sm font-medium text-white">{cls.title || "Class Session"}</div>
          <div className="text-xs text-slate-400">{date}</div>
        </div>
      </div>
      <span className="text-sm font-bold text-emerald-400">+${rate}</span>
    </div>
  );
}

function buildMonthlyFromClasses(classes) {
  const map = {};
  classes.forEach((cls) => {
    if (!cls.startTime) return;
    const d = new Date(cls.startTime);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    if (!map[key]) map[key] = { label, amount: 0 };
    map[key].amount += 10;
  });
  return Object.entries(map)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([, v]) => v);
}
