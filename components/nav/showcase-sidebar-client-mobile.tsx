"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface ComponentItem {
    category: string;
    slug: string;
    title: string;
}

interface ShowcaseSidebarMobileProps {
    items: ComponentItem[];
}

function useMounted() {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);
    return mounted;
}

function useIsSmallScreen() {
    const [isSmall, setIsSmall] = React.useState(false);
    React.useEffect(() => {
        const mql = window.matchMedia("(max-width: 767px)");
        setIsSmall(mql.matches);
        const handler = (e: MediaQueryListEvent) => setIsSmall(e.matches);
        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
    }, []);
    return isSmall;
}

export function ShowcaseSidebarMobile({ items }: ShowcaseSidebarMobileProps) {
    const pathname = usePathname();
    const [open, setOpen] = React.useState(false);
    const mounted = useMounted();
    const isSmallScreen = useIsSmallScreen();

    // Group items by category
    const grouped = React.useMemo(() => {
        return items.reduce(
            (acc, item) => {
                if (!acc[item.category]) acc[item.category] = [];
                acc[item.category].push(item);
                return acc;
            },
            {} as Record<string, ComponentItem[]>
        );
    }, [items]);

    const handleLinkClick = () => {
        setOpen(false);
    };

    // Only render on small screens after hydration
    if (!mounted || !isSmallScreen) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="fixed z-1000 bottom-6 left-1/2 -translate-x-1/2 z-30"
                    aria-label="Toggle showcase menu"
                >
                    <Menu className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[354px] max-w-[calc(100vw-2rem)] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Menu className="h-5 w-5" /> Navigate
                    </DialogTitle>
                </DialogHeader>

                <nav className="flex flex-col gap-4">
                    {/* Showcase Home */}
                    <Link
                        href="/showcase"
                        onClick={handleLinkClick}
                        className={cn(
                            "flex items-center justify-between text-sm font-semibold px-2 py-1.5 rounded transition-colors",
                            pathname === "/showcase"
                                ? "text-primary bg-primary/10"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <span>Showcase</span>
                        <ArrowDownRight className="h-3 w-3" />
                    </Link>

                    {/* Categories */}
                    {Object.entries(grouped).map(([category, categoryItems]) => (
                        <div key={category} className="space-y-2">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-2">
                                {category}
                            </h3>
                            <ul className="space-y-1">
                                {categoryItems.map((item) => {
                                    const href = `/showcase/${item.category}/${item.slug}`;
                                    const isActive = pathname === href;

                                    return (
                                        <li key={href}>
                                            <Link
                                                href={href}
                                                onClick={handleLinkClick}
                                                className={cn(
                                                    "flex items-center justify-between text-sm px-2 py-1.5 rounded transition-all",
                                                    isActive
                                                        ? "bg-primary/10 text-primary font-medium"
                                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                                )}
                                            >
                                                <span className="truncate">{item.title}</span>
                                                <ArrowDownRight
                                                    className={cn(
                                                        "h-2.5 w-2.5 shrink-0 transition-transform",
                                                        isActive ? "-rotate-45" : ""
                                                    )}
                                                />
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </nav>
            </DialogContent>
        </Dialog>
    );
}
