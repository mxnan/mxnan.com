"use client";

import { useEffect, useRef, useMemo } from "react";
import { motionValue, animate } from "motion";

const RING_SIZE = 32;
const DOT_SIZE = 6;
const DOT_HALF = DOT_SIZE / 2;

const RING_SPRING = { type: "spring" as const, stiffness: 260, damping: 26, mass: 0.4 };
const SIZE_SPRING = { type: "spring" as const, stiffness: 320, damping: 28, mass: 0.4 };
const DOT_SPRING = { type: "spring" as const, stiffness: 900, damping: 40, mass: 0.2 };
const FADE = { duration: 0.12 };

type CursorVariant = "default" | "invert" | "takeover";

interface CursorTarget {
  variant: CursorVariant;
  el: HTMLElement;
}

function readCursorTarget(el: Element | null): CursorTarget | null {
  const node = el?.closest<HTMLElement>("[data-cursor]");
  if (!node) return null;
  const variant = node.dataset.cursor as CursorVariant;
  if (variant !== "invert" && variant !== "takeover") return null;
  return { variant, el: node };
}

export function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const state = useRef({
    variant: "default" as CursorVariant,
    activeEl: null as HTMLElement | null,
    lastX: 0,
    lastY: 0,
    reduced: false,
  });

  const { ringX, ringY, ringW, ringH, dotX, dotY, dotOpacity } = useMemo(
    () => ({
      ringX: motionValue(0),
      ringY: motionValue(0),
      ringW: motionValue(RING_SIZE),
      ringH: motionValue(RING_SIZE),
      dotX: motionValue(0),
      dotY: motionValue(0),
      dotOpacity: motionValue(0.9),
    }),
    []
  );

  // ─── Paint loop: one write path, batched per frame ─────────────────────
  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    const paint = () => {
      const w = ringW.get();
      const h = ringH.get();
      ring.style.width = `${w}px`;
      ring.style.height = `${h}px`;
      ring.style.transform = `translate3d(${ringX.get() - w / 2}px, ${ringY.get() - h / 2}px, 0)`;
      dot.style.transform = `translate3d(${dotX.get() - DOT_HALF}px, ${dotY.get() - DOT_HALF}px, 0)`;
      dot.style.opacity = `${dotOpacity.get()}`;
    };

    const unsubs = [
      ringX.on("change", paint),
      ringY.on("change", paint),
      ringW.on("change", paint),
      ringH.on("change", paint),
      dotX.on("change", paint),
      dotY.on("change", paint),
      dotOpacity.on("change", paint),
    ];
    return () => unsubs.forEach((u) => u());
  }, [ringX, ringY, ringW, ringH, dotX, dotY, dotOpacity]);

  // ─── Interaction wiring ─────────────────────────────────────────────────
  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    if (window.matchMedia("(pointer: coarse)").matches) {
      ring.style.display = "none";
      dot.style.display = "none";
      return;
    }

    state.current.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ringOpts = state.current.reduced ? { duration: 0 } : RING_SPRING;
    const sizeOpts = state.current.reduced ? { duration: 0 } : SIZE_SPRING;
    const dotOpts = state.current.reduced ? { duration: 0 } : DOT_SPRING;

    const snapToRect = (rect: DOMRect) => {
      animate(ringX, rect.left + rect.width / 2, ringOpts);
      animate(ringY, rect.top + rect.height / 2, ringOpts);
      animate(ringW, rect.width, sizeOpts);
      animate(ringH, rect.height, sizeOpts);
    };

    const setDefaultStyle = () => {
      ring.style.borderRadius = "9999px";
      ring.style.backgroundColor = "transparent";
      ring.style.borderColor = "var(--foreground)";
      ring.style.mixBlendMode = "normal";
      animate(ringW, RING_SIZE, sizeOpts);
      animate(ringH, RING_SIZE, sizeOpts);
      animate(dotOpacity, 0.9, FADE);
    };

    const setInvertStyle = () => {
      ring.style.borderRadius = "9999px";
      ring.style.backgroundColor = "white";
      ring.style.borderColor = "transparent";
      ring.style.mixBlendMode = "difference";
      animate(ringW, RING_SIZE, sizeOpts);
      animate(ringH, RING_SIZE, sizeOpts);
      animate(dotOpacity, 0, FADE);
    };

    const setTakeoverStyle = (el: HTMLElement) => {
      ring.style.borderRadius = getComputedStyle(el).borderRadius || "8px";
      ring.style.backgroundColor = "var(--foreground)";
      ring.style.borderColor = "transparent";
      ring.style.mixBlendMode = "normal";
      snapToRect(el.getBoundingClientRect());
      animate(dotOpacity, 0, FADE);
    };

    const applyTarget = (target: CursorTarget | null) => {
      const variant = target?.variant ?? "default";
      state.current.variant = variant;
      state.current.activeEl = variant === "takeover" ? target!.el : null;

      if (variant === "invert") setInvertStyle();
      else if (variant === "takeover") setTakeoverStyle(target!.el);
      else setDefaultStyle();
    };

    const moveTo = (x: number, y: number) => {
      animate(dotX, x, dotOpts);
      animate(dotY, y, dotOpts);
      if (state.current.activeEl) return; // ring pinned to element bounds in takeover
      animate(ringX, x, ringOpts);
      animate(ringY, y, ringOpts);
    };

    const handlePointerMove = (e: PointerEvent) => {
      state.current.lastX = e.clientX;
      state.current.lastY = e.clientY;
      moveTo(e.clientX, e.clientY);
    };

    const handlePointerOver = (e: PointerEvent) => applyTarget(readCursorTarget(e.target as Element));

    const handlePointerOut = (e: PointerEvent) => {
      if (readCursorTarget(e.relatedTarget as Element | null)) return;
      applyTarget(null);
    };

    const hide = () => {
      ring.style.opacity = "0";
      dot.style.opacity = "0";
    };
    const show = () => {
      ring.style.opacity = "0.9";
      dot.style.opacity = "0.9";
    };

    // Lenis scrolls content under a stationary mouse — resync hover + rect
    let raf = 0;
    const resync = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (state.current.activeEl) {
          snapToRect(state.current.activeEl.getBoundingClientRect());
          return;
        }
        applyTarget(readCursorTarget(document.elementFromPoint(state.current.lastX, state.current.lastY)));
      });
    };

    document.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerover", handlePointerOver, { passive: true });
    document.addEventListener("pointerout", handlePointerOut, { passive: true });
    document.addEventListener("mouseleave", hide);
    document.addEventListener("mouseenter", show);
    window.addEventListener("blur", hide);
    window.addEventListener("focus", show);
    window.addEventListener("scroll", resync, { passive: true });
    window.addEventListener("resize", resync, { passive: true });

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("pointerout", handlePointerOut);
      document.removeEventListener("mouseleave", hide);
      document.removeEventListener("mouseenter", show);
      window.removeEventListener("blur", hide);
      window.removeEventListener("focus", show);
      window.removeEventListener("scroll", resync);
      window.removeEventListener("resize", resync);
      cancelAnimationFrame(raf);
    };
  }, [ringX, ringY, ringW, ringH, dotX, dotY, dotOpacity]);

  return (
    <>
      <div
        ref={ringRef}
        className="fixed left-0 top-0 pointer-events-none z-999 border-2"
        style={{
          width: RING_SIZE,
          height: RING_SIZE,
          borderRadius: "9999px",
          borderColor: "var(--foreground)",
          backgroundColor: "transparent",
          opacity: 0.9,
          transition: "border-radius 180ms ease, background-color 180ms ease, border-color 180ms ease",
          willChange: "transform, width, height",
        }}
      />
      <div
        ref={dotRef}
        className="fixed left-0 top-0 pointer-events-none z-999 rounded-full"
        style={{
          width: DOT_SIZE,
          height: DOT_SIZE,
          backgroundColor: "var(--foreground)",
          opacity: 0.9,
          willChange: "transform",
        }}
      />
    </>
  );
}