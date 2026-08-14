"use client";

import React, { useEffect, useRef, useState } from "react";

const RADIUS = 20;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ProgressRing() {
  const circleRef = useRef<SVGCircleElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    const circle = circleRef.current;
    if (!circle) return;

    circle.style.strokeDasharray = String(CIRCUMFERENCE);

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const update = () => {
      rafRef.current = null;

      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const pct = scrollable > 0 ? doc.scrollTop / scrollable : 0;

      const offset = CIRCUMFERENCE * (1 - pct);
      circle.style.strokeDashoffset = String(offset);

      setIsTop((prev) => (pct < 0.5) !== prev ? pct < 0.5 : prev);
    };

    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(update);
    };

    circle.style.transition = prefersReduced
      ? "none"
      : "stroke-dashoffset 200ms linear";

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  function handleToggle() {
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? "auto"
      : "smooth";

    window.scrollTo({
      top: isTop ? document.documentElement.scrollHeight : 0,
      behavior,
    });
  }

  return (
    <div className="relative z-50 flex items-center justify-center">
      <svg width="42" height="42" viewBox="0 0 52 52" className="-rotate-90">
        <circle
          cx="26"
          cy="26"
          r={RADIUS}
          fill="none"
          stroke="var(--muted-foreground)"
          strokeWidth="1.5"
        />
        <circle
          ref={circleRef}
          cx="26"
          cy="26"
          r={RADIUS}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>

      <button
        type="button"
        onClick={handleToggle}
        aria-label={isTop ? "Scroll to bottom" : "Scroll to top"}
        className="absolute top-1 left-1 w-8 h-8 rounded-full text-on-primary flex items-center justify-center"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={isTop ? "M6 9l6 6 6-6" : "M6 15l6-6 6 6"} />
        </svg>
      </button>
    </div>
  );
}