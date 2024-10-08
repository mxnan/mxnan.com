"use client";

import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { CornerDownRight } from "lucide-react";

interface TocEntry {
  title: string;
  slug: string;
}

interface TocProps {
  toc: TocEntry[];
  className: string;
}

export function TableOfContents({ toc, className }: TocProps) {
  const [activeId, setActiveId] = useState("");

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveId(entry.target.id);
      }
    });
  }, []);

  useEffect(() => {
    const headingElements = toc
      .map((item) => document.getElementById(item.slug))
      .filter(Boolean);

    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: "-30% 0% -30% 0%",
      threshold: 0.8,
    });

    headingElements.forEach((element) => element && observer.observe(element));

    return () => observer.disconnect();
  }, [toc, handleObserver]);

  return (
    <>
      {toc.length > 0 && (
        <nav className={cn("space-y-4 flex flex-col items-start text-gray-500 dark:text-gray-400", className)}>
          <p className="font-semibold ">Table of contents</p>
          <ul className="space-y-4 mr-4 text-sm ">
            {toc.map((item) => (
              <TableOfContentsItem
                key={item.slug}
                item={item}
                isActive={item.slug === activeId}
              />
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}

export interface TableOfContentsItemProps {
  item: TocEntry;
  isActive: boolean;
}

export function TableOfContentsItem({
  item,
  isActive,
}: TableOfContentsItemProps) {
  return (
    <li className="ml-2 py-2">
      <a href={`#${item.slug}`} className="flex gap-3 ">
        <CornerDownRight
          className={cn(
            "w-4 h-4 transition-all ease-in-out duration-200",
            isActive && "text-black dark:text-white" 
          )}
        />
        <span
          className={cn(
            "font-medium transition-all ease-in-out duration-200",
            isActive
              ? "translate-x-4 text-black dark:text-white"
              : "translate-x-0 translate-y-0 "
          )}
        >
          {item.title}
        </span>
      </a>
    </li>
  );
}
