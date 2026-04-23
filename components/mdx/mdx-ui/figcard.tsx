import { cn } from "@/lib/utils";

interface FigCardProps {
    caption?: string;
    className?: string;
    children: React.ReactNode;
}

export function FigCard({ caption, className, children }: FigCardProps) {
    return (
        <figure className="my-4 not-prose">
            <div
                className={cn(
                    "overflow-hidden rounded-lg sm:rounded-xl border border-border bg-muted/40 p-3 sm:p-5",
                    className
                )}
            >
                <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {children}
                </div>
            </div>
            {caption && (
                <figcaption className="mt-2 text-center text-xs text-muted-foreground">
                    {caption}
                </figcaption>
            )}
        </figure>
    );
}