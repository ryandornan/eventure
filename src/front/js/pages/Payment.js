// Payment.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../component/CheckoutForm'; // Adjust the import path as necessary
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK);

const Payment = () => {
    const location = useLocation();
    const { event } = location.state;

    return (
        <div>
            <h1>Checkout</h1>
            <Elements stripe={stripePromise}>
                <CheckoutForm event={event} />
            </Elements>
        </div>
    );
};

export default Payment;
