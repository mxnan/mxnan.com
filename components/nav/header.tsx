import { ProgressBar } from '../site-assets/effects/progress-bar'
import ThemeToggle from '../theme-toggle'

export default function Header() {
    return (
        <header
            className="z-50 fixed top-4 left-4 
     "
        >
            <nav data-cursor="blend" className="h-14 p-4 flex items-center gap-6 w-min rounded-lg border 
      bg-background/80 backdrop-blur
      supports-[backdrop-filter]:bg-background/20 ">
                <div className="flex items-center gap-2">
                    <ProgressBar /> <ThemeToggle />

                </div>
                <div>mxn8n</div>
            </nav>
        </header>
    )
}
