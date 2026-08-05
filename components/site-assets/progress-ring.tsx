"use client";

import React, { useEffect, useRef, useState } from "react";

export default function ProgressRing() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const main = document.getElementById("content");
    if (!main) return;

    const sections = Array.from(main.querySelectorAll<HTMLElement>("section"));
    if (sections.length === 0) return;

    const total = sections.length;

    const observer = new IntersectionObserver(
      (entries) => {
        // Choose the section with largest intersectionRatio
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        let idx = 0;
        if (visible) {
          idx = sections.indexOf(visible.target as HTMLElement);
        } else {
          // If none intersecting, find first below viewport by bounding rect
          const rects = sections.map((s) => ({ s, top: s.getBoundingClientRect().top }));
          const firstVisible = rects.find((r) => r.top >= 0);
          if (firstVisible) idx = sections.indexOf(firstVisible.s);
          else idx = sections.length - 1;
        }

        const pct = Math.round((idx / Math.max(1, total - 1)) * 100);
        setPercent(pct);

        // update SVG stroke
        const svg = svgRef.current;
        if (!svg) return;
        const circle = svg.querySelector("circle[data-progress]") as SVGCircleElement | null;
        if (!circle) return;
        const r = Number(circle.getAttribute("r")) || 20;
        const circ = 2 * Math.PI * r;
        const dash = (pct / 100) * circ;
        circle.setAttribute("stroke-dasharray", `${dash} ${circ}`);
      },
      { root: null, threshold: buildThresholdList() }
    );

    sections.forEach((s) => observer.observe(s));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="z-50 flex items-center justify-center" role="img" aria-label={`page progress ${percent}%`}>
      <svg ref={svgRef} width="42" height="42" viewBox="0 0 52 52" className="-rotate-90">
        <circle cx="26" cy="26" r={20} fill="none" stroke="var(--foreground)" strokeWidth="1.5" />
        <circle
          data-progress
          cx="26"
          cy="26"
          r={20}
          fill="none"
          stroke="var(--paper)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray={`0 ${2 * Math.PI * 20}`}
          style={{ transition: "stroke-dasharray 700ms cubic-bezier(0.32,0.72,0,1)" }}
        />
      </svg>
      <span className="sr-only">{percent}%</span>
    </div>
  );
}

function buildThresholdList() {
  const numSteps = 20;
  const thresholds: number[] = [];
  for (let i = 1.0; i <= numSteps; i++) {
    thresholds.push(i / numSteps);
  }
  thresholds.push(0);
  return thresholds;
}
