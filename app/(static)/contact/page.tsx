import type { Metadata } from "next";
import ContactForm from "@/components/site-assets/contact-form";
import {
  DEFAULT_OG_IMAGE,
  SITE_LOCALE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell mxnan about your product, timeline, and goals. Send a short brief and get a reply within 48 hours.",
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/contact`,
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    title: `Contact | ${SITE_NAME}`,
    description:
      "Tell mxnan about your product, timeline, and goals. Send a short brief and get a reply within 48 hours.",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `Contact | ${SITE_NAME}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Contact | ${SITE_NAME}`,
    description:
      "Tell mxnan about your product, timeline, and goals. Send a short brief and get a reply within 48 hours.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen flex items-start justify-center pt-28 px-4">
      <div className="max-w-3xl w-full">
        <section className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-semibold">Let’s talk about your project</h1>
          <p className="mt-4 text-muted-foreground">Send a short brief or a link to examples. If it’s a good fit I’ll reply with timing and next steps within 48 hours.</p>

          <div className="mt-8">
            <ContactForm />
          </div>
        </section>
      </div>
    </main>
  );
}
