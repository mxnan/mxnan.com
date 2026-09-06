"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "../theme-toggle";
import { Button } from "../ui/button";
import { HEADER_NAV } from "@/config/navigation";
import { ProgressRing } from "../site-assets/progress-ring";

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="fixed inset-x-0 top-4 z-50">
      <div className="mx-auto w-max pointer-none">
        <nav
          className="mt-4 p-3 rounded-full border bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/20 w-max "
          aria-label="Main navigation"
          data-cursor="invert" 
        >
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
                  <ProgressRing />
            <ThemeToggle />
            </div>
        

            {/* Desktop nav items */}
            <div className="flex items-center gap-2 ml-2">
              {HEADER_NAV.map(({ label, href, icon: Icon, ariaLabel }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    // data-cursor-magnetic
                    // data-cursor="pointer"
                  >
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="icon"
                      title={label}
                      aria-label={ariaLabel}
                      className="transition-transform duration-200 ease-in-out transform-gpu hover:-translate-y-0.5 hover:scale-105 focus-visible:scale-105"
                    >
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
