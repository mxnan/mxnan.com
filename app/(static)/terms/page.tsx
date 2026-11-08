import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms for freelance design and front-end engagements.",
  alternates: { canonical: "/terms" },
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen flex items-start justify-center pt-28 px-4">
      <div className="max-w-3xl w-full">
        <section className="max-w-[680px] mx-auto">
          <h1 className="text-2xl font-semibold">Terms of service</h1>
          <p className="mt-4 text-sm text-muted-foreground">Standard terms for freelance services. This is a placeholder — replace with your actual terms before public launch. Keep a short summary of scope, payment terms, and the cancellation policy here.</p>
        </section>
      </div>
    </main>
  );
}
