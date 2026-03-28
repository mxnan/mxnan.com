import { cn } from "@/lib/utils";

interface FigCardProps {
    caption?: string;
    className?: string;
    children: React.ReactNode;
}

export function FigCard({ caption, className, children }: FigCardProps) {
    return (
        <figure className="my-8 not-prose">
            <div
                className={cn(
                    "overflow-hidden rounded-xl border border-border bg-muted/40 p-5",
                    className
                )}
            >
                <div className="text-sm text-muted-foreground leading-relaxed">
                    {children}
                </div>
            </div>
            {caption && (
                <figcaption className="mt-3 text-center text-xs text-muted-foreground">
                    {caption}
                </figcaption>
            )}
        </figure>
    );
}