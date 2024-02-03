import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from ".../store/appContext";

export const EventCard = ({ data }) => {
  const navigate = useNavigate();
  const { store, actions } = useContext(Context);

  return (
    <div className="card event-card" style={{ width: "18rem" }}>
      {/* Image change dynamiclly based on data*/}
      <img src={data.imageUrl} className="card-img-top" alt={data.title} />

      <div className="event-card-body">
      {/*Title and text change due passed data */}
        <h5 className="event-card-title">{data.eventTitle}</h5>
        <p className="event-card-text">{data.eventDescription}</p>

        <div className="d-flex justify-content-between">
          {/* Learn More button with dynamic navigation */}
          <button className="btn btn-primary custom-btn" onClick={() => navigate(data.singleEvent)}>
            Learn More!
          </button>
        
          {/* Favorite button with dynamic class based on favorite status */}
          <button className={`m-1 p-2 fa-heart heart ${actions.isFavorite(data.id) ? "fa-solid" : "fa-regular"}`}
            onClick={() => actions.toggleFavorite(data.id)}>
          </button>
          
           {/*not sure if this is needed*/}
        <Link to="#" className="btn btn-primary custom-btn">More info.</Link>
      </div>
    </div>
  </div>
  );
};
