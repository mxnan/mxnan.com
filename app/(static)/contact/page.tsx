import ContactForm from "@/components/site-assets/contact-form";

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
