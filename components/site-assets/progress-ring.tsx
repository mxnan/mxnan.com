"use client";
import React, { useEffect, useRef } from "react";

const RADIUS = 20;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const ICON_UP = "M6 9l6 6 6-6";
const ICON_DOWN = "M6 15l6-6 6 6";

export function ProgressRing() {
  const circleRef = useRef<SVGCircleElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const isTopRef = useRef(true);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const circle = circleRef.current;
    if (!circle) return;

    circle.style.strokeDasharray = String(CIRCUMFERENCE);

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyMotionPref = () => {
      reducedMotionRef.current = mq.matches;
      circle.style.transition = mq.matches ? "none" : "stroke-dashoffset 200ms linear";
    };
    applyMotionPref();
    mq.addEventListener("change", applyMotionPref);

    const update = () => {
      rafRef.current = null;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const pct = scrollable > 0 ? doc.scrollTop / scrollable : 0;
      circle.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - pct));

      const top = pct < 0.5;
      if (top !== isTopRef.current) {
        isTopRef.current = top;
        pathRef.current?.setAttribute("d", top ? ICON_UP : ICON_DOWN);
        buttonRef.current?.setAttribute(
          "aria-label",
          top ? "Scroll to bottom" : "Scroll to top"
        );
      }
    };

    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      mq.removeEventListener("change", applyMotionPref);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  function handleToggle() {
    window.scrollTo({
      top: isTopRef.current ? document.documentElement.scrollHeight : 0,
      behavior: reducedMotionRef.current ? "auto" : "smooth",
    });
  }

  return (
    <div className="relative flex items-center justify-center">
      <svg width="42" height="42" viewBox="0 0 52 52" className="-rotate-90">
        <circle
          cx="26"
          cy="26"
          r={RADIUS}
          fill="none"
          className="stroke-primary/30"
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
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        aria-label="Scroll to bottom"
        className="fixed w-8 h-8 rounded-full text-on-primary flex items-center justify-center"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path ref={pathRef} d={ICON_UP} />
        </svg>
      </button>
    </div>
  );
}