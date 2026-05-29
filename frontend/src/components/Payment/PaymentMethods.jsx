import React, { useState, useEffect } from 'react';
import { getPaymentMethods, saveCreditCard } from '../../services/api';
import { toast } from 'react-hot-toast';

export default function PaymentMethods() {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const response = await getPaymentMethods();
      setMethods(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch payment methods');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMethod = async (methodId) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      try {
        // TODO: Call delete API
        toast.success('Payment method deleted');
        fetchPaymentMethods();
      } catch (error) {
        toast.error('Failed to delete payment method');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading payment methods...</div>;
  }

  return (
    <div className="payment-methods">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Payment Methods</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Payment Method'}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 border rounded-md bg-gray-50">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Card Holder Name</label>
              <input
                type="text"
                className="w-full border rounded-md px-3 py-2"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Card Number</label>
              <input
                type="text"
                className="w-full border rounded-md px-3 py-2"
                placeholder="4111 1111 1111 1111"
                maxLength="19"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Expiry Date</label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">CVC</label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="123"
                  maxLength="4"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Save Card
            </button>
          </form>
        </div>
      )}

      {methods.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No payment methods saved. Add one to get started.
        </div>
      ) : (
        <div className="grid gap-4">
          {methods.map((method) => (
            <div key={method.paymentMethodId} className="border rounded-md p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">
                  {method.cardBrand} ending in {method.last4}
                </p>
                <p className="text-sm text-gray-600">
                  Expires {method.expiryMonth}/{method.expiryYear}
                </p>
                {method.isDefault && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded mt-1 inline-block">
                    Default
                  </span>
                )}
              </div>
              <button
                onClick={() => handleDeleteMethod(method.paymentMethodId)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
