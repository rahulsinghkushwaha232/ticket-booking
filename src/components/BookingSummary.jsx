import { useNavigate } from "react-router-dom";

function BookingSummary({ event, seats, pricing, booking }) {
  const navigate = useNavigate();
  const formatPrice = (price) => `₹${price.toLocaleString("en-IN")}`;

  function proceedToPayment() {
    if (seats.length === 0) return;
    try {
      sessionStorage.setItem("pendingBooking", JSON.stringify(booking));
    } catch (error) {
      console.error("Unable to save pending booking to sessionStorage.", error);
    }
    navigate("/payment", { state: booking });
  }

  return (
    <aside className="glass-panel booking-summary">
      <h2>🧾 Booking Summary</h2>
      <dl className="booking-summary-details">
        <div><dt>Event</dt><dd>{event.name}</dd></div>
        <div><dt>Venue</dt><dd>{event.venue}</dd></div>
        <div><dt>Seats</dt><dd>{seats.length ? seats.map((seat) => seat.label).join(", ") : "None selected"}</dd></div>
      </dl>
      <div className="summary-total">
        <span>Total</span>
        <strong>{formatPrice(pricing.total)}</strong>
      </div>
      <button className="button button-primary summary-payment-button" disabled={seats.length === 0} onClick={proceedToPayment} type="button">
        Proceed to Payment
      </button>
    </aside>
  );
}

export default BookingSummary;
