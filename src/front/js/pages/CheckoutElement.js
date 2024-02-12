import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { event } = location.state || {};

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!event) {
      alert("Event details are missing.");
      return;
    }

    try {
      const { data } = await axios.post('/api/checkout', {
        email,
        quantity,
        event_id: event.id,
      });
      // Assuming data contains some clientSecret or similar for further payment processing
      console.log(data); // For debugging or further processing
      
      navigate('/success', { state: { message: "Checkout successful! Please complete your payment.", details: data } });
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Checkout failed. Please try again.");
    }
  };

  if (!event) {
    return <div>Loading event details...</div>;
  }

  return (
    <div>
      <h2>Checkout for {event.name}</h2>
      <form onSubmit={handleCheckout}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Quantity:</label>
          <input type="number" value={quantity} min="1" onChange={(e) => setQuantity(e.target.value)} required />
        </div>
        <button type="submit">Proceed to Payment</button>
      </form>
    </div>
  );
};

export default Checkout;
