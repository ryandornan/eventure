import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EventSingle = ({ eventId }) => {
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    // Replace '/api/event/1' with your actual API endpoint and use `eventId` as needed
    fetch(`/api/event/${eventId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setEvent(data);
      })
      .catch(error => console.error("Fetch error:", error));
  }, [eventId]); // Dependency array, re-run effect if `eventId` changes

  const handleBuyTickets = () => {
    if (event) {
      navigate('/checkout', { state: { event } });
    }
  };

  if (!event) {
    return <div>Loading event details...</div>;
  }
  // Function to handle the "Buy Tickets Now" button click
 

  return (
    <div className="container-full black-background">
      <div className="container event-single d-flex justify-content-center align-items-center">
        {/* Left Column - Image */}
        <div className="col-md-5 image-container">
          <img
            src={AboutImage}
            className="img-fluid"
            alt="About Image"
          />
        </div>

        {/* Right Column - Event Details */}
        
        <div className="col-md-6">
          <div className="mb-4">
            {/* Event Title */}
            <h3 className="mb-4">Event Title</h3>

            {/* Event Description */}
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vehicula dolor vitae rhoncus feugiat.
               Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vehicula dolor vitae rhoncus feugiat.
            </p>
            
          </div>

          {/* Event Date */}
          <div className="d-flex align-items-center mb-3">
            <i class="fas fa-calendar-alt"></i>
            <span>January 31, 2024</span>
          </div>

          {/* Event Location */}
          <div className="d-flex align-items-center mb-3">
            <i class="fa-solid fa-location-dot"></i>
            <span>Event Location</span>
          </div>

          {/* Ticket Price */}
          <div className="d-flex align-items-center mb-4">
            <i className="fa-solid fa-ticket"></i>
            <span>Ticket Price: £10.00</span>
          </div>

          {/* Buy Tickets Button */}
          <button className="btn btn-primary custom-btn mt-2" onClick={handleBuyTickets} >Buy Tickets Now</button>
          
          </div>
      </div>
    </div>
    
  );
};

export default EventSingle;
