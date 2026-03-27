'use client'

import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ProgressBar() {
    const [pct, setPct] = useState(0)

    useEffect(() => {
        const update = () => {
            const scrolled = window.scrollY
            const total =
                document.documentElement.scrollHeight - window.innerHeight

            const percentage =
                total > 0 ? Math.round((scrolled / total) * 100) : 0

            setPct(percentage)
        }

        window.addEventListener('scroll', update, { passive: true })
        update()
        return () => window.removeEventListener('scroll', update)
    }, [])

    const r = 20
    const circ = 2 * Math.PI * r
    const dash = (pct / 100) * circ

    const atTop = pct <= 0
    const atBottom = pct >= 100

    return (
        <div onClick={() => {
            if (atTop) {
                window.scrollTo({
                    top: document.documentElement.scrollHeight,
                    behavior: 'smooth',
                })
            } else if (atBottom) {
                window.scrollTo({ top: 0, behavior: 'smooth' })
            }
        }} className="z-50 flex select-none items-center justify-center cursor-pointer">
            <svg
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
                    strokeDasharray={`${dash} ${circ}`}
                    style={{ transition: 'stroke-dasharray 0.1s linear' }}
                />
            </svg>

            <span
                className="absolute font-sans text-[11px] font-medium tabular-nums tracking-wider"
                style={{
                    color: 'var(--foreground)',
                    transition: 'opacity 0.2s ease',
                }}
            >
                {atTop ? (
                    <ChevronDown size={12} className="stroke-3" />
                ) : atBottom ? (
                    <ChevronDown size={12} className="rotate-180 stroke-3" />
                ) : (
                    String(pct).padStart(2, '0')
                )}
            </span>
        </div>
    )
}