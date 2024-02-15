import React, { useState, useEffect } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate(); // Initialize useNavigate
  const [clientSecret, setClientSecret] = useState('');
  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch the clientSecret from your backend
  useEffect(() => {
    fetch("/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Add any necessary data in the body, for example, the payment amount
      body: JSON.stringify({ amount: 1999 }), // Example amount in cents
    })
    .then(response => response.json())
    .then(data => {
      setClientSecret(data.clientSecret);
    })
    .catch(error => {
      console.error("Error fetching client secret:", error);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      // Ensure Stripe.js has loaded and clientSecret is set before proceeding
      console.error("Stripe.js has not loaded, or clientSecret is not set.");
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(PaymentElement),
        // Include any other payment method details here
      },
    });

    if (error) {
      setMessage(error.message);
      setIsProcessing(false);
    } else {
      // The payment has been processed!
      setMessage("Payment successful!");
      // Redirect to a success page after successful payment
      navigate('/payment-success'); // Replace '/payment-success' with your success route
      setIsProcessing(false);
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      {/* Conditionally render the PaymentElement only if clientSecret is available */}
      {clientSecret && <PaymentElement />}
      <button disabled={isProcessing || !stripe || !clientSecret} id="submit">
        <span id="button-text">
          {isProcessing ? "Processing..." : "Pay Now"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}