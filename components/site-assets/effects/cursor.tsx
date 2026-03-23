'use client'

import { useEffect, useCallback } from 'react'
import { useCursor } from '@/hooks/use-cursor'

export function Cursor() {
    const { dotRef, ringRef } = useCursor()

    const onEnter = useCallback((e: MouseEvent) => {
        const el = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor]')
        if (!el || !ringRef.current || !dotRef.current) return

        const type = el.dataset.cursor

        if (type === 'link') {
            ringRef.current.style.width = '56px'
            ringRef.current.style.height = '56px'
            ringRef.current.style.borderColor = 'var(--accent)'
            ringRef.current.style.opacity = '1'
            dotRef.current.style.opacity = '0'
        }

        if (type === 'blend') {
            ringRef.current.style.width = '72px'
            ringRef.current.style.height = '72px'
            ringRef.current.style.backgroundColor = 'var(--muted)'
            ringRef.current.style.mixBlendMode = 'difference'
            ringRef.current.style.borderColor = 'transparent'
            dotRef.current.style.opacity = '0'
        }

        if (type === 'text') {
            ringRef.current.style.width = '80px'
            ringRef.current.style.height = '80px'
            ringRef.current.style.borderColor = 'var(--ring)'
            dotRef.current.style.opacity = '0'
        }

        if (type === 'cta') {
            ringRef.current.style.width = '72px'
            ringRef.current.style.height = '72px'
            ringRef.current.style.backgroundColor = 'var(--accent)'
            ringRef.current.style.borderColor = 'transparent'
            ringRef.current.style.opacity = '0.9'
            dotRef.current.style.opacity = '0'
        }
    }, [ringRef, dotRef])

    const onLeave = useCallback((e: MouseEvent) => {
        const el = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor]')
        if (!el || !ringRef.current || !dotRef.current) return
        // reset to default
        ringRef.current.style.width = '36px'
        ringRef.current.style.height = '36px'
        ringRef.current.style.borderColor = 'rgba(242,237,230,0.25)'
        ringRef.current.style.backgroundColor = 'transparent'
        ringRef.current.style.mixBlendMode = 'normal'
        ringRef.current.style.opacity = '1'
        dotRef.current.style.opacity = '1'
    }, [ringRef, dotRef])

    useEffect(() => {
        document.addEventListener('mouseover', onEnter)
        document.addEventListener('mouseout', onLeave)
        return () => {
            document.removeEventListener('mouseover', onEnter)
            document.removeEventListener('mouseout', onLeave)
        }
    }, [onEnter, onLeave])

    return (
        <>
            {/* Dot — snaps instantly to mouse */}
            <div
                ref={dotRef}
                className="pointer-events-none fixed z-[9999] hidden md:block"
                style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--muted-foreground)',
                    transform: 'translate(-50%, -50%)',
                    transition: 'opacity 0.3s ease',
                    willChange: 'left, top',
                }}
            />

            {/* Ring — spring-follows mouse */}
            <div
                ref={ringRef}
                className="pointer-events-none fixed z-[9998] hidden md:block"
                style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '1px solid rgba(242,237,230,0.25)',
                    backgroundColor: 'transparent',
                    transform: 'translate(-50%, -50%)',
                    transition: 'width 0.35s cubic-bezier(0.16,1,0.3,1), height 0.35s cubic-bezier(0.16,1,0.3,1), border-color 0.3s ease, background-color 0.3s ease, opacity 0.3s ease',
                    willChange: 'left, top',
                }}
            />
        </>
    )
}