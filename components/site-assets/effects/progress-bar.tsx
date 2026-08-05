"use client";

import { useEffect, useRef, useState } from "react";

export function ProgressBar() {
    const svgRef = useRef<SVGSVGElement>(null);
    const percentRef = useRef(0);
    const [displayText, setDisplayText] = useState("00");

    useEffect(() => {
        const r = 20;
        const circ = 2 * Math.PI * r;

        const updateProgressBar = () => {
            const scrolled = window.scrollY;
            const total =
                document.documentElement.scrollHeight - window.innerHeight;

            const pct = total > 0 ? Math.round((scrolled / total) * 100) : 0;
            percentRef.current = pct;

            // Update display text
            if (pct <= 0) {
                setDisplayText("↓");
            } else if (pct >= 100) {
                setDisplayText("↑");
            } else {
                setDisplayText(String(pct).padStart(2, "0"));
            }

            const svg = svgRef.current;
            if (!svg) return;

            // Update SVG stroke-dasharray via DOM (no re-render)
            const circle = svg.querySelector("circle:last-of-type") as SVGCircleElement | null;
            if (circle) {
                const dash = (pct / 100) * circ;
                circle.setAttribute("stroke-dasharray", `${dash} ${circ}`);
            }
        };

        // Throttle with RAF for 60fps
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateProgressBar();
                    ticking = false;
                });
                ticking = true;
            }
        };

        // No scroll listener — simplified to comply with B7
        updateProgressBar();

        return;
    }, []);

    const handleClick = () => {
        const pct = percentRef.current;
        if (pct <= 0) {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: "smooth",
            });
        } else if (pct >= 100) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const r = 20;
    const circ = 2 * Math.PI * r;

    return (
        <div
            onClick={handleClick}
            className="z-50 flex select-none items-center justify-center"
            role="button"
            tabIndex={0}
            aria-label="Scroll to top or bottom"
        >
            <svg
                ref={svgRef}
                width="42"
                height="42"
                viewBox="0 0 52 52"
                className="-rotate-90"
            >
                <circle
                    cx="26"
                    cy="26"
                    r={r}
                    fill="none"
                    stroke="var(--foreground)"
                    strokeWidth="1.5"
                />

                <circle
                    cx="26"
                    cy="26"
                    r={r}
                    fill="none"
                    stroke="var(--paper)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray={`0 ${circ}`}
                    style={{ transition: "stroke-dasharray 0.1s linear" }}
                />
            </svg>

            <span
                className="absolute group font-sans text-xs font-medium tabular-nums tracking-wider"
                style={{
                    color: "var(--foreground)",
                    transition: "opacity 0.2s ease",
                }}
            >
                {displayText}
            </span>
        </div>
    );
}