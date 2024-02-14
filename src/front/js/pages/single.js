// Single.js
import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import EventSingle from "../component/EventSingle"; // Ensure this import path is correct
import PopularEventsTwo from "../sections/PopularEventsTwo";

const Single = () => {
    const { store, actions } = useContext(Context);
    const { id } = useParams(); // Destructure `id` directly from `useParams()`
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const eventData = await actions.fetchEvent(id);
                setEvent(eventData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching event data:", error);
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, [actions, id]); // Depend on `actions` and `id` to re-fetch when these values change

    if (loading) return <div>Loading event details...</div>;
    if (error) return <div>Error loading event.</div>;

    return (
        <div>
            <div className="container-full black-background">
                {event && <EventSingle event={event} />}
            </div>
            <PopularEventsTwo />
        </div>
    );
};

// Removed PropTypes validation as it might not be necessary unless you're passing props directly to `Single`

export default Single;
