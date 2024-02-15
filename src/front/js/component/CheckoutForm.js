// CheckoutForm.js
import React, { useState, useEffect } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';

export default function CheckoutForm({ event }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState('');
  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Replace "/create-payment-intent" with your actual endpoint that expects event ID and returns clientSecret
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/create-payment-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId: event.id, amount: event.price }) // Assuming your event object has an id and price
    })
    .then(response => response.json())
    .then(data => setClientSecret(data.clientSecret))
    .catch(error => console.error("Error fetching client secret:", error));
  }, [event]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      console.error("Stripe.js has not loaded, or clientSecret is not set.");
      return;
    }

    setIsProcessing(true);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(PaymentElement) },
    });

    if (result.error) {
      setMessage(result.error.message);
      setIsProcessing(false);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        setMessage("Payment successful!");
        navigate('/payment-success'); // Navigate to a success page
        setIsProcessing(false);
      }
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      {clientSecret && <PaymentElement />}
      <button disabled={isProcessing || !stripe || !clientSecret}>Pay Now</button>
      {message && <div>{message}</div>}
    </form>
  );
}
