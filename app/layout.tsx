import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { cn } from "@/lib/utils";
import ResponsiveSidebar from "@/components/responsive-sidebar";

const sans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s || mxnan",
    default: "mxnan",
  },
  description: `Personal website/blogs/components. Using Nextjs, Tailwind, Velite, Framer-motion and more.`,

  metadataBase: new URL("https://mxnan.vercel.app/"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mxnan.vercel.app/",
    siteName: "mxnan.com",

    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "mxnan.com",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "https://mxnan.vercel.app/",
    creator: "@etc_etcx",
    images: ["/opengraph-image.png"],
  },
  keywords: [
    "Next.js",
    "React",
    "Web Development",
    "Tailwind CSS",
    "Framer Motion",
    "Velite",
    "Components",
    "Blog",
    "Mdx",
  ],
  authors: [{ name: "mxnan", url: "https://mxnan.vercel.app/" }],
  creator: "mxnan",
  publisher: "mxnan",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff" },
    { media: "(prefers-color-scheme: dark)", color: "#000" },
  ],
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn("relative antialiased font-sans", sans.variable)}
      >
        <Providers>
          <>
            {/* <ResponsiveSidebar /> */}
            {children}
          </>
        </Providers>
      </body>
    </html>
  );
}
