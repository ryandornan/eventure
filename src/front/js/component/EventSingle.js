import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadStripe } from '@stripe/stripe-js';

// Your Stripe public key
const stripePromise = loadStripe('pk_test_51OcucnHQhMxwalDDbDv4n5CtxomCq5gjodiz1k8zg6VAvXS0GFgcBAfBO8Ro5UOc2fba7oRTAR2mrVEhhX8nvIuD00h05feQbA');

const EventSingle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${process.env.BACKEND_URL}/api/event/${id}`);
                const data = await response.json();
                setEvent(data);
            } catch (error) {
                console.error("Error fetching event details:", error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleBuyTicketsClick = async () => {
        const stripe = await stripePromise;
        const response = await fetch(`${process.env.BACKEND_URL}/api/create-checkout-session`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                eventId: event.id,
                // Add any other event data you need for the transaction
            }),
        });
        const session = await response.json();

        // Redirect to Stripe Checkout
        const result = await stripe.redirectToCheckout({
            sessionId: session.id,
        });

        if (result.error) {
            // Inform the user if there's an error.
            console.error(result.error.message);
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
            <div className="col-md-5 image-container">
                <img src={event.image} className="img-fluid" alt="Event" />
            </div>
            <div className="col-md-6">
                <div className="mb-4">
                    <h3 className="mb-4">{event.name}</h3>
                    <p>{event.description}</p>
                </div>
                <div className="d-flex align-items-center mb-3">
                    <i className="fas fa-calendar-alt me-2"></i>
                    <span>{event.date}</span>
                </div>
                <div className="d-flex align-items-center mb-3">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    <span>{event.location}</span>
                </div>
                <div className="d-flex align-items-center mb-4">
                    <i className="fas fa-ticket-alt me-2"></i>
                    <span>Ticket Price: £{event.price}</span>
                </div>
                <button className="btn btn-primary custom-btn mt-2" onClick={handleBuyTicketsClick}>Buy Tickets Now</button>
            </div>
        </div>
    );
};

export default EventSingle;
