"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProgressRing from "../site-assets/progress-ring";
import ThemeToggle from "../theme-toggle";
import { Button } from "../ui/button";
import { HEADER_NAV } from "@/config/navigation";

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="fixed inset-x-0 top-6 z-50 pointer-events-none">
      <div className="mx-auto w-max pointer-events-auto">
        <nav
          className="mt-6 p-3 rounded-full border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/20 w-max"
          aria-label="Main navigation"
        >
          <div className="flex items-center gap-2">
          <ProgressRing />
          <ThemeToggle />

          {/* Desktop nav items */}
          <div className="flex items-center gap-2 ml-2">
              {HEADER_NAV.map(({ label, href, icon: Icon, ariaLabel }) => {
                const isActive = pathname === href;
                return (
                  <Link key={href} href={href} aria-current={isActive ? "page" : undefined}>
                    <Button variant={isActive ? "default" : "ghost"} size="icon" title={label} aria-label={ariaLabel}>
                      <Icon size={16} className="stroke-3" />
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </div>

    </header>
  );
}
