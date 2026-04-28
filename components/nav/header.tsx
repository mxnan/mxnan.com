"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProgressBar } from "../site-assets/effects/progress-bar";
import ThemeToggle from "../theme-toggle";
import { Button } from "../ui/button";
import { HEADER_NAV } from "@/config/navigation";

export default function Header() {
    const pathname = usePathname();

    return (
        <header
            className="z-1000 fixed top-6 left-1/2 -translate-x-1/2"
            role="banner"
        >
            <nav
                className="p-4 w-min rounded-lg border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/20"
                aria-label="Main navigation"
            >
                <div data-cursor="blend" className="flex flex-row items-center gap-2">
                    <ProgressBar />
                    <ThemeToggle />
                    {HEADER_NAV.map(({ label, href, icon: Icon, ariaLabel }) => {
                        const isActive = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                aria-current={isActive ? "page" : undefined}
                            >
                                <Button
                                    variant="default"
                                    size="icon"
                                    className="group-hover:bg-muted-foreground cursor-none"
                                    aria-label={ariaLabel}
                                    title={label}
                                >
                                    <Icon size={16} className="stroke-3" />
                                </Button>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </header>
    );
}
