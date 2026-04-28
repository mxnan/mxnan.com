"use client";

import { useEffect, useRef, useMemo } from "react";
import { motionValue, animate } from "motion";

const SIZE = 8;
const HALF_SIZE = SIZE / 2;

const SPRING_CONFIG = {
    type: "spring" as const,
    stiffness: 120,
    damping: 20,
    mass: 0.55,
};

export function Cursor() {
    const ref = useRef<HTMLDivElement>(null);
    const { x, y } = useMemo(() => ({
        x: motionValue(-100),
        y: motionValue(-100),
    }), []);

    const isBlend = useRef(false);

    // ─── Apply transform ────────────────────────────────────────────────────
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const unsubX = x.on("change", (lx) => {
            el.style.transform = `translate(${lx - HALF_SIZE}px, ${y.get() - HALF_SIZE}px)`;
        });
        const unsubY = y.on("change", (ly) => {
            el.style.transform = `translate(${x.get() - HALF_SIZE}px, ${ly - HALF_SIZE}px)`;
        });

        return () => {
            unsubX();
            unsubY();
        };
    }, [x, y]);

    // ─── Mouse follow ────────────────────────────────────────────────────────
    useEffect(() => {
        const move = (e: MouseEvent) => {
            animate(x, e.clientX, SPRING_CONFIG);
            animate(y, e.clientY, SPRING_CONFIG);

            const el = document.elementFromPoint(e.clientX, e.clientY);
            const blend = !!el?.closest('[data-cursor="blend"]');

            if (blend !== isBlend.current) {
                isBlend.current = blend;
                const cursor = ref.current;
                if (cursor) {
                    cursor.style.mixBlendMode = blend ? "difference" : "normal";
                    cursor.style.borderColor = blend ? "transparent" : "var(--muted-foreground)";
                }
            }
        };

        document.addEventListener("mousemove", move, { passive: true });
        return () => document.removeEventListener("mousemove", move);
    }, [x, y]);

    // ─── Cursor visibility on blur ─────────────────────────────────────────
    useEffect(() => {
        const handleBlur = () => {
            const el = ref.current;
            if (el) el.style.opacity = "0";
        };

        const handleFocus = () => {
            const el = ref.current;
            if (el) el.style.opacity = "1";
        };

        window.addEventListener("blur", handleBlur);
        window.addEventListener("focus", handleFocus);

        return () => {
            window.removeEventListener("blur", handleBlur);
            window.removeEventListener("focus", handleFocus);
        };
    }, []);

    return (
        <div
            ref={ref}
            className="fixed pointer-events-none z-[9999] rounded-full border border-muted-foreground"
            style={{
                width: SIZE,
                height: SIZE,
                opacity: 1,
                willChange: "transform",
            }}
        />
    );
}