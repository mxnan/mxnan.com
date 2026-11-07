

import Link from "next/link";
import TaglineReveal from "@/components/site-assets/tagline-reveal";

export default function Home() {
  return (
    <div className="relative w-full min-h-screen pt-16 px-4 lg:px-6">
      <div className="relative max-w-3xl mx-auto flex items-center justify-center h-screen">
        <section className="max-w-[680px] text-center">
          <h1 className="text-5xl md:text-6xl font-semibold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-[#000000] to-[#666666] dark:from-[#FFFFFF] dark:to-[#9B9B9B]">
            I design and build web products that people actually use
          </h1>

          <p className="mt-6 text-lg text-muted-foreground">
            Freelance product design and front‑end for early-stage teams — clear decisions, fast turnarounds. Tell me about your project and I’ll reply within 48 hours.
          </p>

          <div className="mt-6 flex items-center justify-center gap-4">
            <Link href="/contact" className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-md text-base font-semibold">
              Contact me
            </Link>
            <span className="text-sm text-muted-foreground">Recent writing below</span>
          </div>
        </section>
      </div>

      <TaglineReveal
        lines={[
          "I help teams ship interfaces people enjoy.",
          "Simple design, thoughtful code.",
        ]}
      />

      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="max-w-[680px] mx-auto text-center">
            <h3 className="text-2xl font-semibold">How I help</h3>
            <ul className="mt-6 space-y-4 text-left">
              <li>
                <strong>Clear decisions</strong> — Rapid design iterations that leave you a ship-ready front end and a prioritized roadmap.
              </li>
              <li>
                <strong>Fast delivery</strong> — Polished landing pages and prototypes in 1–3 weeks depending on scope.
              </li>
              <li>
                <strong>Readable code</strong> — Accessible, maintainable components and clean CSS that your team can keep using.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-12 bg-transparent">
        <div className="max-w-3xl mx-auto px-4">
          <div className="max-w-[680px] mx-auto text-center">
            <h3 className="text-2xl font-semibold">How it works</h3>
            <ol className="mt-6 space-y-6 text-left">
              <li>
                <strong>Tell me about the project</strong> — a short brief or a 15‑minute call is enough to scope the work and agree on a timeline.
              </li>
              <li>
                <strong>Design & iterate</strong> — wireframes and a clickable prototype so you can see the direction and give quick feedback.
              </li>
              <li>
                <strong>Ship</strong> — production-ready front-end, documentation, and a simple handoff so your team can take it further.
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="max-w-[880px] mx-auto">
            <h3 className="text-2xl font-semibold text-center">Recent writing</h3>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <article className="p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">“Working with them felt easy — clear updates and sensible trade-offs. Our onboarding completion improved and we launched on schedule.”</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">AS</div>
                  <div>
                    <div className="text-sm font-medium">Asha Srinivasan</div>
                    <div className="text-xs text-muted-foreground">Head of product, small retailer</div>
                  </div>
                </div>
              </article>

              <article className="p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">“Fast turnaround and thoughtful front-end. The prototype made stakeholder reviews simple and we shipped the landing page without surprises.”</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">MR</div>
                  <div>
                    <div className="text-sm font-medium">Marcus Ribeiro</div>
                    <div className="text-xs text-muted-foreground">Founder, analytics startup</div>
                  </div>
                </div>
              </article>
            </div>

            <div className="mt-6 text-center">
              <Link href="/blogs" className="text-sm underline">Read recent writing</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="max-w-[880px] mx-auto">
            <h3 className="text-2xl font-semibold text-center">Frequently asked</h3>

            <div className="mt-6 space-y-4">
              <details className="p-4 rounded-lg border border-border">
                <summary className="cursor-pointer font-medium">How long does a typical project take?</summary>
                <div className="mt-2 text-sm text-muted-foreground">Depending on scope: small landing pages are often 1–3 weeks; larger product work is scoped into phases with clear milestones.</div>
              </details>

              <details className="p-4 rounded-lg border border-border">
                <summary className="cursor-pointer font-medium">What do you need to get started?</summary>
                <div className="mt-2 text-sm text-muted-foreground">A short brief or a short call is perfect: goals, audience, success criteria, and any existing brand assets or examples you like.</div>
              </details>

              <details className="p-4 rounded-lg border border-border">
                <summary className="cursor-pointer font-medium">Do you accept small one-off jobs?</summary>
                <div className="mt-2 text-sm text-muted-foreground">Yes. I work with teams and founders on both short launches and longer engagements. Pricing is scoped to the work.</div>
              </details>

              <details className="p-4 rounded-lg border border-border">
                <summary className="cursor-pointer font-medium">How do you handle communication?</summary>
                <div className="mt-2 text-sm text-muted-foreground">Email or Slack for day-to-day; scheduled reviews for design milestones. I keep feedback loops short and focused.</div>
              </details>

              <details className="p-4 rounded-lg border border-border">
                <summary className="cursor-pointer font-medium">What does handoff include?</summary>
                <div className="mt-2 text-sm text-muted-foreground">Production-ready front-end code, a component guide, and a short README describing how to extend or deploy the work.</div>
              </details>

              <details className="p-4 rounded-lg border border-border">
                <summary className="cursor-pointer font-medium">How do we get started?</summary>
                <div className="mt-2 text-sm text-muted-foreground">Use the contact form to send a short brief or booking link. I’ll reply with availability and next steps within 48 hours.</div>
              </details>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="max-w-[680px] mx-auto text-center">
            <h3 className="text-2xl font-semibold">Ready to get started?</h3>
            <p className="mt-4 text-muted-foreground">If you’ve got a project, I’d love to hear about it. Send a quick brief and I’ll get back with timing and next steps.</p>
            <div className="mt-6">
              <Link href="/contact" className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-md text-base font-semibold">Contact me</Link>
            </div>
          </div>
        </div>
      </section>

  </div>
  );
}