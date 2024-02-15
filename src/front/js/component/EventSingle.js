// EventSingle.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EventSingle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/event/${id}`)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                setEvent(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error fetching event details:", error);
                setError(error.message);
                setIsLoading(false);
            });
    }, [id]);

    const handleBuyTicketsClick = () => {
        navigate('/payment', { state: { event } });
    };

    if (isLoading) return <div>Loading event details...</div>;
    if (error) return <div>Error loading event details: {error}</div>;

    return (
        <div className="container event-single">
            {/* Event details */}
            <button className="btn btn-primary" onClick={handleBuyTicketsClick}>Buy Tickets Now</button>
        </div>
    );
};

export default EventSingle;
