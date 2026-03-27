'use client';

import { useEffect, useRef } from 'react';
import { motionValue, animate } from 'motion';

const BASE = 300;
const DOT = 10 / BASE;
const BLEND = 80 / BASE;

export function Cursor() {
    const outerRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);

    const x = motionValue(-100);
    const y = motionValue(-100);
    const scale = motionValue(DOT);

    const mode = useRef<'default' | 'blend'>('default');
    const updateCursorModeRef = useRef<((cx?: number, cy?: number) => void) | null>(null);

    // ─── Apply transforms ─────────────────────────────────────────────────────
    useEffect(() => {
        const outer = outerRef.current!;
        const inner = innerRef.current!;

        const unsubX = x.on('change', (lx) => {
            outer.style.transform = `translate(${lx - BASE / 2}px, ${y.get() - BASE / 2}px)`;
        });
        const unsubY = y.on('change', (ly) => {
            outer.style.transform = `translate(${x.get() - BASE / 2}px, ${ly - BASE / 2}px)`;
        });
        const unsubScale = scale.on('change', (s) => {
            inner.style.transform = `scale(${s})`;
        });

        return () => { unsubX(); unsubY(); unsubScale(); };
    }, []);

    // ─── Mouse follow ─────────────────────────────────────────────────────────
    useEffect(() => {
        const springConfig = {
            type: 'spring' as const,
            stiffness: 120,    // Very high = extremely quick response
            damping: 20,        // Strong damping = kills any overshoot fast
            mass: 0.55,          // Very light = feels direct and instant
            restDelta: 0.001,
            restSpeed: 0.001,
        };

        const move = (e: MouseEvent) => {
            animate(x, e.clientX, springConfig);
            animate(y, e.clientY, springConfig);
            updateCursorModeRef.current?.(e.clientX, e.clientY);
        };

        document.addEventListener('mousemove', move, { passive: true });
        return () => document.removeEventListener('mousemove', move);
    }, []);

    // ─── Blend hover ──────────────────────────────────────────────────────────
    useEffect(() => {
        const inner = innerRef.current!;

        const updateCursorMode = (cx?: number, cy?: number) => {
            if (!inner) return;
            const px = cx ?? x.get();
            const py = cy ?? y.get();
            const element = document.elementFromPoint(px, py);
            const isBlend = !!element?.closest('[data-cursor="blend"]');

            if (isBlend && mode.current !== 'blend') {
                mode.current = 'blend';
                inner.style.background = 'oklch(1 0 0)';
                inner.style.mixBlendMode = 'difference';
                inner.style.opacity = '1';
                inner.style.borderColor = 'transparent';
                animate(scale, BLEND, {
                    type: 'spring',
                    stiffness: 500,
                    damping: 30
                });
            } else if (!isBlend && mode.current !== 'default') {
                mode.current = 'default';
                inner.style.background = 'var(--muted-foreground)';
                inner.style.mixBlendMode = 'normal';
                inner.style.opacity = '1';
                animate(scale, DOT, {
                    type: 'spring',
                    stiffness: 500,
                    damping: 30
                });
            }
        };

        updateCursorModeRef.current = updateCursorMode;

        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateCursorMode();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div
            ref={outerRef}
            className="pointer-events-none fixed inset-0 z-[9999] hidden md:block"
            style={{
                width: BASE,
                height: BASE,
                top: 0,
                left: 0,
                willChange: 'transform',
                mixBlendMode: 'difference',
                isolation: 'isolate',
            }}
        >
            <div
                ref={innerRef}
                style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: 'oklch(1 0 0)',
                    transform: `scale(${DOT})`,
                    transformOrigin: 'center',
                    willChange: 'transform',
                    backfaceVisibility: 'hidden',
                }}
            />
        </div>
    );
}