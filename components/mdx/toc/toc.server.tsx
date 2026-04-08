import { cn } from "@/lib/utils";

export interface TocEntry {
    items?: TocEntry[];
    url: string;
    title: string;
}

interface TreeProps {
    tree: TocEntry[];
    level?: number;
}

/**
 * Server-rendered TOC tree structure
 * Pure rendering, no client-side interactivity
 */
export function TocTree({ tree, level = 1 }: TreeProps) {
    if (!tree.length || level >= 3) return null;

    return (
        <ul className={cn("m-0 list-none", { "pl-3": level !== 1 })}>
            {tree.map((item, index) => (
                <li key={index} className={cn("mt-0 pt-2")}>
                    <a
                        href={item.url}
                        className={cn(
                            "inline-blockrelative text-sm pl-3 transition-colors duration-300 ease-in-out truncate w-full",
                            "text-muted-foreground hover:text-primary"
                        )}
                    >
                        {item.title}
                    </a>
                    {item.items?.length ? (
                        <TocTree tree={item.items} level={level + 1} />
                    ) : null}
                </li>
            ))}
        </ul>
    );
}