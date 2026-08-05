import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-t-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/20">
      <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">© {new Date().getFullYear()} mxnan — freelance product design & front-end</div>

        <nav aria-label="Footer" className="flex items-center gap-4">
          <Link href="/contact" className="text-sm underline">Contact</Link>
          <Link href="/privacy" className="text-sm underline">Privacy</Link>
          <Link href="/terms" className="text-sm underline">Terms</Link>
        </nav>
      </div>
    </footer>
  );
}
