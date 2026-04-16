import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { getPayments, getPaymentSummary, getTeacherPayouts } from "../../services/api";
import { CardSkeleton, EmptyState, Badge } from "../../components/ui";
import toast from "react-hot-toast";

export default function AdminPayments() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [payouts, setPayouts] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await getPayments();
        setTransactions(res.data || []);
        const sumRes = await getPaymentSummary();
        setSummary(sumRes.data || null);
        const payoutsRes = await getTeacherPayouts();
        setPayouts(payoutsRes.data || []);
      } catch (err) {
        toast.error("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const getTotalAmount = () => {
    return transactions.reduce((sum, t) => sum + (t.amount || 0), 0).toFixed(2);
  };

  return (
    <Layout
      title="Payment Management"
      subtitle="View all platform transactions and payment history"
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-xl border border-surface-border">
            <p className="text-slate-400 text-sm mb-2">Total Revenue</p>
            <h3 className="text-3xl font-bold text-emerald-400">${summary ? Number(summary.totalRevenue || 0).toFixed(2) : getTotalAmount()}</h3>
            <p className="text-slate-500 text-xs mt-2">All time earnings</p>
          </div>
          <div className="glass-card p-6 rounded-xl border border-surface-border">
            <p className="text-slate-400 text-sm mb-2">Paid to Teachers</p>
            <h3 className="text-3xl font-bold text-rose-400">${summary ? Number(summary.totalPaidToTeachers || 0).toFixed(2) : '0.00'}</h3>
            <p className="text-slate-500 text-xs mt-2">Total payouts ({payouts.length})</p>
          </div>
          <div className="glass-card p-6 rounded-xl border border-surface-border">
            <p className="text-slate-400 text-sm mb-2">Monthly Revenue</p>
            <h3 className="text-3xl font-bold text-emerald-400">${(() => {
                if (!summary || !summary.monthlyRevenue) return '0.00';
                const m = summary.monthlyRevenue;
                const d = new Date();
                const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
                return Number(m[key] || 0).toFixed(2);
              })()}</h3>
            <p className="text-slate-500 text-xs mt-2">Current month</p>
          </div>
          <div className="glass-card p-6 rounded-xl border border-surface-border">
            <p className="text-slate-400 text-sm mb-2">Total Transactions</p>
            <h3 className="text-3xl font-bold text-brand-400">{transactions.length}</h3>
            <p className="text-slate-500 text-xs mt-2">Completed payments</p>
          </div>
        </div>

        {/* Transactions Table */}
        {loading ? (
          <div className="space-y-3">
            {Array(5).fill(0).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : transactions.length === 0 ? (
          <EmptyState icon="💳" title="No transactions" description="No payment transactions found" />
        ) : (
          <div className="glass-card overflow-hidden border border-surface-border">
            <table className="w-full text-left">
              <thead className="bg-surface-hover/50 text-xs uppercase text-slate-400 font-semibold">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-surface-hover/30 transition-colors">
                    <td className="px-6 py-5 text-slate-400 text-sm">{txn.date}</td>
                    <td className="px-6 py-5 text-white">{txn.description}</td>
                    <td className="px-6 py-5 font-semibold text-emerald-400">${txn.amount}</td>
                    <td className="px-6 py-5">
                      <Badge variant={txn.status === "completed" ? "success" : "warn"}>
                        {txn.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
