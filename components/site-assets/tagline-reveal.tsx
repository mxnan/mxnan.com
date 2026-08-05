"use client";

import React, { useEffect, useRef } from "react";

interface TaglineRevealProps {
  lines: string[];
}

export default function TaglineReveal({ lines }: TaglineRevealProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const wordEls = Array.from(el.querySelectorAll<HTMLElement>("[data-word]"));

    const onIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        // Reveal words in reading order with a small stagger
        wordEls.forEach((w, i) => {
          // stagger by 80ms per word
          window.setTimeout(() => {
            w.style.transition = "opacity 700ms cubic-bezier(0.32,0.72,0,1), transform 700ms cubic-bezier(0.32,0.72,0,1), filter 700ms cubic-bezier(0.32,0.72,0,1)";
            w.style.opacity = "1";
            w.style.transform = "translateY(0px)";
            w.style.filter = "blur(0px)";
            w.style.color = "inherit";
          }, i * 80);
        });
        observer.disconnect();
      });
    };

    const observer = new IntersectionObserver(onIntersect, {
      root: null,
      rootMargin: "-10% 0px",
      threshold: 0.1,
    });

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="my-12">
      <div ref={containerRef} className="max-w-[680px] mx-auto text-center">
        {lines.map((line, idx) => (
          <h2
            key={idx}
            className="text-4xl md:text-5xl font-semibold leading-tight"
            style={{
              // muted start tone ~35% opacity
              color: "currentColor",
            }}
          >
            {line.split(" ").map((word, i) => (
              <span
                key={i}
                data-word
                style={{
                  display: "inline-block",
                  opacity: 0.35,
                  transform: "translateY(16px)",
                  filter: "blur(4px)",
                  marginRight: "6px",
                }}
              >
                {word}
              </span>
            ))}
          </h2>
        ))}
      </div>
    </section>
  );
}
