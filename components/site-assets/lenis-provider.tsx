'use client';

import { ReactLenis } from 'lenis/react';
import type { ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

export function LenisProvider({ children }: { children: ReactNode }) {
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) {
        return <>{children}</>;
    }

    return (
        <ReactLenis
            root
            options={{
                duration: 1.2,
                easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smoothWheel: true,
                // smoothTouch: false,
                lerp: 0.1,
                autoRaf: true,
            }}
        >
            {children}
        </ReactLenis>
    );
}