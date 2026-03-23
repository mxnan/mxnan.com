import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "./providers";
import Header from "@/components/nav/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <main className="relative flex-1">
            <Header />
            {children}
            <Toaster />
          </main>
        </Providers>

      </body>
    </html>
  );
}
