"use client";

import { useEffect, useRef, useMemo } from "react";
import { motionValue, animate } from "motion";

const RING_SIZE = 32;
const DOT_SIZE = 6;
const DOT_HALF = DOT_SIZE / 2;

const RING_SPRING = { type: "spring" as const, stiffness: 260, damping: 26, mass: 0.4 };
const SIZE_SPRING = { type: "spring" as const, stiffness: 300, damping: 30, mass: 0.5 };
const DOT_SPRING = { type: "spring" as const, stiffness: 900, damping: 40, mass: 0.2 };

type CursorVariant = "default" | "pointer" | "text" | "blend" | "hidden" | "takeover";

interface CursorTarget {
  variant: CursorVariant;
  text?: string;
  magnetic?: boolean;
  el: HTMLElement;
}

function readCursorTarget(el: Element | null): CursorTarget | null {
  const node = el?.closest<HTMLElement>("[data-cursor]");
  if (!node) return null;
  return {
    variant: (node.dataset.cursor as CursorVariant) || "default",
    text: node.dataset.cursorText,
    magnetic: node.dataset.cursorMagnetic !== undefined,
    el: node,
  };
}

export function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  const state = useRef({
    variant: "default" as CursorVariant,
    magneticEl: null as HTMLElement | null,
    takeoverEl: null as HTMLElement | null,
    lastX: 0,
    lastY: 0,
    reduced: false,
  });

  const { ringX, ringY, ringW, ringH, dotX, dotY, scale, dotOpacity } = useMemo(
    () => ({
      ringX: motionValue(0),
      ringY: motionValue(0),
      ringW: motionValue(RING_SIZE),
      ringH: motionValue(RING_SIZE),
      dotX: motionValue(0),
      dotY: motionValue(0),
      scale: motionValue(1),
      dotOpacity: motionValue(0.9),
    }),
    []
  );

  // ─── Paint loop ─────────────────────────────────────────────────────────
  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    const paint = () => {
      const w = ringW.get();
      const h = ringH.get();
      ring.style.width = `${w}px`;
      ring.style.height = `${h}px`;
      ring.style.transform = `translate3d(${ringX.get() - w / 2}px, ${ringY.get() - h / 2}px, 0) scale(${scale.get()})`;
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
      scale.on("change", paint),
      dotOpacity.on("change", paint),
    ];
    return () => unsubs.forEach((u) => u());
  }, [ringX, ringY, ringW, ringH, dotX, dotY, scale, dotOpacity]);

  // ─── Interaction wiring ─────────────────────────────────────────────────
  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!ring || !dot || !label) return;

    if (window.matchMedia("(pointer: coarse)").matches) {
      ring.style.display = "none";
      dot.style.display = "none";
      return;
    }

    state.current.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sizeOpts = () => (state.current.reduced ? { duration: 0 } : SIZE_SPRING);
    const ringOpts = () => (state.current.reduced ? { duration: 0 } : RING_SPRING);
    const dotOpts = () => (state.current.reduced ? { duration: 0 } : DOT_SPRING);

    const snapToRect = (rect: DOMRect) => {
      animate(ringX, rect.left + rect.width / 2, ringOpts());
      animate(ringY, rect.top + rect.height / 2, ringOpts());
      animate(ringW, rect.width, sizeOpts());
      animate(ringH, rect.height, sizeOpts());
    };

    const enterTakeover = (el: HTMLElement) => {
      state.current.takeoverEl = el;
      const computed = getComputedStyle(el).borderRadius;
      ring.style.transition = "border-radius 200ms ease, background-color 200ms ease";
      ring.style.borderRadius = computed || "8px";
      ring.style.borderColor = "transparent";
      ring.style.backgroundColor = "var(--foreground)";
      ring.style.opacity = "0.12";
      animate(dotOpacity, 0, { duration: 0.15 });
      snapToRect(el.getBoundingClientRect());
    };

    const exitTakeover = () => {
      state.current.takeoverEl = null;
      ring.style.borderRadius = "9999px";
      ring.style.backgroundColor = "transparent";
      ring.style.borderColor = "var(--foreground)";
      ring.style.opacity = "0.9";
      animate(ringW, RING_SIZE, sizeOpts());
      animate(ringH, RING_SIZE, sizeOpts());
      animate(dotOpacity, 0.9, { duration: 0.15 });
    };

    const applyVariant = (target: CursorTarget | null) => {
      const variant = target?.variant ?? "default";
      const prevVariant = state.current.variant;
      state.current.variant = variant;

      if (prevVariant === "takeover" && variant !== "takeover") exitTakeover();

      label.textContent = target?.text ?? "";
      label.style.opacity = target?.text ? "1" : "0";

      if (variant === "takeover" && target) {
        enterTakeover(target.el);
        return;
      }

      if (variant === "blend") {
        ring.style.mixBlendMode = "lighten";
        ring.style.borderColor = "var(--muted-foreground)";
      } else {
        ring.style.mixBlendMode = "normal";
        ring.style.borderColor = "var(--foreground)";
      }

      ring.style.opacity = variant === "hidden" ? "0" : "0.9";
      dot.style.opacity = variant === "hidden" ? "0" : "0.9";

      const targetScale =
        variant === "hidden" ? 0.5 : target?.text ? 2.4 : variant === "pointer" ? 1.6 : variant === "text" ? 2 : 1;

      if (variant !== prevVariant || target?.text) {
        animate(scale, targetScale, ringOpts());
      }
    };

    const moveTo = (x: number, y: number) => {
      animate(dotX, x, dotOpts());
      animate(dotY, y, dotOpts());
      if (state.current.takeoverEl) return; // ring stays pinned to element bounds
      animate(ringX, x, ringOpts());
      animate(ringY, y, ringOpts());
    };

    const handlePointerMove = (e: PointerEvent) => {
      state.current.lastX = e.clientX;
      state.current.lastY = e.clientY;

      const magnet = state.current.magneticEl;
      if (magnet && !state.current.takeoverEl) {
        const rect = magnet.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const pull = 0.35;
        moveTo(cx + (e.clientX - cx) * pull, cy + (e.clientY - cy) * pull);
      } else {
        moveTo(e.clientX, e.clientY);
      }
    };

    const handlePointerOver = (e: PointerEvent) => {
      const target = readCursorTarget(e.target as Element);
      applyVariant(target);
      state.current.magneticEl = target?.magnetic ? target.el : null;
    };

    const handlePointerOut = (e: PointerEvent) => {
      const related = e.relatedTarget as Element | null;
      if (readCursorTarget(related)) return;
      applyVariant(null);
      state.current.magneticEl = null;
    };

    const handlePointerDown = () => {
      if (state.current.takeoverEl) return; // don't shrink the takeover shape on click
      animate(scale, scale.get() * 0.8, { duration: 0.12 });
    };
    const handlePointerUp = () =>
      applyVariant(readCursorTarget(document.elementFromPoint(state.current.lastX, state.current.lastY)));

    const hide = () => {
      ring.style.opacity = "0";
      dot.style.opacity = "0";
    };
    const show = () => {
      ring.style.opacity = state.current.variant === "hidden" ? "0" : "0.9";
      dot.style.opacity = state.current.variant === "hidden" ? "0" : "0.9";
    };

    // Lenis scrolls content under a stationary mouse — refresh hover + takeover rect
    let scrollRaf = 0;
    const handleScroll = () => {
      cancelAnimationFrame(scrollRaf);
      scrollRaf = requestAnimationFrame(() => {
        if (state.current.takeoverEl) {
          snapToRect(state.current.takeoverEl.getBoundingClientRect());
          return;
        }
        const el = document.elementFromPoint(state.current.lastX, state.current.lastY);
        applyVariant(readCursorTarget(el));
      });
    };

    const handleResize = () => {
      if (state.current.takeoverEl) snapToRect(state.current.takeoverEl.getBoundingClientRect());
    };

    document.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerover", handlePointerOver, { passive: true });
    document.addEventListener("pointerout", handlePointerOut, { passive: true });
    document.addEventListener("pointerdown", handlePointerDown, { passive: true });
    document.addEventListener("pointerup", handlePointerUp, { passive: true });
    document.addEventListener("mouseleave", hide);
    document.addEventListener("mouseenter", show);
    window.addEventListener("blur", hide);
    window.addEventListener("focus", show);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("pointerout", handlePointerOut);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("mouseleave", hide);
      document.removeEventListener("mouseenter", show);
      window.removeEventListener("blur", hide);
      window.removeEventListener("focus", show);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(scrollRaf);
    };
  }, [ringX, ringY, ringW, ringH, dotX, dotY, scale, dotOpacity]);

  return (
    <>
      <div
        ref={ringRef}
        className="fixed left-0 top-0 pointer-events-none z-[999] border-2 flex items-center justify-center"
        style={{
          width: RING_SIZE,
          height: RING_SIZE,
          borderRadius: "9999px",
          borderColor: "var(--foreground)",
          backgroundColor: "transparent",
          opacity: 0.9,
          willChange: "transform, width, height",
        }}
      >
        <span
          ref={labelRef}
          className="text-[9px] font-medium uppercase tracking-wide whitespace-nowrap"
          style={{ color: "var(--foreground)", opacity: 0, transition: "opacity 150ms" }}
        />
      </div>
      <div
        ref={dotRef}
        className="fixed left-0 top-0 pointer-events-none z-[999] rounded-full"
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