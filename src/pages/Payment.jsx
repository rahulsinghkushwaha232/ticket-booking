import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { findMatchingTicket, getSavedTickets, getSeatLabel, saveTickets } from "../data/tickets.js";

function isBooking(value) {
  return Boolean(
    value
    && value.eventId
    && value.name
    && value.venue
    && value.date
    && Array.isArray(value.seats)
    && value.seats.length > 0,
  );
}

function getPendingBooking() {
  try {
    const booking = JSON.parse(window.sessionStorage.getItem("pendingBooking") || "null");
    return isBooking(booking) ? booking : null;
  } catch (error) {
    console.error("Unable to read pending booking from sessionStorage.", error);
    return null;
  }
}

function formatPrice(price) {
  return `₹${Number(price || 0).toLocaleString("en-IN")}`;
}

function formatDate(date) {
  return new Date(date).toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" });
}

function createBookingId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const values = new Uint32Array(6);
  if (window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(values);
    return `TH-${Array.from(values, (value) => chars[value % chars.length]).join("")}`;
  }
  return `TH-${Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")}`;
}

function validateForm(form) {
  const errors = {};
  const name = form.name.trim();
  const email = form.email.trim();
  const phone = form.phone.trim();

  if (!name) errors.name = "Enter your full name.";
  if (!email) errors.email = "Enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";
  if (!/^\d{10}$/.test(phone)) errors.phone = "Enter a 10 digit phone number.";
  if (!form.paymentMethod) errors.paymentMethod = "Choose a payment method.";

  return errors;
}

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [booking] = useState(() => (
    isBooking(location.state) ? location.state : getPendingBooking()
  ));
  const [form, setForm] = useState({ name: "", email: "", phone: "", paymentMethod: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState(() => findMatchingTicket(getSavedTickets(), booking));
  const [paymentError, setPaymentError] = useState("");
  const [pendingClearWarning, setPendingClearWarning] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const paymentTimeout = useRef(null);
  const formattedSeats = useMemo(
    () => booking?.seats.map(getSeatLabel).join(", ") ?? "",
    [booking],
  );

  useEffect(() => {
    if (!booking) navigate("/", { replace: true });
  }, [booking, navigate]);

  useEffect(() => () => window.clearTimeout(paymentTimeout.current), []);

  function updateField(event) {
    const { name, value } = event.target;
    const nextForm = { ...form, [name]: value };
    setForm(nextForm);
    if (hasAttemptedSubmit) setErrors(validateForm(nextForm));
    setPaymentError("");
  }

  function saveSuccessTicket() {
    const existingTicket = findMatchingTicket(getSavedTickets(), booking);
    if (existingTicket) {
      setTicket(existingTicket);
      setPaymentError("This booking has already been paid.");
      return;
    }

    const newTicket = {
      bookingId: createBookingId(),
      eventId: booking.eventId,
      name: booking.name,
      venue: booking.venue,
      date: booking.date,
      seats: booking.seats,
      total: booking.total,
      customer: {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        paymentMethod: form.paymentMethod,
      },
      createdAt: new Date().toISOString(),
    };
    const savedTickets = getSavedTickets();

    if (!saveTickets([...savedTickets, newTicket])) {
      setPaymentError("We could not save your ticket. Please try again.");
      return;
    }

    try {
      window.sessionStorage.removeItem("pendingBooking");
    } catch (error) {
      console.error("Unable to clear pending booking from sessionStorage.", error);
      setPendingClearWarning(true);
    }

    setTicket(newTicket);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (ticket || loading) return;

    const nextErrors = validateForm(form);
    setErrors(nextErrors);
    setHasAttemptedSubmit(true);
    setPaymentError("");

    if (Object.keys(nextErrors).length > 0) return;

    const existingTicket = findMatchingTicket(getSavedTickets(), booking);
    if (existingTicket) {
      setTicket(existingTicket);
      setPaymentError("This booking has already been paid.");
      return;
    }

    setLoading(true);
    paymentTimeout.current = window.setTimeout(() => {
      setLoading(false);
      saveSuccessTicket();
    }, 1500);
  }

  if (!booking) return null;

  if (ticket) {
    const customerName = typeof ticket.customer === "string" ? ticket.customer : ticket.customer?.name;

    return (
      <main className="page-shell payment-page">
        <section className="payment-success">
          <p className="eyebrow">You&apos;re all set</p>
          <h1>Booking confirmed!</h1>
          <p className="payment-success-copy">Your ticket is ready. We can&apos;t wait to see you there.</p>
          {paymentError && <p className="payment-notice" role="status">{paymentError}</p>}
          {pendingClearWarning && <p className="payment-notice" role="status">Your ticket is saved, but the pending booking could not be cleared.</p>}
          <article className="ticket-print-area">
            <div className="ticket-card">
              <div className="ticket-card-header">
                <span className="ticket-brand">🎟️ TicketHub</span>
                <span className="ticket-status">CONFIRMED</span>
              </div>
              <div className="ticket-card-body">
                <p className="eyebrow">Your event ticket</p>
                <h2>{ticket.name}</h2>
                <dl className="ticket-details">
                  <div><dt>Venue</dt><dd>{ticket.venue}</dd></div>
                  <div><dt>Date</dt><dd>{formatDate(ticket.date)}</dd></div>
                  <div><dt>Seats</dt><dd>{ticket.seats.map(getSeatLabel).join(", ")}</dd></div>
                  <div><dt>Name</dt><dd>{customerName}</dd></div>
                </dl>
              </div>
              <div className="ticket-card-footer">
                <div><span>Booking ID</span><strong>{ticket.bookingId}</strong></div>
                <div><span>Total paid</span><strong>{formatPrice(ticket.total)}</strong></div>
              </div>
            </div>
          </article>
          <div className="ticket-actions">
            <button className="button button-primary" onClick={() => window.print()} type="button">
              Download / Print ticket
            </button>
            <Link className="button button-secondary" to="/tickets">View My Tickets</Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell payment-page">
      <div className="payment-layout">
        <section className="glass-panel payment-form-panel">
          <p className="eyebrow">Secure your spot</p>
          <h1>Complete your booking</h1>
          <p className="demo-payment-note">Demo payment, no real money is charged</p>
          {paymentError && <p className="form-error form-error-global" role="alert">{paymentError}</p>}
          <form noValidate onSubmit={handleSubmit}>
            <label className="form-field">
              <span>Full name</span>
              <input autoComplete="name" disabled={loading} name="name" onChange={updateField} value={form.name} />
              {errors.name && <small className="form-error">{errors.name}</small>}
            </label>
            <label className="form-field">
              <span>Email</span>
              <input autoComplete="email" disabled={loading} name="email" onChange={updateField} type="email" value={form.email} />
              {errors.email && <small className="form-error">{errors.email}</small>}
            </label>
            <label className="form-field">
              <span>10 digit phone</span>
              <input autoComplete="tel" disabled={loading} inputMode="numeric" maxLength={10} name="phone" onChange={updateField} type="tel" value={form.phone} />
              {errors.phone && <small className="form-error">{errors.phone}</small>}
            </label>
            <fieldset className="payment-method-field">
              <legend>Payment method</legend>
              {["UPI", "Card", "Net Banking"].map((method) => (
                <label className="payment-method-option" key={method}>
                  <input
                    checked={form.paymentMethod === method}
                    disabled={loading}
                    name="paymentMethod"
                    onChange={updateField}
                    type="radio"
                    value={method}
                  />
                  <span>{method}</span>
                </label>
              ))}
              {errors.paymentMethod && <small className="form-error">{errors.paymentMethod}</small>}
            </fieldset>
            <button className="button button-primary payment-submit" disabled={loading || Boolean(ticket)} type="submit">
              {loading ? <><span className="loading-spinner" aria-hidden="true" />Processing payment...</> : "Pay"}
            </button>
          </form>
        </section>
        <aside className="glass-panel order-summary">
          <h2>Order summary</h2>
          <h3>{booking.name}</h3>
          <p>{booking.venue}</p>
          <p>{formatDate(booking.date)}</p>
          <div className="order-summary-seats">
            <span>Seats</span>
            <strong>{formattedSeats}</strong>
          </div>
          <div className="order-summary-total">
            <span>Total</span>
            <strong>{formatPrice(booking.total)}</strong>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default Payment;
