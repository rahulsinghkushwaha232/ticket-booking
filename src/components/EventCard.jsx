import { useState } from "react";
import { Link } from "react-router-dom";

function EventCard({ event }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article className="event-card">
      {imageFailed ? (
        <div className="event-image-fallback" role="img" aria-label={event.name}>
          <span>{event.name}</span>
        </div>
      ) : (
        <img
          className="event-image"
          src={event.image}
          alt={event.name}
          onError={() => setImageFailed(true)}
        />
      )}
      <div className="event-card-content">
        <h2>{event.name}</h2>
        <p>📍 {event.venue}</p>
        <p>💰 From ₹{event.price.toLocaleString("en-IN")}</p>
        <div className="event-card-actions">
          <Link className="button button-primary card-book-button" to={`/booking/${event.id}`}>
            Book Now
          </Link>
        </div>
      </div>
    </article>
  );
}

export default EventCard;
