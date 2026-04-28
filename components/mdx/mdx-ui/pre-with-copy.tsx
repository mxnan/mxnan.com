"use client";

import { Check, Copy } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PreProps extends React.HTMLAttributes<HTMLPreElement> {
    className?: string;
}

// Pure function - extracted outside component to prevent recreations
const extractText = (node: React.ReactNode): string => {
    if (typeof node === "string") return node;

    if (Array.isArray(node)) {
        return node.map(extractText).join("");
    }

    if (React.isValidElement(node)) {
        return extractText((node as React.ReactElement<{ children?: React.ReactNode }>).props.children);
    }

    return "";
};

// Get first line of code
const getFirstLine = (node: React.ReactNode): string => {
    const text = extractText(node);
    return text.split('\n')[0].trim().slice(0, 50); // Limit to 50 chars for readability
};

const Pre: React.FC<PreProps> = ({ children, className, ...props }) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!copied) return;

        const timeout = setTimeout(() => {
            setCopied(false);
        }, 1800);

        return () => clearTimeout(timeout);
    }, [copied]);

    const copyToClipboard = useCallback(async () => {
        const text = extractText(children);

        try {
            await navigator.clipboard.writeText(text);
        } catch {
            // fallback
            const textarea = document.createElement("textarea");
            textarea.value = text;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
        }

        setCopied(true);
        const firstLine = getFirstLine(children);
        toast.success(`${firstLine} Copied`);
    }, []);

    return (
        <div className="group relative w-full">
            <pre
                className={cn(
                    "mb-4 mt-4 overflow-x-auto text-xs sm:text-sm rounded-lg sm:rounded-xl border",
                    "bg-muted/40 backdrop-blur-sm py-3 sm:py-4 px-3 sm:px-4",
                    "transition-colors duration-300",
                    className
                )}
                {...props}
            >
                {children}
            </pre>

            <button
                onClick={copyToClipboard}
                aria-label="Copy code"
                aria-live="polite"
                className={cn(
                    "absolute top-2 sm:top-3 right-2 sm:right-3 flex items-center justify-center cursor-none",
                    "h-8 w-8 sm:h-9 sm:w-9 rounded-md sm:rounded-lg border bg-background/70 backdrop-blur",
                    "transition-all duration-200 ease-out",
                    "hover:scale-105 active:scale-95 hover:bg-muted",
                    "focus:outline-none focus:ring-2 focus:ring-ring"
                )}
            >
                <span className="relative flex items-center justify-center">
                    <Copy
                        className={cn(
                            "h-3.5 w-3.5 sm:h-4 sm:w-4 absolute transition-all duration-200",
                            copied ? "opacity-0 scale-75" : "opacity-100 scale-100"
                        )}
                    />
                    <Check
                        className={cn(
                            "h-3.5 w-3.5 sm:h-4 sm:w-4 absolute transition-all duration-200",
                            copied ? "opacity-100 scale-100" : "opacity-0 scale-75"
                        )}
                    />
                </span>
            </button>
        </div>
    );
};

export default Pre;
