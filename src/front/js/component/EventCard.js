import React from "react";
import { Link, useNavigate } from "react-router-dom";

export const EventCard = ({ imageUrl, event }) => {
  const navigate = useNavigate();

  const handleBuyTickets = () => {
    // Navigate to the checkout page and pass event details
    navigate('/create-payment-intent', { state: { event } });
  };

  return (
  
    <div className="card event-card" style={{ width: "18rem" }}>
      
      <img src={imageUrl} className="card-img-top" alt="Event Image" />

      <div className="event-card-body">
        <h5 className="event-card-title">{event.title}</h5>
        <p className="event-card-location">Location: {event.location}</p>
              <div className="d-flex justify-content-between event-card-info">
              <p>Tickets: £{event.price}</p>
             <p>Date: {event.date}</p>
              </div>    
              <div className="d-flex justify-content-between align-items-center">
                <Link to="#" className="btn btn-primary custom-btn">More info.</Link>
                <i class="fa-solid fa-heart"></i>
              </div>

      </div>
    </div>
  );
};