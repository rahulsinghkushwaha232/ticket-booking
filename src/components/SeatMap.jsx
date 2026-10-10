import { useEffect, useState } from "react";
import { TICKETS_UPDATED_EVENT } from "../data/tickets.js";

const rows = ["A", "B", "C", "D", "E"];
const MAX_SELECTED_SEATS = 6;

function getGeneratedBookedSeats(eventId) {
  let seed = Math.abs(Number(eventId)) || 1;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const seatNumbers = Array.from({ length: 40 }, (_, index) => index + 1);
  const bookedCount = 8 + Math.floor(random() * 3);

  for (let index = seatNumbers.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [seatNumbers[index], seatNumbers[swapIndex]] = [seatNumbers[swapIndex], seatNumbers[index]];
  }

  return seatNumbers.slice(0, bookedCount);
}

function getConfirmedTicketSeats(eventId) {
  try {
    const tickets = JSON.parse(window.localStorage.getItem("tickets") || "[]");
    if (!Array.isArray(tickets)) return [];

    return tickets
      .filter((ticket) => Number(ticket.eventId ?? ticket.id) === Number(eventId))
      .flatMap((ticket) => (Array.isArray(ticket.seats) ? ticket.seats : []))
      .map((seat) => {
        if (typeof seat === "number") return seat;
        if (typeof seat === "string") {
          const match = seat.match(/\d+/);
          return match ? Number(match[0]) : null;
        }
        const storedNumber = seat?.number ?? seat?.seatNumber;
        if (storedNumber !== undefined) return Number(storedNumber);
        const match = String(seat?.label ?? seat?.seat ?? "").match(/\d+/);
        return match ? Number(match[0]) : null;
      })
      .filter((number) => Number.isInteger(number) && number >= 1 && number <= 40);
  } catch (error) {
    console.error("Unable to read confirmed tickets from localStorage.", error);
    return [];
  }
}

export function getBookedSeatNumbers(eventId) {
  return new Set([
    ...getGeneratedBookedSeats(eventId),
    ...getConfirmedTicketSeats(eventId),
  ]);
}

function SeatMap({ eventId, selectedSeats, onChange }) {
  const [limitReached, setLimitReached] = useState(false);
  const [, setTicketRevision] = useState(0);
  const bookedSeatNumbers = getBookedSeatNumbers(eventId);
  const seatRows = rows.map((row, rowIndex) => ({
    row,
    seats: Array.from({ length: 8 }, (_, seatIndex) => {
      const number = rowIndex * 8 + seatIndex + 1;
      return {
        number,
        row,
        label: `${row}${number}`,
        tier: number <= 10 ? "VIP" : "Regular",
      };
    }),
  }));

  useEffect(() => {
    const updateBookedSeats = () => setTicketRevision((revision) => revision + 1);
    window.addEventListener(TICKETS_UPDATED_EVENT, updateBookedSeats);
    window.addEventListener("storage", updateBookedSeats);
    return () => {
      window.removeEventListener(TICKETS_UPDATED_EVENT, updateBookedSeats);
      window.removeEventListener("storage", updateBookedSeats);
    };
  }, []);

  function toggleSeat(seat) {
    const selected = selectedSeats.some((item) => item.number === seat.number);
    if (selected) {
      onChange(selectedSeats.filter((item) => item.number !== seat.number));
      setLimitReached(false);
      return;
    }

    if (selectedSeats.length >= MAX_SELECTED_SEATS) {
      setLimitReached(true);
      return;
    }

    onChange([...selectedSeats, seat]);
    setLimitReached(false);
  }

  return (
    <section className="seat-map-panel" aria-label="Choose seats">
      <div className="screen-bar">SCREEN THIS WAY</div>
      <div className="seat-map">
        {seatRows.map(({ row, seats }) => (
          <div className="seat-row" key={row}>
            <span className="seat-row-label">{row}</span>
            <div className="seat-row-buttons">
              {seats.map((seat) => {
                const booked = bookedSeatNumbers.has(seat.number);
                const selected = selectedSeats.some((item) => item.number === seat.number);
                const status = booked ? "booked" : selected ? "selected" : "available";

                return (
                  <button
                    aria-label={`Seat ${seat.number}, ${seat.tier}, ${status}`}
                    aria-pressed={selected}
                    className={`seat seat-${seat.tier.toLowerCase()}${selected ? " seat-selected" : ""}${booked ? " seat-booked" : ""}`}
                    disabled={booked}
                    key={seat.number}
                    onClick={() => toggleSeat(seat)}
                    type="button"
                  >
                    {seat.number}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="seat-legend" aria-label="Seat legend">
        <span><i className="legend-dot legend-vip" />VIP</span>
        <span><i className="legend-dot legend-regular" />Regular</span>
        <span><i className="legend-dot legend-selected" />Selected</span>
        <span><i className="legend-dot legend-booked" />Booked</span>
      </div>
      <p aria-live="polite" className="seat-selection-message">
        {limitReached ? "You can select up to 6 seats." : `${selectedSeats.length} of 6 seats selected`}
      </p>
    </section>
  );
}

export default SeatMap;
