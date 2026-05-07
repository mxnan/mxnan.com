"use client";

import { useEffect, useRef, useMemo } from "react";
import { motionValue, animate } from "motion";

const SIZE = 12;
const HALF_SIZE = SIZE / 2;

const SPRING_CONFIG = {
    type: "spring" as const,
    stiffness: 150,
    damping: 25,
    mass: 0.5,
};

export function Cursor() {
    const ref = useRef<HTMLDivElement>(null);
    const isBlendRef = useRef(false);

    const { x, y } = useMemo(
        () => ({
            x: motionValue(0),
            y: motionValue(0),
        }),
        []
    );

    // ─── Apply transform from motion values ──────────────────────────────
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const updateTransform = () => {
            el.style.transform = `translate(${x.get() - HALF_SIZE}px, ${y.get() - HALF_SIZE}px)`;
        };

        const unsubX = x.on("change", updateTransform);
        const unsubY = y.on("change", updateTransform);

        return () => {
            unsubX();
            unsubY();
        };
    }, [x, y]);

    // ─── Mouse follow with smooth animation ──────────────────────────────
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            animate(x, e.clientX, SPRING_CONFIG);
            animate(y, e.clientY, SPRING_CONFIG);

            const target = document.elementFromPoint(e.clientX, e.clientY);
            const isBlend = !!target?.closest("[data-cursor]");

            if (isBlend !== isBlendRef.current) {
                isBlendRef.current = isBlend;
                const el = ref.current;
                if (el) {
                    if (isBlend) {
                        el.style.backgroundColor = "transparent";
                        el.style.mixBlendMode = "lighten";
                        el.style.borderColor = "var(--muted-foreground)";
                    } else {
                        el.style.backgroundColor = "var(--foreground)";
                        el.style.mixBlendMode = "normal";
                        el.style.borderColor = "var(--foreground)";
                    }
                }
            }
        };

        const handleBlur = () => {
            const el = ref.current;
            if (el) el.style.opacity = "0";
        };

        const handleFocus = () => {
            const el = ref.current;
            if (el) el.style.opacity = "1";
        };

        document.addEventListener("mousemove", handleMouseMove, { passive: true });
        window.addEventListener("blur", handleBlur);
        window.addEventListener("focus", handleFocus);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("blur", handleBlur);
            window.removeEventListener("focus", handleFocus);
        };
    }, [x, y]);

    return (
        <div
            ref={ref}
            className="fixed pointer-events-none z-[9999] rounded-full border-2"
            style={{
                width: SIZE,
                height: SIZE,
                borderColor: "var(--foreground)",
                backgroundColor: "var(--foreground)",
                opacity: 0.8,
                willChange: "transform",
            }}
        />
    );
}