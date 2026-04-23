"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { ChevronRight, TableOfContents } from "lucide-react";
import type { TocEntry } from "./toc.server";
import { useLenis } from 'lenis/react';
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

function useMounted() {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => { setMounted(true); }, []);
    return mounted;
}

function useIsLargeScreen() {
    const [isLarge, setIsLarge] = React.useState(false);
    React.useEffect(() => {
        const mql = window.matchMedia("(min-width: 1024px)");
        setIsLarge(mql.matches);
        const handler = (e: MediaQueryListEvent) => setIsLarge(e.matches);
        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
    }, []);
    return isLarge;
}

function useActiveItem(itemIds: (string | undefined)[]) {
    const [activeId, setActiveId] = React.useState<string>("");

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                // Pick the topmost intersecting entry for stable active state
                const intersecting = entries.filter((e) => e.isIntersecting);
                if (intersecting.length > 0) {
                    // Sort by position and pick the first visible heading
                    const sorted = intersecting.sort(
                        (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
                    );
                    setActiveId(sorted[0].target.id);
                }
            },
            { rootMargin: "0% 0% -70% 0%", threshold: 0 }
        );

        const validIds = itemIds.filter(Boolean) as string[];
        validIds.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => {
            validIds.forEach((id) => {
                const el = document.getElementById(id);
                if (el) observer.unobserve(el);
            });
        };
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
        [lenis] // re-memoize if lenis instance changes
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
        <ul className={cn("m-0 list-none", level !== 1 && "pl-2 sm:pl-3")}>
            {tree.map((item, index) => {
                const isActive = item.url === `#${activeItem}`;
                return (
                    <li key={index} data-cursor="blend" className="mt-0 pt-1 sm:pt-2">
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
                                    : "text-muted-foreground hover:text-primary"
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
                        {
                            item.items?.length ? (
                                <TreeClient
                                    tree={item.items}
                                    level={level + 1}
                                    activeItem={activeItem}
                                    onLinkClick={onLinkClick}
                                />
                            ) : null
                        }
                    </li>
                );
            })}
        </ul >
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

    // Flatten all IDs once, memoized
    const itemIds = React.useMemo(
        () =>
            toc
                .flatMap((item) => [item.url, ...(item.items?.map((i) => i.url) ?? [])])
                .filter(Boolean)
                .map((url) => url?.split("#")[1]),
        [toc]
    );

    const activeHeading = useActiveItem(itemIds);

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

            {/* Mobile: empty slot — add a sheet/drawer here if needed */}
            {!isLargeScreen && (
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-1000">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="default" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
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