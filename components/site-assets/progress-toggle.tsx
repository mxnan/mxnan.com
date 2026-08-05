"use client";

import { useState } from "react";

export default function ProgressToggle() {
  const [atBottom, setAtBottom] = useState(false);

  const handleClick = () => {
    if (!atBottom) {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
      setAtBottom(true);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setAtBottom(false);
    }
  };

  const displayText = atBottom ? "↑" : "↓";

  return (
    <div
      onClick={handleClick}
      className="z-50 flex select-none items-center justify-center"
      role="button"
      tabIndex={0}
      aria-label="Scroll to top or bottom"
    >
      <svg width="42" height="42" viewBox="0 0 52 52" className="-rotate-90">
        <circle cx="26" cy="26" r={20} fill="none" stroke="var(--foreground)" strokeWidth="1.5" />
        <circle cx="26" cy="26" r={20} fill="none" stroke="var(--paper)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      <span className="absolute group font-sans text-xs font-medium tabular-nums tracking-wider" style={{ color: "var(--foreground)", transition: "opacity 0.2s ease" }}>
        {displayText}
      </span>
    </div>
  );
}
