"use client";

import { useEffect, useRef } from "react";

// Cúpula + tigela (Congresso Nacional) e rampa curva, com parallax do mouse e do scroll.
export default function HeroArt() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      el.style.setProperty("--mx", x.toFixed(3));
      el.style.setProperty("--my", y.toFixed(3));
    };
    const onScroll = () => {
      el.style.setProperty("--sy", String(window.scrollY));
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={ref} className="heroart" aria-hidden="true">
      <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
        <g className="layer l1">
          <circle cx="560" cy="250" r="120" className="sun" />
        </g>
        <g className="layer l2">
          <path d="M120 400 A150 150 0 0 1 420 400 Z" className="solid" />
          <path d="M440 400 A170 170 0 0 0 780 400 Z" className="solid alt" />
        </g>
        <g className="layer l3">
          <path
            d="M-20 470 C 160 380, 260 520, 420 450 S 700 380, 840 460"
            className="line draw"
          />
          <path
            d="M-20 500 C 180 420, 280 550, 440 480 S 720 420, 840 490"
            className="line draw d2"
          />
        </g>
        <g className="layer l4">
          <path d="M-20 560 C 200 500, 400 600, 840 520 L840 620 L-20 620 Z" className="ground" />
        </g>
      </svg>
    </div>
  );
}
