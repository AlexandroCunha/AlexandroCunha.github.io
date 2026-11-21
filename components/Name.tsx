"use client";

import { useEffect, useRef } from "react";

/**
 * The name, set huge. Its letters stretch and squeeze with the pointer
 * (or with the scroll on a touch screen), never wider than its normal width. It is the only thing on the page that moves by itself.
 */
export default function Name({ first, last }: { first: string; last: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const fine = window.matchMedia("(pointer: fine)").matches;
    let target = 0.45;
    let current = target;
    let frame = 0;

    const tick = () => {
      current += (target - current) * 0.12;
      el.style.setProperty("--wdth", String(Math.round(72 + current * 28)));
      frame = Math.abs(target - current) > 0.002 ? requestAnimationFrame(tick) : 0;
    };
    const go = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      target = e.clientX / window.innerWidth;
      go();
    };
    const onScroll = () => {
      target = Math.min(1, window.scrollY / (window.innerHeight * 0.9));
      go();
    };

    if (fine) window.addEventListener("pointermove", onMove);
    else window.addEventListener("scroll", onScroll, { passive: true });
    go();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <h1 ref={ref} className="name">
      <span>{first}</span>
      <span>{last}</span>
    </h1>
  );
}
