import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { CardSkeleton, EmptyState, Badge } from "../components/ui";
import toast from "react-hot-toast";
import { getPayments } from "../services/api";

export default function Payments() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await getPayments();
        setTransactions(res.data || []);
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
    <Layout title="Payments" subtitle="Manage your transactions and billing">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="glass-card p-6 rounded-xl border border-surface-border">
            <p className="text-slate-400 text-sm mb-2">Total Paid</p>
            <h3 className="text-3xl font-bold text-brand-400">${getTotalAmount()}</h3>
            <p className="text-slate-500 text-xs mt-2">All transactions</p>
          </div>

          <div className="glass-card p-6 rounded-xl border border-surface-border">
            <p className="text-slate-400 text-sm mb-2">Transactions</p>
            <h3 className="text-3xl font-bold text-emerald-400">{transactions.length}</h3>
            <p className="text-slate-500 text-xs mt-2">Total payments</p>
          </div>

          <div className="glass-card p-6 rounded-xl border border-surface-border">
            <p className="text-slate-400 text-sm mb-2">Payment Method</p>
            <h3 className="text-lg font-bold text-white">Stripe</h3>
            <p className="text-slate-500 text-xs mt-2">Primary payment gateway</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : transactions.length === 0 ? (
          <EmptyState
            icon="💳"
            title="No transactions yet"
            description="Your payment history will appear here"
          />
        ) : (
          <div className="glass-card p-6 rounded-xl border border-surface-border">
            <h2 className="text-xl font-display font-bold text-white mb-4">Transaction History</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-surface-border">
                  <tr className="text-slate-400">
                    <th className="text-left py-3">Date</th>
                    <th className="text-left py-3">Description</th>
                    <th className="text-left py-3">Amount</th>
                    <th className="text-left py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {transactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-surface-border/30 transition-all">
                      <td className="py-3">{new Date(txn.date).toLocaleDateString()}</td>
                      <td className="py-3 text-slate-300">{txn.description}</td>
                      <td className="py-3 font-semibold text-brand-400">${txn.amount}</td>
                      <td className="py-3">
                        <Badge variant={txn.status === "completed" ? "success" : "info"}>
                          {txn.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
