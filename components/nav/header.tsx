import Link from 'next/link'
import { ProgressBar } from '../site-assets/effects/progress-bar'
import ThemeToggle from '../theme-toggle'
import { Button } from '../ui/button'
import { BookText, Home, MonitorSmartphone } from 'lucide-react'

export default function Header() {
    return (
        <header
            className="z-50 fixed top-4 left-4 
     "
        >
            <nav className="h-14 p-4 flex items-center gap-2 w-min rounded-lg border 
      bg-background/80 backdrop-blur
      supports-[backdrop-filter]:bg-background/20 ">
                <div data-cursor="blend" className="flex items-center gap-2">
                    <ProgressBar />
                    <ThemeToggle />
                    <Link href="/">
                        <Button
                            variant="default"
                            size={"icon"}
                        >
                            <Home size={16} className="stroke-3" />
                        </Button>
                    </Link>
                    <Link href="/blogs">
                        <Button
                            variant="default"
                            size={"icon"}
                        >
                            <BookText size={16} className="stroke-3" />
                        </Button>
                    </Link>
                    <Link href="/blogs">
                        <Button
                            variant="default"
                            size={"icon"}
                        >
                            <MonitorSmartphone size={16} className="stroke-3" />
                        </Button>
                    </Link>

                </div>
                <div>

                </div>
            </nav>
        </header>
    )
}
