import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { getSavedTickets, TICKETS_UPDATED_EVENT } from "../data/tickets.js";

function Navbar() {
  const [ticketCount, setTicketCount] = useState(() => getSavedTickets().length);

  useEffect(() => {
    const updateTicketCount = () => setTicketCount(getSavedTickets().length);
    window.addEventListener(TICKETS_UPDATED_EVENT, updateTicketCount);
    window.addEventListener("storage", updateTicketCount);
    return () => {
      window.removeEventListener(TICKETS_UPDATED_EVENT, updateTicketCount);
      window.removeEventListener("storage", updateTicketCount);
    };
  }, []);

  return (
    <header className="navbar">
      <Link className="brand" to="/" aria-label="TicketHub home">
        <span className="brand-icon" aria-hidden="true">🎟️</span>
        <span>TicketHub</span>
      </Link>
      <nav className="nav-links" aria-label="Main navigation">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/#events">Events</NavLink>
        <NavLink to="/tickets" className="tickets-nav-link">
          My Tickets
          {ticketCount > 0 && <span className="tickets-badge">{ticketCount}</span>}
        </NavLink>
      </nav>
    </header>
  );
}

export default Navbar;
