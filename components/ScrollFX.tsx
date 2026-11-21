"use client";

import { useEffect, useRef } from "react";

const clamp = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Scroll-linked motion. Every `[data-fx]` element gets `--e` (0 → 1 as it enters the screen),
 * `[data-fx-t]` gets `--t` (0 → 1 as it travels up the screen), the hero gets `--h` (0 → 1 as you scroll past it), and an ochre bar shows how far down the page you are.
 * The CSS decides what each value moves. With reduced motion the CSS keeps only reveals, fills and colour, and drops the big movements.
 */
export default function ScrollFX() {
  const bar = useRef<HTMLSpanElement>(null);

  // Safari tints its bars (top, bottom, or the side bar of the iPhone Duo) with the page's theme colour.
  // Keep that colour equal to the section under the top edge, so the page always reads edge to edge.
  useEffect(() => {
    const meta =
      document.querySelector<HTMLMetaElement>('meta[name="theme-color"]') ??
      document.head.appendChild(Object.assign(document.createElement("meta"), { name: "theme-color" }));
    let last = "";
    let frame = 0;

    const solid = (el: Element | null): string => {
      for (let n = el; n; n = n.parentElement) {
        const bg = getComputedStyle(n).backgroundColor;
        if (bg && bg !== "transparent" && !/rgba\(.*,\s*0\)$/.test(bg)) return bg;
      }
      return getComputedStyle(document.body).backgroundColor;
    };

    const paint = () => {
      frame = 0;
      const el = document.elementFromPoint(Math.min(24, window.innerWidth / 2), 2);
      const color = solid(el);
      if (color !== last) {
        last = color;
        meta.content = color;
        document.documentElement.style.backgroundColor = color;
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  // Runs with "Reduce Motion" on too: the CSS then keeps the reveals and drops the big movements.
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-fx]"));
    const through = Array.from(document.querySelectorAll<HTMLElement>("[data-fx-t]"));
    const hero = document.querySelector<HTMLElement>(".hero");
    let frame = 0;

    const run = () => {
      frame = 0;
      const vh = window.innerHeight;
      const room = Math.max(0, document.documentElement.scrollHeight - vh);
      for (const el of els) {
        const top = el.getBoundingClientRect().top;
        // An element near the end of the page can never climb to 40% of the screen,
        // so its entrance finishes where it stops when the page is scrolled to the bottom.
        const lowest = top + (room - window.scrollY);
        const end = Math.max(vh * 0.4, lowest);
        const start = Math.max(vh * 0.95, end + 1);
        el.style.setProperty("--e", clamp((start - top) / (start - end)).toFixed(3));
      }
      for (const el of through) {
        const top = el.getBoundingClientRect().top;
        el.style.setProperty("--t", clamp((vh * 0.85 - top) / (vh * 0.65)).toFixed(3));
      }
      if (hero) hero.style.setProperty("--h", clamp(window.scrollY / hero.offsetHeight).toFixed(3));
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
