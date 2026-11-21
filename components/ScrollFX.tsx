"use client";

import { useEffect, useRef } from "react";

const clamp = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Scroll-linked motion. Every `[data-fx]` element gets `--e` (0 → 1 as it enters the screen),
 * `[data-fx-t]` gets `--t` (0 → 1 as it travels up the screen), the hero gets `--h` (0 → 1 as you scroll past it), and an ochre bar shows how far down the page you are.
 * The CSS decides what each value moves. With reduced motion nothing runs and everything stays in place.
 */
export default function ScrollFX() {
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-fx]"));
    const through = Array.from(document.querySelectorAll<HTMLElement>("[data-fx-t]"));
    const hero = document.querySelector<HTMLElement>(".hero");
    let frame = 0;

    const run = () => {
      frame = 0;
      const vh = window.innerHeight;
      for (const el of els) {
        const top = el.getBoundingClientRect().top;
        el.style.setProperty("--e", clamp((vh * 0.95 - top) / (vh * 0.55)).toFixed(3));
      }
      for (const el of through) {
        const top = el.getBoundingClientRect().top;
        el.style.setProperty("--t", clamp((vh * 0.85 - top) / (vh * 0.65)).toFixed(3));
      }
      if (hero) hero.style.setProperty("--h", clamp(window.scrollY / hero.offsetHeight).toFixed(3));
      const room = document.documentElement.scrollHeight - vh;
      if (bar.current) {
        bar.current.style.transform = `scaleX(${room > 0 ? clamp(window.scrollY / room) : 0})`;
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(run);
    };

    run();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("load", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("load", schedule);
    };
  }, []);

  return <span ref={bar} className="progress" aria-hidden="true" />;
}
