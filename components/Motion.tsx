"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Site-wide motion controller (no animation library needed).
 *  - Scroll reveal: blocks below the fold fade and rise in, staggered, as they arrive.
 *    Content is only hidden after this runs, so the page is fully readable without JS.
 *  - Sets html[data-scrolled] for the header shadow and --sy for gentle parallax.
 *  - Optional gold reading-progress line.
 * Respects prefers-reduced-motion: nothing is hidden or moved.
 */
const SELECTOR = [
  "main h2",
  "main .eyebrow",
  "main .card",
  "main article",
  "main figure",
  "main table",
  "main dl",
  "main details",
  "main ol > li",
  "main [data-reveal]",
].join(",");

export function Motion({ progress = false }: { progress?: boolean }) {
  const pathname = usePathname();
  const bar = useRef<HTMLDivElement>(null);

  // Scroll state: header shadow, parallax offset, progress line.
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        root.dataset.scrolled = y > 8 ? "true" : "false";
        if (!reduce) root.style.setProperty("--sy", String(Math.round(y)));
        if (bar.current) {
          const max = root.scrollHeight - window.innerHeight;
          bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
        }
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Scroll reveal — re-armed on every route change.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const candidates = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));
    const targets = candidates.filter(
      (el) =>
        !el.closest(".print-area, .no-reveal, .enter") &&
        !el.parentElement?.closest(SELECTOR) && // animate a card, not every heading inside it
        !el.classList.contains("rv"),
    );

    // Only what is still below the fold; what is already on screen stays put.
    const fold = window.innerHeight * 0.92;
    const pending = targets.filter((el) => el.getBoundingClientRect().top > fold);
    pending.forEach((el) => el.classList.add("rv"));

    const io = new IntersectionObserver(
      (entries) => {
        entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
          .forEach((entry, i) => {
            const el = entry.target as HTMLElement;
            el.style.setProperty("--rv-delay", `${Math.min(i * 90, 540)}ms`);
            el.classList.add("rv-in");
            io.unobserve(el);
          });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 },
    );
    pending.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      // Never leave anything invisible if we leave mid-way.
      pending.forEach((el) => el.classList.add("rv-in"));
    };
  }, [pathname]);

  return progress ? <div ref={bar} aria-hidden="true" className="scroll-progress no-print" /> : null;
}
