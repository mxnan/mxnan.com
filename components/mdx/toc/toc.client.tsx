"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { ChevronRight, TableOfContents } from "lucide-react";
import type { TocEntry } from "./toc.server";
import { useLenis } from "lenis/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// ─── Hooks ────────────────────────────────────────────────────────────────────

// No subscription needed — this only tells React "are we past hydration yet".
const emptySubscribe = () => () => {};

/**
 * Returns false on the server / first client render, true after hydration.
 * Replaces the old `useEffect(() => setMounted(true))` pattern, which
 * synchronously calls setState inside an effect and forces an extra render.
 */
function useMounted() {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => true, // client snapshot
    () => false, // server snapshot
  );
}

const LARGE_SCREEN_QUERY = "(min-width: 1024px)";

function subscribeToLargeScreen(callback: () => void) {
  const mql = window.matchMedia(LARGE_SCREEN_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getLargeScreenSnapshot() {
  return window.matchMedia(LARGE_SCREEN_QUERY).matches;
}

function getLargeScreenServerSnapshot() {
  return false;
}

/**
 * Subscribes directly to the matchMedia change event via useSyncExternalStore
 * instead of reading it once in an effect and calling setState. This avoids
 * the "setState synchronously within an effect" warning and keeps the value
 * correctly in sync with the external system (the media query).
 */
function useIsLargeScreen() {
  return React.useSyncExternalStore(
    subscribeToLargeScreen,
    getLargeScreenSnapshot,
    getLargeScreenServerSnapshot,
  );
}

function useActiveItem(itemIds: (string | undefined)[]) {
  const [activeId, setActiveId] = React.useState<string>("");

  React.useEffect(() => {
    const validIds = itemIds.filter(Boolean) as string[];
    if (!validIds.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting);
        if (intersecting.length > 0) {
          const sorted = intersecting.sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          );
          setActiveId(sorted[0].target.id);
        }
      },
      { rootMargin: "0% 0% -70% 0%", threshold: 0 },
    );

    validIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [itemIds]);

  return activeId;
}

// ─── Lenis scroll handler ──────────────────────────────────────────────────────

function useLenisScrollTo() {
  const lenis = useLenis();

  return React.useCallback(
    (href: string) => {
      const id = href.startsWith("#") ? href.slice(1) : href;
      const target = document.getElementById(id);
      if (!target) return;

      if (lenis) {
        lenis.scrollTo(target, {
          offset: -80,
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [lenis],
  );
}

// ─── Tree component ───────────────────────────────────────────────────────────

interface TreeClientProps {
  tree: TocEntry[];
  level?: number;
  activeItem?: string;
  onLinkClick: (href: string) => void;
}

const TreeClient = React.memo(function TreeClient({
  tree,
  level = 1,
  activeItem,
  onLinkClick,
}: TreeClientProps) {
  if (!tree.length || level >= 3) return null;

  return (
    <div className={cn("m-0 list-none", level !== 1 && "pl-2 sm:pl-3")}>
      {tree.map((item, index) => {
        const isActive = item.url === `#${activeItem}`;
        return (
          <div key={index} className="mt-0 pt-1 sm:pt-2">
            <a
              href={item.url}
              onClick={(e) => {
                e.preventDefault();
                onLinkClick(item.url);
              }}
              className={cn(
                "inline-block relative text-xs sm:text-sm pl-2 sm:pl-3 transition-colors duration-300 ease-in-out truncate w-full",
                isActive
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-primary",
              )}
              aria-current={isActive ? "location" : undefined}
            >
              <AnimatePresence mode="sync">
                {isActive && (
                  <motion.span
                    key="indicator"
                    layoutId="toc-active-indicator"
                    className="absolute left-0 top-0 rounded-xl h-3 sm:h-4 w-1 bg-primary"
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0.3 }}
                    transition={{ type: "tween", duration: 0.3 }}
                  />
                )}
              </AnimatePresence>
              {item.title}
            </a>
            {item.items?.length ? (
              <TreeClient
                tree={item.items}
                level={level + 1}
                activeItem={activeItem}
                onLinkClick={onLinkClick}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
});

// ─── Main export ──────────────────────────────────────────────────────────────

interface TocClientProps {
  toc: TocEntry[];
  price?: number;
  className?: string;
  tripname?: string;
}

export function TableOfContentsClient({ toc, className }: TocClientProps) {
  const mounted = useMounted();
  const isLargeScreen = useIsLargeScreen();
  const scrollTo = useLenisScrollTo();

  const itemIds = React.useMemo(
    () =>
      toc
        .flatMap((item) => [item.url, ...(item.items?.map((i) => i.url) ?? [])])
        .filter(Boolean)
        .map((url) => url?.split("#")[1]),
    [toc],
  );

  const activeHeading = useActiveItem(itemIds);

  // Nothing to show a TOC for — bail before rendering either variant.
  if (!toc?.length) return null;
  if (!mounted) return null;

  return (
    <>
      {/* Desktop TOC */}
      {isLargeScreen && (
        <div className={cn("w-56 sm:w-64 shrink-0", className)}>
          <div className="sticky top-24 self-start rounded-lg border border-border bg-muted/40 p-4">
            <p className="font-bold text-sm sm:text-lg py-2 flex items-center gap-2">
              <ChevronRight className="size-4 sm:size-5" />
              On This Page
            </p>
            <hr className="my-2" />
            <TreeClient
              tree={toc}
              activeItem={activeHeading}
              onLinkClick={scrollTo}
            />
          </div>
        </div>
      )}

      {/* Mobile */}
      {!isLargeScreen && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-1000">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="default"
                size="icon"
                className="h-9 w-9 sm:h-10 sm:w-10"
              >
                <TableOfContents className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sr-only">Table of Contents</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[calc(100vw-2rem)] max-w-sm">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <ChevronRight className="size-4 sm:size-5" /> On This Page
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm">
                  Navigate to sections of this page quickly
                </DialogDescription>
              </DialogHeader>
              <hr className="my-2" />
              <div className="max-h-[50vh] overflow-y-auto pr-2">
                <TreeClient
                  tree={toc}
                  activeItem={activeHeading}
                  onLinkClick={scrollTo}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  );
}
