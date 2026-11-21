"use client";

import { useEffect, useState } from "react";

/** "Dublin, Ireland · 23:24": the local time where Alexandro works, so people know when he will reply. */
export default function Clock({ place, timeZone }: { place: string; timeZone: string }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-IE", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone });
    const tick = () => setTime(format.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  return (
    <p className="where">
      {place}
      {time && (
        <>
          {" · "}
          <time aria-label={`Local time ${time}`}>{time}</time>
        </>
      )}
    </p>
  );
}
