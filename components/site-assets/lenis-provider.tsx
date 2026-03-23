'use client'

import type { ReactNode } from 'react'
import { useEffect } from 'react'
import Lenis from 'lenis'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

type LenisProviderProps = {
    children: ReactNode
}

export function LenisProvider({ children }: LenisProviderProps) {
    const prefersReducedMotion = useReducedMotion()

    useEffect(() => {
        if (prefersReducedMotion) {
            return
        }

        const lenis = new Lenis({
            lerp: 0.08,
            smoothWheel: true,
            // smoothTouch: false,
            // normalizeWheel: true,
        })

        let frameId: number

        const raf = (time: number) => {
            lenis.raf(time)
            frameId = requestAnimationFrame(raf)
        }

        frameId = requestAnimationFrame(raf)

        return () => {
            cancelAnimationFrame(frameId)
            lenis.destroy()
        }
    }, [prefersReducedMotion])

    return children
}
