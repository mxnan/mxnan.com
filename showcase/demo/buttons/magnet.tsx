"use client";

import { useEffect, useRef } from "react";
import { animate } from "motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function MagnetButton() {
    const ref = useRef<HTMLDivElement>(null);
    const hovering = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        let rect = el.getBoundingClientRect();

        const handleEnter = () => {
            hovering.current = true;
            rect = el.getBoundingClientRect();
        };

        const handleLeave = () => {
            hovering.current = false;

            animate(
                el,
                { transform: "translate3d(0px, 0px, 0)" },
                { type: "spring", stiffness: 260, damping: 18 }
            );
        };

        const handleMove = (e: PointerEvent) => {
            if (!hovering.current) return;

            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const dx = e.clientX - centerX;
            const dy = e.clientY - centerY;

            const distance = Math.hypot(dx, dy);

            // 🔥 increased distance threshold
            // if (distance > 160) return;

            // 🔥 increased range
            const max = 50;

            // 🔥 falloff curve (stronger near cursor)
            const strength = Math.min(distance / 120, 1);

            const angle = Math.atan2(dy, dx);

            const x = Math.cos(angle) * max * strength;
            const y = Math.sin(angle) * max * strength;

            animate(
                el,
                { transform: `translate3d(${x}px, ${y}px, 0)` },
                {
                    type: "spring",
                    stiffness: 260, // 🔥 snappier
                    damping: 18,    // 🔥 less floaty
                    mass: 0.4
                }
            );
        };

        el.addEventListener("pointerenter", handleEnter);
        el.addEventListener("pointerleave", handleLeave);
        window.addEventListener("pointermove", handleMove);

        return () => {
            el.removeEventListener("pointerenter", handleEnter);
            el.removeEventListener("pointerleave", handleLeave);
            window.removeEventListener("pointermove", handleMove);
        };
    }, []);

    return (
        <div
            ref={ref}
            className="relative z-10 w-40 h-40 rounded-full flex items-center justify-center cursor-pointer overflow-hidden will-change-transform"
        >
            {/* Rotating border */}
            <div
                className="absolute inset-0 rounded-full animate-spin-slow"
                style={{
                    background: `
            conic-gradient(
              from 0deg,
              transparent 0deg 80deg,
              currentColor 80deg 90deg,
              transparent 90deg 170deg,
              currentColor 170deg 180deg,
              transparent 180deg 260deg,
              currentColor 260deg 270deg,
              transparent 270deg 350deg,
              currentColor 350deg
            )
          `,
                }}
            />

            {/* Inner */}
            <div className="absolute inset-1 rounded-full overflow-hidden group ">
                <div className="absolute inset-0 rounded-full bg-indigo-500 transition-transform duration-500 group-hover:scale-0" />
                <div className="absolute inset-0 rounded-full bg-lime-400 scale-0 group-hover:scale-100 transition-transform duration-500" />

                {/* Icon */}
                <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity duration-200">
                    <ArrowRight className="text-stone-100" strokeWidth={3} size={44} />
                </div>

                {/* CTA */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Link
                        href="/showcase"
                        className={cn(
                            buttonVariants({ variant: "default", size: "sm" }),
                            "text-sm "
                        )}
                    >
                        See more ?
                    </Link>
                </div>
            </div>
        </div>
    );
}