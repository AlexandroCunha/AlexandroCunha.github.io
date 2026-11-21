"use client";

import { useEffect, useRef } from "react";

const clamp = (n: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, n));

/** Height of one half-wave of the river, in pixels. The same on every section. */
const HALF_WAVE = 190;

/**
 * One stretch of river for a box of w x h pixels. It starts and ends at the same edge,
 * heading straight down, so stretches of different sections join with no kink,
 * and the waves keep the same size whatever the height of the section.
 */
function buildPath(w: number, h: number) {
  const amp = Math.max(8, w * 0.36);
  const right = w / 2 + amp;
  const left = w / 2 - amp;
  let halves = Math.max(2, Math.round(h / HALF_WAVE));
  if (halves % 2) halves += 1; // an even count ends on the side it started
  const step = h / halves;
  let d = `M${right.toFixed(1)} 0`;
  for (let i = 0; i < halves; i++) {
    const from = i % 2 === 0 ? right : left;
    const to = i % 2 === 0 ? left : right;
    const y = i * step;
    d += ` C${from.toFixed(1)} ${(y + step / 3).toFixed(1)} ${to.toFixed(1)} ${(y + (2 * step) / 3).toFixed(1)} ${to.toFixed(1)} ${(y + step).toFixed(1)}`;
  }
  return d;
}

/** x of the river at a given height y. The path only ever moves downward. */
function xAtY(path: SVGPathElement, y: number) {
  let lo = 0;
  let hi = path.getTotalLength();
  for (let i = 0; i < 18; i++) {
    const mid = (lo + hi) / 2;
    if (path.getPointAtLength(mid).y < y) lo = mid;
    else hi = mid;
  }
  return path.getPointAtLength(hi).x;
}

/**
 * Shapes the river for every `[data-bank]` and draws it as the page scrolls.
 * A yellow marker rides at the head of the water. Nothing else on the page moves.
 */
export default function River() {
  const dot = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const banks = Array.from(document.querySelectorAll<HTMLElement>("[data-bank]"));
    const paths = banks.map((b) => b.querySelector<SVGPathElement>(".flow-path"));
    const sizes = banks.map(() => ({ w: 1, h: 1 }));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;

    const layout = () => {
      banks.forEach((bank, i) => {
        const w = bank.clientWidth;
        const h = bank.clientHeight;
        if (!w || !h) return;
        sizes[i] = { w, h };
        const d = buildPath(w, h);
        bank.querySelectorAll("svg").forEach((s) => {
          s.setAttribute("viewBox", `0 0 ${w} ${h}`);
          s.setAttribute("preserveAspectRatio", "none");
        });
        bank.querySelectorAll("path").forEach((p) => p.setAttribute("d", d));
      });
    };

    if (reduce) {
      // Reduced motion: the river stays fully drawn (see the CSS), it only needs its shape.
      layout();
      const ro = new ResizeObserver(layout);
      banks.forEach((b) => ro.observe(b));
      return () => ro.disconnect();
    }

    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const room = document.documentElement.scrollHeight - vh;
      const done = room > 0 ? clamp(window.scrollY / room) : 1;
      // The waterline sinks from 40% to 100% of the screen, so the last stretch always finishes.
      const line = vh * (0.4 + 0.6 * done);

      let hx = 0;
      let hy = 0;
      let found = false;
      for (let i = 0; i < banks.length; i++) {
        const r = banks[i].getBoundingClientRect();
        const p = clamp((line - r.top) / r.height);
        banks[i].style.setProperty("--p", `${(p * 100).toFixed(2)}%`);
        const path = paths[i];
        if (path && p > 0 && p < 1) {
          const { w, h } = sizes[i];
          hx = r.left + (xAtY(path, p * h) / w) * r.width;
          hy = r.top + p * r.height;
          found = true;
        }
      }

      const el = dot.current;
      if (!el) return;
      if (found) {
        el.style.transform = `translate3d(${hx.toFixed(1)}px, ${hy.toFixed(1)}px, 0)`;
        el.style.opacity = "1";
      } else {
        el.style.opacity = "0";
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    layout();
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("load", schedule);
    const ro = new ResizeObserver(() => {
      layout();
      schedule();
    });
    banks.forEach((b) => ro.observe(b));
    ro.observe(document.body);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("load", schedule);
      ro.disconnect();
    };
  }, []);

  return <span ref={dot} className="river-dot" aria-hidden="true" />;
}
