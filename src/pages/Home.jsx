import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import EventCard from "../components/EventCard.jsx";
import events from "../data/events.js";

function Home() {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return events;

    return events.filter((event) => (
      event.name.toLowerCase().includes(query) || event.venue.toLowerCase().includes(query)
    ));
  }, [search]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setIsLoading(false), 400);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (location.hash === "#events") {
      document.getElementById("events")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.hash]);

  return (
    <main className="page-shell home-page">
      <section className="home-intro">
        <h1><span className="home-heading-icon" aria-hidden="true">🎟️</span> Event Booking</h1>
        <label className="search-field">
          <span className="visually-hidden">Search events by name or venue</span>
          <span className="search-icon" aria-hidden="true">⌕</span>
          <input
            type="search"
            placeholder="Search events..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
      </section>
      <section className="events-section" id="events" aria-label="Available events">
        {isLoading ? (
          <div className="events-grid event-skeleton-grid" aria-label="Loading events" aria-live="polite">
            {Array.from({ length: 10 }, (_, index) => (
              <div className="event-skeleton" key={index}>
                <span className="skeleton-image" />
                <span className="skeleton-line skeleton-title" />
                <span className="skeleton-line skeleton-detail" />
                <span className="skeleton-button" />
              </div>
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="events-grid">
            {filteredEvents.map((event) => <EventCard event={event} key={event.id} />)}
          </div>
        ) : (
          <div className="empty-state">
            <span aria-hidden="true">🔎</span>
            <h3>No events found</h3>
            <p>Try a different event name or venue.</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default Home;
