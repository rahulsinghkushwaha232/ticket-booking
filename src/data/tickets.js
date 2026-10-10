export const TICKETS_UPDATED_EVENT = "tickethub:tickets-updated";

export function getSavedTickets() {
  try {
    const tickets = JSON.parse(window.localStorage.getItem("tickets") || "[]");
    return Array.isArray(tickets) ? tickets : [];
  } catch (error) {
    console.error("Unable to read tickets from localStorage.", error);
    return [];
  }
}

export function saveTickets(tickets) {
  try {
    window.localStorage.setItem("tickets", JSON.stringify(tickets));
    window.dispatchEvent(new Event(TICKETS_UPDATED_EVENT));
    return true;
  } catch (error) {
    console.error("Unable to save tickets to localStorage.", error);
    return false;
  }
}

export function getSeatLabel(seat) {
  if (typeof seat === "string") return seat;
  if (typeof seat === "number") return String(seat);
  return seat?.label ?? seat?.seat ?? String(seat?.number ?? seat?.seatNumber ?? "");
}

export function hasSameSeats(firstSeats, secondSeats) {
  if (!Array.isArray(firstSeats) || !Array.isArray(secondSeats) || firstSeats.length !== secondSeats.length) {
    return false;
  }

  const first = firstSeats.map(getSeatLabel).sort();
  const second = secondSeats.map(getSeatLabel).sort();
  return first.every((seat, index) => seat === second[index]);
}

export function findMatchingTicket(tickets, booking) {
  if (!booking || !Array.isArray(booking.seats)) return null;
  return tickets.find((ticket) => (
    Number(ticket.eventId) === Number(booking.eventId)
    && hasSameSeats(ticket.seats, booking.seats)
  )) ?? null;
}
