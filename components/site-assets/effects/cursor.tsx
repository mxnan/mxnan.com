"use client";

import { useEffect, useRef, useMemo } from "react";
import { motionValue, animate } from "motion";

const RING_SIZE = 32;
const DOT_SIZE = 6;
const DOT_HALF = DOT_SIZE / 2;
const RING_BASE_OPACITY = 0.9;
const DOT_BASE_OPACITY = 0.9;

const RING_SPRING = {
  type: "spring" as const,
  stiffness: 260,
  damping: 26,
  mass: 0.4,
};
const SIZE_SPRING = {
  type: "spring" as const,
  stiffness: 320,
  damping: 28,
  mass: 0.4,
};
const DOT_SPRING = {
  type: "spring" as const,
  stiffness: 900,
  damping: 40,
  mass: 0.2,
};
const FADE = { duration: 0.12 };
const INSTANT = { duration: 0 };

type CursorVariant = "default" | "invert" | "takeover";

interface CursorTarget {
  variant: CursorVariant;
  el: HTMLElement;
}

function readCursorTarget(el: Element | null): CursorTarget | null {
  const node = el?.closest<HTMLElement>("[data-cursor]");
  if (!node) return null;
  const variant = node.dataset.cursor as CursorVariant;
  // Explicit data-cursor="default" (or any unrecognized value) intentionally
  // falls through here, letting nested elements opt back out of a parent's
  // "takeover"/"invert" zone.
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
    // Whether the current input stream is a real mouse. Starts false so we
    // never flash a desktop-style cursor on touch/pen devices before the
    // first event tells us what we're dealing with. Re-evaluated per event
    // so hybrid devices (touchscreen laptops, iPad + trackpad) work in
    // both directions.
    isFinePointer: false,
  });

  const { ringX, ringY, ringW, ringH, dotX, dotY, dotOpacity, visible } =
    useMemo(
      () => ({
        ringX: motionValue(0),
        ringY: motionValue(0),
        ringW: motionValue(RING_SIZE),
        ringH: motionValue(RING_SIZE),
        dotX: motionValue(0),
        dotY: motionValue(0),
        dotOpacity: motionValue(1), // per-variant dot visibility (0 in invert/takeover)
        visible: motionValue(0), // global show/hide (device type, focus, hover-out of window)
      }),
      [],
    );

  // ─── Paint loop: one write path, batched per frame ─────────────────────
  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    const paint = () => {
      const w = ringW.get();
      const h = ringH.get();
      const v = visible.get();
      ring.style.width = `${w}px`;
      ring.style.height = `${h}px`;
      ring.style.transform = `translate3d(${ringX.get() - w / 2}px, ${ringY.get() - h / 2}px, 0)`;
      ring.style.opacity = `${RING_BASE_OPACITY * v}`;
      dot.style.transform = `translate3d(${dotX.get() - DOT_HALF}px, ${dotY.get() - DOT_HALF}px, 0)`;
      dot.style.opacity = `${DOT_BASE_OPACITY * dotOpacity.get() * v}`;
    };

    const unsubs = [
      ringX.on("change", paint),
      ringY.on("change", paint),
      ringW.on("change", paint),
      ringH.on("change", paint),
      dotX.on("change", paint),
      dotY.on("change", paint),
      dotOpacity.on("change", paint),
      visible.on("change", paint),
    ];
    return () => unsubs.forEach((u) => u());
  }, [ringX, ringY, ringW, ringH, dotX, dotY, dotOpacity, visible]);

  // ─── Interaction wiring ─────────────────────────────────────────────────
  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    // Very old browsers (pre-Pointer Events) — bail out to the native cursor
    // rather than half-initializing.
    if (typeof window.PointerEvent === "undefined") return;

    const reducedMql = window.matchMedia("(prefers-reduced-motion: reduce)");
    state.current.reduced = reducedMql.matches;
    const handleReducedChange = (e: MediaQueryListEvent) => {
      state.current.reduced = e.matches;
    };
    // Safari < 14 fallback
    if (reducedMql.addEventListener) {
      reducedMql.addEventListener("change", handleReducedChange);
    } else {
      reducedMql.addListener(handleReducedChange);
    }

    // Opts are read live (via state.current.reduced) rather than captured
    // once, so an OS-level Reduce Motion toggle takes effect immediately
    // without tearing down and re-attaching every listener.
    const opts = (base: typeof RING_SPRING) =>
      state.current.reduced ? INSTANT : base;

    const snapToRect = (rect: DOMRect) => {
      animate(ringX, rect.left + rect.width / 2, opts(RING_SPRING));
      animate(ringY, rect.top + rect.height / 2, opts(RING_SPRING));
      animate(ringW, rect.width, opts(SIZE_SPRING));
      animate(ringH, rect.height, opts(SIZE_SPRING));
    };

    const setDefaultStyle = () => {
      ring.style.borderRadius = "9999px";
      ring.style.backgroundColor = "transparent";
      ring.style.borderColor = "var(--foreground)";
      ring.style.mixBlendMode = "normal";
      animate(ringW, RING_SIZE, opts(SIZE_SPRING));
      animate(ringH, RING_SIZE, opts(SIZE_SPRING));
      animate(dotOpacity, 1, FADE);
    };

    const setInvertStyle = () => {
      ring.style.borderRadius = "9999px";
      ring.style.backgroundColor = "white";
      ring.style.borderColor = "transparent";
      ring.style.mixBlendMode = "difference";
      animate(ringW, RING_SIZE, opts(SIZE_SPRING));
      animate(ringH, RING_SIZE, opts(SIZE_SPRING));
      animate(dotOpacity, 0, FADE);
    };

    const setTakeoverStyle = (el: HTMLElement) => {
      ring.style.borderRadius = getComputedStyle(el).borderRadius || "24px";
      ring.style.backgroundColor = "var(--muted)";
      ring.style.borderColor = "var(--primary)";
      ring.style.mixBlendMode = "difference";
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
      animate(dotX, x, opts(DOT_SPRING));
      animate(dotY, y, opts(DOT_SPRING));
      if (state.current.activeEl) return; // ring pinned to element bounds in takeover
      animate(ringX, x, opts(RING_SPRING));
      animate(ringY, y, opts(RING_SPRING));
    };

    const showCursor = () => {
      if (!state.current.isFinePointer) return;
      animate(visible, 1, FADE);
    };
    const hideCursor = () => {
      animate(visible, 0, FADE);
    };

    const handlePointerMove = (e: PointerEvent) => {
      const wasFine = state.current.isFinePointer;
      state.current.isFinePointer = e.pointerType === "mouse";

      if (!state.current.isFinePointer) {
        // Touch or pen input — make sure any lingering custom cursor from a
        // previous mouse session is hidden and stop doing positional work.
        if (wasFine) hideCursor();
        return;
      }

      if (!wasFine) showCursor();

      state.current.lastX = e.clientX;
      state.current.lastY = e.clientY;
      moveTo(e.clientX, e.clientY);
    };

    const handlePointerOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && !state.current.isFinePointer) return;
      applyTarget(readCursorTarget(e.target as Element));
    };

    const handlePointerOut = (e: PointerEvent) => {
      if (readCursorTarget(e.relatedTarget as Element | null)) return;
      applyTarget(null);
    };

    // A pointer sequence (e.g. a drag) can be interrupted by the OS/browser
    // (alt-tab mid-drag, context menu, etc). Reset to a known-good state
    // rather than leaving the cursor pinned to a stale element.
    const handlePointerCancel = () => applyTarget(null);

    const handleWindowBlur = () => hideCursor();
    const handleWindowFocus = () => showCursor();
    const handleMouseLeaveDoc = () => hideCursor();
    const handleMouseEnterDoc = () => showCursor();

    // Lenis (or any virtual/smooth scroll) moves content under a stationary
    // pointer — resync hover state + pinned rect so the cursor doesn't lag
    // or stay attached to an element that scrolled away.
    let raf = 0;
    const resync = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (state.current.activeEl) {
          // Element may have been removed from the DOM between frames
          // (route change, conditional render) — fall back gracefully.
          if (!state.current.activeEl.isConnected) {
            applyTarget(null);
            return;
          }
          snapToRect(state.current.activeEl.getBoundingClientRect());
          return;
        }
        applyTarget(
          readCursorTarget(
            document.elementFromPoint(state.current.lastX, state.current.lastY),
          ),
        );
      });
    };

    // Resnap when a takeover target changes size independent of a window
    // resize (async content, web font swap, image load).
    const resizeObserver = new ResizeObserver(() => {
      if (state.current.activeEl) {
        snapToRect(state.current.activeEl.getBoundingClientRect());
      }
    });
    const observeIfTakeover = () => {
      resizeObserver.disconnect();
      if (state.current.activeEl)
        resizeObserver.observe(state.current.activeEl);
    };

    const handlePointerOverWithObserve = (e: PointerEvent) => {
      handlePointerOver(e);
      observeIfTakeover();
    };
    const handlePointerOutWithObserve = (e: PointerEvent) => {
      handlePointerOut(e);
      observeIfTakeover();
    };

    document.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    document.addEventListener("pointerover", handlePointerOverWithObserve, {
      passive: true,
    });
    document.addEventListener("pointerout", handlePointerOutWithObserve, {
      passive: true,
    });
    document.addEventListener("pointercancel", handlePointerCancel, {
      passive: true,
    });
    document.addEventListener("mouseleave", handleMouseLeaveDoc);
    document.addEventListener("mouseenter", handleMouseEnterDoc);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);
    window.addEventListener("scroll", resync, { passive: true });
    window.addEventListener("resize", resync, { passive: true });

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerover", handlePointerOverWithObserve);
      document.removeEventListener("pointerout", handlePointerOutWithObserve);
      document.removeEventListener("pointercancel", handlePointerCancel);
      document.removeEventListener("mouseleave", handleMouseLeaveDoc);
      document.removeEventListener("mouseenter", handleMouseEnterDoc);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
      window.removeEventListener("scroll", resync);
      window.removeEventListener("resize", resync);
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      if (reducedMql.removeEventListener) {
        reducedMql.removeEventListener("change", handleReducedChange);
      } else {
        reducedMql.removeListener(handleReducedChange);
      }
    };
  }, [ringX, ringY, ringW, ringH, dotX, dotY, dotOpacity, visible]);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        role="presentation"
        className="fixed left-0 top-0 pointer-events-none z-[999] border-2"
        style={{
          width: RING_SIZE,
          height: RING_SIZE,
          borderRadius: "9999px",
          borderColor: "var(--foreground)",
          backgroundColor: "transparent",
          opacity: 0,
          transition:
            "border-radius 180ms ease, background-color 180ms ease, border-color 180ms ease",
          willChange: "transform, width, height, opacity",
        }}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        role="presentation"
        className="fixed left-0 top-0 pointer-events-none z-[999] rounded-full"
        style={{
          width: DOT_SIZE,
          height: DOT_SIZE,
          backgroundColor: "var(--foreground)",
          opacity: 0,
          willChange: "transform, opacity",
        }}
      />
    </>
  );
}
