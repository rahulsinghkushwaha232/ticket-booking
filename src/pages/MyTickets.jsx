import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSavedTickets, getSeatLabel, saveTickets, TICKETS_UPDATED_EVENT } from "../data/tickets.js";

function formatPrice(price) {
  return `₹${Number(price || 0).toLocaleString("en-IN")}`;
}

function formatDate(date) {
  return new Date(date).toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" });
}

function MyTickets() {
  const [tickets, setTickets] = useState(getSavedTickets);
  const [toast, setToast] = useState("");
  const [storageError, setStorageError] = useState("");

  useEffect(() => {
    const updateTickets = () => setTickets(getSavedTickets());
    window.addEventListener(TICKETS_UPDATED_EVENT, updateTickets);
    window.addEventListener("storage", updateTickets);
    return () => {
      window.removeEventListener(TICKETS_UPDATED_EVENT, updateTickets);
      window.removeEventListener("storage", updateTickets);
    };
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timeoutId = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  function cancelTicket(ticket) {
    if (!window.confirm(`Cancel ticket ${ticket.bookingId}?`)) return;

    const currentTickets = getSavedTickets();
    const nextTickets = currentTickets.filter((item) => item.bookingId !== ticket.bookingId);
    if (!saveTickets(nextTickets)) {
      setStorageError("We could not cancel this ticket. Please try again.");
      return;
    }

    setTickets(nextTickets);
    setStorageError("");
    setToast("Ticket cancelled");
  }

  const sortedTickets = [...tickets].sort(
    (first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime(),
  );

  return (
    <main className="page-shell tickets-page">
      <div className="tickets-page-heading">
        <div>
          <p className="eyebrow">Your plans, all in one place</p>
          <h1>My Tickets</h1>
        </div>
        {tickets.length > 0 && <span className="ticket-count-pill">{tickets.length} {tickets.length === 1 ? "ticket" : "tickets"}</span>}
      </div>
      {storageError && <p className="form-error form-error-global" role="alert">{storageError}</p>}
      {sortedTickets.length > 0 ? (
        <div className="saved-tickets-list">
          {sortedTickets.map((ticket) => {
            const isPast = new Date(ticket.date).getTime() < Date.now();
            return (
              <article className="glass-panel saved-ticket-card" key={ticket.bookingId}>
                <div className="saved-ticket-heading">
                  <div>
                    <p className="ticket-booking-id">{ticket.bookingId}</p>
                    <h2>{ticket.name}</h2>
                  </div>
                  <span className={`ticket-status-pill${isPast ? " ticket-status-past" : ""}`}>
                    {isPast ? "Past event" : "Confirmed"}
                  </span>
                </div>
                <dl className="saved-ticket-details">
                  <div><dt>Venue</dt><dd>{ticket.venue}</dd></div>
                  <div><dt>Date</dt><dd>{formatDate(ticket.date)}</dd></div>
                  <div><dt>Seats</dt><dd>{ticket.seats.map(getSeatLabel).join(", ")}</dd></div>
                  <div><dt>Total</dt><dd>{formatPrice(ticket.total)}</dd></div>
                </dl>
                <button className="button button-cancel" onClick={() => cancelTicket(ticket)} type="button">
                  Cancel ticket
                </button>
              </article>
            );
          })}
        </div>
      ) : (
        <section className="glass-panel tickets-empty-state">
          <span aria-hidden="true">🎫</span>
          <h2>No tickets yet</h2>
          <p>Find an event and book a seat to make it yours.</p>
          <Link className="button button-primary" to="/#events">Browse events</Link>
        </section>
      )}
      {toast && <div className="ticket-toast" role="status">{toast}</div>}
    </main>
  );
}

export default MyTickets;
