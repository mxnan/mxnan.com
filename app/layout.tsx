import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "./providers";
import Header from "@/components/nav/header";
import Footer from "@/components/nav/footer";

const poppins = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),

  title: {
    default: "mxnan | Portfolio",
    template: "%s | mxnan", // child pages just return the bare title
  },

  description: "Personal portfolio and interactive component library",

  openGraph: {
    type: "website",
    siteName: "mxnan",
    images: [{ url: "/og/default.jpg", width: 1200, height: 630 }],
  },

  twitter: {
    card: "summary_large_image",
    images: ["/og/default.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} antialiased`}>
        <Providers>
          {/* skip link for keyboard users */}
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-background focus:text-foreground focus:px-3 focus:py-2 focus:rounded"
          >
            Skip to content
          </a>

          <main
            id="content"
            className="relative w-full font-sans bg-background text-foreground"
          >
            <Header />
            <div className="relative w-full h-full mt-32">{children}</div>
            <Footer />
            <Toaster />
          </main>
        </Providers>
      </body>
    </html>
  );
}
