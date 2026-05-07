import { ReactNode } from "react";
import { ShowcaseSidebar } from "@/components/nav/showcase-sidebar";

export default function ShowcaseLayout({ children }: { children: ReactNode }) {
    return (
        <div className="w-full min-h-screen bg-background ">
            <div className="relative min-h-screen pt-32 px-4 lg:px-6">
                {/* Sidebar - Left */}
                <ShowcaseSidebar />

                {/* Content - Center */}
                <main className="max-w-3xl mx-auto">
                    {children}
                </main>


            </div>
        </div>
    );
}