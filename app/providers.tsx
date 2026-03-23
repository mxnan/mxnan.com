"use client";
import { Cursor } from "@/components/site-assets/effects/cursor";
import { LenisProvider } from "@/components/site-assets/lenis-provider";
import { ThemeProvider } from "next-themes";
/// theme provider or any other providers later on
export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider
            enableSystem={true}
            attribute="class"
            defaultTheme="system"
            enableColorScheme
            disableTransitionOnChange
        ><LenisProvider>
                <Cursor />

                {children}
            </LenisProvider>
        </ThemeProvider>
    );
}