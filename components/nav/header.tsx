import Link from 'next/link'
import { ProgressBar } from '../site-assets/effects/progress-bar'
import ThemeToggle from '../theme-toggle'
import { Button } from '../ui/button'
import { BookText, Home, MailPlus, MonitorSmartphone } from 'lucide-react'

export default function Header() {
    return (
        <header
            className="z-1000 fixed top-6 left-1/2 -translate-x-1/2
     "
        >
            <nav className="p-4 w-min rounded-lg border 
      bg-background/80 backdrop-blur
      supports-[backdrop-filter]:bg-background/20 ">
                <div data-cursor="blend" className="flex flex-row items-center gap-2 ">
                    <ProgressBar />
                    <ThemeToggle />
                    <Link href="/" className="group">
                        <Button
                            variant="default"
                            size={"icon"}
                            className='group-hover:bg-muted-foreground cursor-none'
                        >
                            <Home size={16} className="stroke-3" />
                        </Button>
                    </Link>
                    <Link href="/blogs" className="group">
                        <Button
                            variant="default"
                            size={"icon"}
                            className='group-hover:bg-muted-foreground cursor-none'
                        >
                            <BookText size={16} className="stroke-3" />
                        </Button>
                    </Link>
                    <Link href="/showcase" className="group">
                        <Button
                            variant="default"
                            size={"icon"}
                            className='group-hover:bg-muted-foreground cursor-none'
                        >
                            <MonitorSmartphone size={16} className="stroke-3" />
                        </Button>
                    </Link>
                    <Link href="/blogs" className="group">
                        <Button
                            variant="default"
                            size={"icon"}
                            className='group-hover:bg-muted-foreground cursor-none'
                        >
                            <MailPlus size={16} className="stroke-3" />
                        </Button>
                    </Link>
                </div>
            </nav>
        </header>
    )
}
