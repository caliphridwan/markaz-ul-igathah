"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts a figure up from zero when it scrolls into view: "1,200+", "340", "₦430,000.00".
 * Prefix and suffix are kept; the server-rendered text is the final value, so it reads
 * correctly without JavaScript and for screen readers.
 */
export function CountUp({ value, duration = 1800, className }: { value: string; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState(value);

  useEffect(() => {
    const m = value.match(/^([^\d]*)([\d,]+)(.*)$/);
    const el = ref.current;
    if (!m || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const [, prefix, digits, suffix] = m;
    const target = parseInt(digits.replace(/,/g, ""), 10);
    const commas = digits.includes(",");
    const fmt = (n: number) => prefix + (commas ? n.toLocaleString("en-US") : String(n)) + suffix;
    if (!target) return;

    // Only animate if it starts off-screen or the page has just loaded.
    setText(fmt(0));
    let frame = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 4);
          setText(fmt(Math.round(target * eased)));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className} aria-label={value}>
      <span aria-hidden="true">{text}</span>
    </span>
  );
}
