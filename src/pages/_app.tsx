import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import { Orbitron, Titillium_Web } from "next/font/google";

export const title = Orbitron({
  display: "swap",
  variable: "--font-title",
  subsets: ["latin"],
});

export const body = Titillium_Web({
  weight: ["200", "300", "400", "600", "700", "900"],
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <main
        className={cn("font-body antialiased", title.variable, body.variable)}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Component {...pageProps} />
          <Toaster />
        </ThemeProvider>
      </main>
    </>
  );
}
