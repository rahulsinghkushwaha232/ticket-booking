export function getSeatPrice(eventPrice, tier) {
  return tier === "VIP" ? Math.round(eventPrice * 1.5) : eventPrice;
}

export function calculatePricing({ eventPrice, seats, bookedCount, date, now = Date.now() }) {
  const subtotal = seats.reduce((sum, seat) => sum + getSeatPrice(eventPrice, seat.tier), 0);
  const bookedPercent = (bookedCount / 40) * 100;
  const demandSurge = bookedPercent < 30 ? 1 : bookedPercent < 50 ? 1.1 : bookedPercent <= 70 ? 1.2 : 1.5;
  const timeLeft = new Date(date).getTime() - now;
  const daysLeft = timeLeft / 86400000;
  const timeSurge = daysLeft > 30 ? 1 : daysLeft > 7 ? 1.1 : daysLeft >= 1 ? 1.2 : 1.3;

  return {
    subtotal,
    demandSurge,
    timeSurge,
    total: Math.round(subtotal * demandSurge * timeSurge),
  };
}

function PricingPanel({ pricing, seatCount, eventPrice }) {
  const formatPrice = (price) => `₹${price.toLocaleString("en-IN")}`;

  return (
    <div className="pricing-panel" aria-live="polite">
      <p className="pricing-seat-rate">Regular seat: {formatPrice(eventPrice)}</p>
      <p className="pricing-seat-rate">VIP seat: {formatPrice(Math.round(eventPrice * 1.5))} (1.5x)</p>
      <p>Seats: {seatCount}</p>
      <p>Subtotal: {formatPrice(pricing.subtotal)}</p>
      <p>Demand Surge: x{pricing.demandSurge}</p>
      <p>Time Surge: x{pricing.timeSurge}</p>
      <p className="pricing-total">Total: {formatPrice(pricing.total)}</p>
    </div>
  );
}

export default PricingPanel;
