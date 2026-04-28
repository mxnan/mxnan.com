import { getAllShowcaseComponents } from "@/config/showcase";
import { ShowcaseSidebarClient } from "./showcase-sidebar-client";
import { ShowcaseSidebarMobile } from "./showcase-sidebar-client-mobile";

/**
 * ShowcaseSidebar — Server component that fetches from Velite
 * Passes minimal data to client component for active link detection
 * 
 * Desktop (md+): Sticky sidebar
 * Mobile: Fixed dialog button at bottom-left
 */
export function ShowcaseSidebar() {
    const allComponents = getAllShowcaseComponents();

    // Map to client component format
    const items = allComponents.map(({ category, slug, component }) => ({
        category,
        slug,
        title: component.title,
    }));

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden z-1000 md:block bg-background/80 backdrop-blur
      supports-[backdrop-filter]:bg-background/20 
       max-w-xs border border-border fixed left-2 top-1/2 -translate-y-1/2 h-fit 
       overflow-y-auto bg-accent rounded-lg p-4 md:p-6 scrollbar-hide">
                <ShowcaseSidebarClient items={items} />
            </aside>

            {/* Mobile Menu Button in Dialog */}
            <ShowcaseSidebarMobile items={items} />
        </>
    );
}
