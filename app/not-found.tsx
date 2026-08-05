import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="max-w-2xl text-center px-4">
        <h1 className="text-4xl font-semibold mb-4">Page not found</h1>
        <p className="text-muted-foreground mb-6">Sorry — we couldn’t find that page. Try returning home or contact me if you think this is an error.</p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/" className="bg-primary text-primary-foreground px-4 py-2 rounded-md">Go home</Link>
          <Link href="/contact" className="underline text-sm">Contact</Link>
        </div>
      </div>
    </main>
  );
}
