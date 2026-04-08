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
  metadataBase: new URL("https://mxnan.vercel.app/"),

  title: {
    default: "mxnan | Portfolio",
    template: "%s | mxnan",
  },

  description: "Personal portfolio and interactive component library",

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
            <div className="max-w-none mx-auto">
              {children}
            </div>
            <Toaster />
          </main>
        </Providers>

      </body>
    </html>
  );
}
