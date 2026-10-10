import { useEffect, useState } from "react";

function CountdownTimer({ date }) {
  const [remaining, setRemaining] = useState(() => Math.max(0, new Date(date).getTime() - Date.now()));

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setRemaining(Math.max(0, new Date(date).getTime() - Date.now()));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [date]);

  const seconds = Math.floor(remaining / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainderSeconds = seconds % 60;

  if (remaining === 0) return <p className="countdown">⏳ Event started or ended</p>;

  return (
    <p className="countdown">
      ⏳ {days}d {String(hours).padStart(2, "0")}h {String(minutes).padStart(2, "0")}m {String(remainderSeconds).padStart(2, "0")}s
    </p>
  );
}

export default CountdownTimer;
