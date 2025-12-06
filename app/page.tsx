import ThemeToggle from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <section className="relative w-full min-h-screen ">
      <nav
        className="z-50 fixed top-2 left-2 w-min px-3 py-2
        border
      bg-background/95 backdrop-blur rounded-xl
      supports-backdrop-filter:bg-background/60"
      >
        <div className="flex items-center justify-start gap-4">
          <ThemeToggle />
          <Link
            href="/"
            className="text-xs border-b border-transparent hover:border-primary transition-all duration-300 font-light font-mono"
          >
            mxnan.com
          </Link>
        </div>
      </nav>
      <div
        className="z-50 fixed top-4 right-4 w-min 
       bg-background/95 backdrop-blur rounded-xl
       supports-backdrop-filter:bg-background/60"
      >
        <div className="flex items-center justify-start gap-4">
          <Button size={"lg"}>
            Let's talk <MessageCircle />
          </Button>
        </div>
      </div>
      <div className="relative w-full ">
        <div className="">
          <div className="h-screen flex items-center justify-center">
            {" "}
            <Button>
              Click me <ClipboardCheck />{" "}
            </Button>
          </div>
          <div className="h-screen flex items-center justify-center">
            <Button>
              Click me <ClipboardCheck />{" "}
            </Button>
          </div>
          <div className="h-screen flex items-center justify-center">
            <Button>
              Click me <ClipboardCheck />{" "}
            </Button>
          </div>
          <div className="h-screen flex items-center justify-center">
            <Button>
              Click me <ClipboardCheck />{" "}
            </Button>
          </div>
          <div className="h-screen flex items-center justify-center">
            <Button>
              Click me <ClipboardCheck />{" "}
            </Button>
          </div>
        </div>{" "}
      </div>
    </section>
  );
}
