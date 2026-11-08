import type { Metadata } from "next";
import { Anybody, Bebas_Neue, Fira_Code } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "./providers";
import Header from "@/components/nav/header";
import Footer from "@/components/nav/footer";
import { JsonLd } from "@/components/seo/json-ld";
import { professionalServiceSchema, websiteSchema } from "@/lib/seo";
import {
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_LOCALE,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/site";

const sans = Anybody({
  variable: "--font-sans",
  subsets: ["latin"],
});

const serif = Bebas_Neue({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
});

const mono = Fira_Code({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: SITE_TITLE,
    template: "%s | mxnan", // child pages return a bare title
  },

  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  keywords: SITE_KEYWORDS,
  category: "Design & Development",

  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: SITE_TITLE,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  // Set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION to verify Search Console.
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sans.variable} ${mono.variable} ${serif.variable} antialiased`}
      >
        <Providers>
          <JsonLd data={websiteSchema()} />
          <JsonLd data={professionalServiceSchema()} />

          {/* skip link for keyboard users */}
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-background focus:text-foreground focus:px-3 focus:py-2 focus:rounded"
          >
            Skip to content
          </a>

          <main id="content" className="relative w-full">
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
