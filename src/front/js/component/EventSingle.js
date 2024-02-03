// EventSingleTwo.js

import React, { useEffect } from 'react';
import AboutImage from '/workspaces/europe-fs-pt-14-ryandornan-mariahurtado/src/front/img/music/crowd-02.png';

const EventSingle = ({ eventId }) => {
  const [event, setEvent] = useState({
    eventName: '',
    eventDescription: '',
    eventDate: '',
    eventLocation: '',
    eventPrice: '',
  });

  useEffect(() => {
    // Fetch event details from the backend
    const fetchEventData = async () => {
      try {
        const response = await fetch(`your-backend-endpoint/api/events/${eventId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const eventData = await response.json();
        setEvent(eventData); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching event details: ", error);
      }
    };
    
    fetchEventData();
  }, [eventId]); // Fetch new event data when eventId changes

  return (
    <div className="container-full black-background">
      <div className="container event-single d-flex justify-content-center align-items-center">
        {/* Left Column - Image */}
        <div className="col-md-5 image-container">
          <img
            src={AboutImage}
            className="img-fluid"
            alt={event.eventName}

          />
        </div>

        {/* Right Column - Event Details */}
        
        <div className="col-md-6">
          <div className="mb-4">
            {/* Event Title */}
            <h3 className="mb-4">Event Title</h3>

            {/* Event Description */}
            <p> {event.eventDescription} </p>
            
          </div>

          {/* Event Date */}
          <div className="d-flex align-items-center mb-3">
            <i class="fas fa-calendar-alt"></i>
            <span>{event.eventDate}</span>
          </div>

          {/* Event Location */}
          <div className="d-flex align-items-center mb-3">
            <i class="fa-solid fa-location-dot"></i>
            <span>{event.eventLocation}</span>
          </div>

          {/* Ticket Price */}
          <div className="d-flex align-items-center mb-4">
            <i className="fa-solid fa-ticket"></i>
            <span>Ticket Price: {event.eventPrice}</span>
          </div>

          {/* Buy Tickets Button */}
          <button className="btn btn-primary custom-btn mt-2">Buy Tickets Now</button>
        </div>
      </div>
    </div>
  );
};

export default EventSingle;
