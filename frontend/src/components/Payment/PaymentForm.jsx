import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { processPayment, confirmPayment } from '../../services/api';
import { toast } from 'react-hot-toast';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_your_stripe_key_here');

function PaymentFormContent({ courseId, amount, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [paymentId, setPaymentId] = useState(null);

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error('Stripe is not loaded');
      return;
    }

    setLoading(true);

    try {
      // Get card element
      const cardElement = elements.getElement(CardElement);

      // Create payment method
      const { error: methodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (methodError) {
        toast.error(methodError.message);
        setLoading(false);
        return;
      }

      // Initiate payment
      const initiateResponse = await processPayment(amount, courseId);
      const id = initiateResponse.data.paymentId;
      setPaymentId(id);

      // Create setup intent for card confirmation
      const { error, setupIntent } = await stripe.confirmCardSetup(
        initiateResponse.data.clientSecret,
        {
          payment_method: paymentMethod.id,
        }
      );

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      // Confirm payment
      await confirmPayment(id);
      toast.success('Payment processed successfully!');
      onSuccess && onSuccess(id);

    } catch (error) {
      toast.error('Payment failed: ' + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Card Details</label>
        <div className="border rounded-md p-4 bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#fa755a',
                },
              },
            }}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <div>
          <p className="text-sm text-gray-600">Course ID</p>
          <p className="font-semibold">{courseId}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Amount</p>
          <p className="text-2xl font-bold text-blue-600">${amount.toFixed(2)}</p>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

export default function PaymentForm({ courseId, amount, onSuccess }) {
  return (
    <div className="payment-form">
      <Elements stripe={stripePromise}>
        <PaymentFormContent courseId={courseId} amount={amount} onSuccess={onSuccess} />
      </Elements>
    </div>
  );
}
