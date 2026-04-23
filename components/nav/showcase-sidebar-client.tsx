"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ArrowDownRight } from "lucide-react";

interface ComponentItem {
    category: string;
    slug: string;
    title: string;
}

export function ShowcaseSidebarClient({ items }: { items: ComponentItem[] }) {
    const pathname = usePathname();

    // Group items by category
    const grouped = useMemo(() => {
        return items.reduce(
            (acc, item) => {
                if (!acc[item.category]) acc[item.category] = [];
                acc[item.category].push(item);
                return acc;
            },
            {} as Record<string, ComponentItem[]>
        );
    }, [items]);

    return (
        <nav className="flex flex-col gap-4">
            {/* Showcase Home */}
            <Link
                href="/showcase"
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
                        {categoryItems.map(item => {
                            const href = `/showcase/${item.category}/${item.slug}`;
                            const isActive = pathname === href;

                            return (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        className={cn(
                                            "flex items-center justify-between text-sm px-2 py-1.5 rounded transition-all",
                                            isActive
                                                ? "bg-primary/10 text-primary font-medium"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                        )}
                                    >
                                        <span className="truncate">{item.title}</span>
                                        <ArrowDownRight className={cn(
                                            "h-2.5 w-2.5 shrink-0 transition-transform",
                                            isActive ? "-rotate-45" : ""
                                        )} />
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </nav>
    );
}
