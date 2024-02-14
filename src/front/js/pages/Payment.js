import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../component/CheckoutForm';
import { loadStripe } from '@stripe/stripe-js';

const Payment = () => {
  const location = useLocation();
  const { event } = location.state; // Assume this is passed from the EventSingle component or wherever you navigate from
  const [stripePromise, setStripePromise] = useState(loadStripe("pk_test_f3duw0VsAEM2TJFMtWQ90QAT")); // Use your publishable key here

  // No need to check for clientSecret here anymore
  // Directly ensure Stripe is loaded with your publishable key
  useEffect(() => {
    setStripePromise(loadStripe("pk_test_f3duw0VsAEM2TJFMtWQ90QAT")); // Use your actual publishable key here
  }, []);

  // If stripePromise is not ready, show a loading message or spinner
  if (!stripePromise) {
    return <div>Loading Stripe...</div>;
  }

  return (
    <>
      <h1>Checkout</h1>
      <Elements stripe={stripePromise}>
        {/* Pass only the event details to CheckoutForm */}
        <CheckoutForm event={event} />
      </Elements>
    </>
  );
};

export default Payment;
