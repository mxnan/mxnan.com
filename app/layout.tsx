import type { Metadata } from "next";
import { Space_Grotesk, Tektur } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "./providers";
import Header from "@/components/nav/header";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const tektur = Tektur({
  variable: "--font-tektur",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "mxnan | Portfolio",
  description: "Personal portfolio and interactive component library",
  openGraph: {
    title: "mxnan | Portfolio",
    description: "Personal portfolio and interactive component library",
    type: "website",
    url: "https://mxnan.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${tektur.variable} antialiased`}
      >
        <Providers>
          <main className="relative bg-background text-foreground">
            <Header />
            <div className="max-w-none mx-auto px-4 py-24">
              {children}
            </div>
            <Toaster />
          </main>
        </Providers>

      </body>
    </html>
  );
}
