import React, { useState, useEffect } from 'react';
import { getTeacherPayouts, getPaymentSummary } from '../../services/api';
import { toast } from 'react-hot-toast';

export default function TeacherPayouts() {
  const [payouts, setPayouts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayoutsAndSummary();
  }, []);

  const fetchPayoutsAndSummary = async () => {
    try {
      setLoading(true);
      const [payoutsRes, summaryRes] = await Promise.all([
        getTeacherPayouts(),
        getPaymentSummary(),
      ]);
      setPayouts(payoutsRes.data || []);
      setSummary(summaryRes.data || null);
    } catch (error) {
      toast.error('Failed to fetch payout information');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading payout information...</div>;
  }

  return (
    <div className="teacher-payouts">
      <h2 className="text-2xl font-bold mb-6">Teacher Payouts</h2>

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-blue-600">
              ${summary.totalRevenue.toFixed(2)}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-md border border-green-200">
            <p className="text-sm text-gray-600">Completed Payments</p>
            <p className="text-2xl font-bold text-green-600">{summary.completedPayments}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
            <p className="text-sm text-gray-600">Pending Payments</p>
            <p className="text-2xl font-bold text-yellow-600">{summary.pendingPayments}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-md border border-purple-200">
            <p className="text-sm text-gray-600">Total Payouts</p>
            <p className="text-2xl font-bold text-purple-600">{payouts.length}</p>
          </div>
        </div>
      )}

      {payouts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No payouts yet. Complete course enrollments to earn money.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Payout ID</th>
                <th className="text-left py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Period</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((payout) => (
                <tr key={payout.payoutId} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-sm">{payout.payoutId.substring(0, 8)}...</td>
                  <td className="py-3 px-4 font-semibold">
                    ${payout.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {new Date(payout.payoutPeriodStart).toLocaleDateString()} - {new Date(payout.payoutPeriodEnd).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusBadgeColor(payout.status)}`}>
                      {payout.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {new Date(payout.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
