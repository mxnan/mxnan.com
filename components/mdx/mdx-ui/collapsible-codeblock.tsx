"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
    expandButtonTitle?: string;
}

export function CollapsibleCodeBlock({
    expandButtonTitle = "View Code",
    className,
    children,
    ...props
}: CodeBlockProps) {
    const [isOpened, setIsOpened] = React.useState(false);

    return (
        <Collapsible open={isOpened} onOpenChange={setIsOpened}>
            <div className={cn("my-4 overflow-hidden", className)} {...props}>
                <CollapsibleContent
                    forceMount
                    className={cn(
                        "overflow-hidden transition-all duration-300 ease-out",
                        !isOpened && "max-h-56 sm:max-h-80"
                    )}
                >
                    <div className="[&_pre]:my-0 [&_pre]:overflow-x-hidden">
                        {children}
                    </div>
                </CollapsibleContent>

                {/* Overlay gradient + button - only visible when collapsed */}
                {!isOpened && (
                    <div className="bg-gradient-to-t from-background via-background/80 to-transparent p-3 sm:p-4 flex items-center justify-center">
                        <CollapsibleTrigger asChild>
                            <Button variant="default" size="sm" className="text-xs font-semibold">
                                {expandButtonTitle}
                            </Button>
                        </CollapsibleTrigger>
                    </div>
                )}

                {/* Collapse button - only visible when expanded */}
                {isOpened && (
                    <div className="bg-muted/50 p-2 sm:p-3 flex items-center justify-center border-t border-border">
                        <CollapsibleTrigger asChild>
                            <Button variant="outline" size="sm" className="text-xs font-semibold">
                                Collapse Code
                            </Button>
                        </CollapsibleTrigger>
                    </div>
                )}
            </div>
        </Collapsible>
    );
}