import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import BookingSummary from "../components/BookingSummary.jsx";
import CountdownTimer from "../components/CountdownTimer.jsx";
import PricingPanel, { calculatePricing } from "../components/PricingPanel.jsx";
import SeatMap, { getBookedSeatNumbers } from "../components/SeatMap.jsx";
import events from "../data/events.js";

function getSavedBooking(eventId) {
  try {
    const booking = JSON.parse(window.sessionStorage.getItem("pendingBooking") || "null");
    return booking && Number(booking.eventId) === Number(eventId) && Array.isArray(booking.seats)
      ? booking.seats
      : [];
  } catch (error) {
    console.error("Unable to restore pending booking from sessionStorage.", error);
    return [];
  }
}

function Booking() {
  const { id } = useParams();
  const event = events.find((item) => item.id === Number(id));
  const [seatSelection, setSeatSelection] = useState(() => ({ eventId: id, seats: getSavedBooking(id) }));
  const [now, setNow] = useState(Date.now);
  const selectedSeats = seatSelection.eventId === id ? seatSelection.seats : getSavedBooking(id);
  const bookedCount = useMemo(() => getBookedSeatNumbers(id).size, [id]);

  useEffect(() => {
    const timerId = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timerId);
  }, []);

  useEffect(() => {
    setSeatSelection({ eventId: id, seats: getSavedBooking(id) });
  }, [id]);

  const pricing = useMemo(() => event ? calculatePricing({
    eventPrice: event.price,
    seats: selectedSeats,
    bookedCount,
    date: event.date,
    now,
  }) : null, [event, selectedSeats, bookedCount, now]);
  const booking = useMemo(() => event && pricing ? {
    eventId: event.id,
    name: event.name,
    venue: event.venue,
    date: event.date,
    seats: selectedSeats,
    subtotal: pricing.subtotal,
    demandSurge: pricing.demandSurge,
    timeSurge: pricing.timeSurge,
    total: pricing.total,
  } : null, [event, selectedSeats, pricing]);

  useEffect(() => {
    if (!booking) return;
    try {
      window.sessionStorage.setItem("pendingBooking", JSON.stringify(booking));
    } catch (error) {
      console.error("Unable to save pending booking to sessionStorage.", error);
    }
  }, [booking]);

  if (!event) {
    return (
      <main className="page-shell">
        <section className="glass-panel message-panel">
          <p className="eyebrow">Oops, that ticket got away</p>
          <h1>Event not found</h1>
          <p>We couldn&apos;t find that event. Browse all events to find your next experience.</p>
          <Link className="button button-primary" to="/#events">Back to events</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="booking-flow">
        <h1>{event.name}</h1>
        <CountdownTimer date={event.date} />
        <h2>Select Your Seats</h2>
        <SeatMap
          eventId={event.id}
          selectedSeats={selectedSeats}
          onChange={(seats) => setSeatSelection({ eventId: id, seats })}
        />
        <PricingPanel pricing={pricing} seatCount={selectedSeats.length} eventPrice={event.price} />
        <BookingSummary event={event} seats={selectedSeats} pricing={pricing} booking={booking} />
      </section>
    </main>
  );
}

export default Booking;
