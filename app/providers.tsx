"use client";
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
    >
      {children}
    </ThemeProvider>
  );
}


 