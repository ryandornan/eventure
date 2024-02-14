import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";


const EventSingle = () => {
    const { id } = useParams(); // Use `id` since your route parameter is `:id`
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${process.env.BACKEND_URL}/api/event/${id}`);
                const text = await response.text(); // Get response text
                try {
                    const data = JSON.parse(text); // Try to parse it as JSON
                    setEvent(data);
                } catch (err) {
                    // If parsing fails, log the text and throw an error
                    console.error("Failed to parse JSON:", text);
                    throw err;
                }
            } catch (error) {
                console.error("There was an error fetching the event data:", error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleBuyTicketsClick = () => {
        if (event) {
            navigate('/payment', { state: { event } });
        }
    };

    if (isLoading) {
        return <div>Loading event details...</div>;
    }

    if (error) {
        return <div>Error loading event details: {error}</div>;
    }

    return (
        <div className="container event-single d-flex justify-content-center align-items-center">
        {/* Left Column - Image */}
        <div className="col-md-5 image-container">
            <img src={event.image} className="img-fluid" alt="Event" />
        </div>

        {/* Right Column - Event Details */}
        <div className="col-md-6">
            <div className="mb-4">
                {/* Event Title */}
                <h3 className="mb-4">{event.name}</h3>

                {/* Event Description */}
                <p>{event.description}</p>
            </div>

            {/* Event Date */}
            <div className="d-flex align-items-center mb-3">
                <i className="fas fa-calendar-alt me-2"></i>
                <span>{event.date}</span>
            </div>

            {/* Event Location */}
            <div className="d-flex align-items-center mb-3">
                <i className="fas fa-map-marker-alt me-2"></i>
                <span>{event.location}</span>
            </div>

            {/* Ticket Price */}
            <div className="d-flex align-items-center mb-4">
                <i className="fas fa-ticket-alt me-2"></i>
                <span>Ticket Price: £{event.price}</span>
            </div>
            
            {/* Buy Tickets Button */}
            <button className="btn btn-primary custom-btn mt-2"   onClick={handleBuyTicketsClick}>Buy Tickets Now</button>
        </div>
    </div>
);
};
export default EventSingle;