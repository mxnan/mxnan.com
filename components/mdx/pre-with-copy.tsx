"use client";

import { Check, Copy } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

interface PreProps extends React.HTMLAttributes<HTMLPreElement> {
    className?: string;
}

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

const Pre: React.FC<PreProps> = ({ children, className, ...props }) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!copied) return;
        const t = setTimeout(() => setCopied(false), 1800);
        return () => clearTimeout(t);
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
        toast.success("Copied");
    }, [children]);

    return (
        <div className="group relative">
            <pre
                className={`
          mb-6 mt-6 overflow-x-auto text-sm rounded-xl border
          bg-muted/40 backdrop-blur-sm
          py-4 px-4
          transition-colors duration-300
          ${className || ""}
        `}
                {...props}
            >
                {children}
            </pre>

            <button
                onClick={copyToClipboard}
                aria-label="Copy code"
                aria-live="polite"
                className={`
          absolute top-3 right-3
          flex items-center justify-center
          h-9 w-9 rounded-lg border
          bg-background/70 backdrop-blur
          
          opacity-0 group-hover:opacity-100
          transition-all duration-200 ease-out
          
          hover:scale-105 active:scale-95
          hover:bg-muted
          
          focus:outline-none focus:ring-2 focus:ring-ring
        `}
            >
                <span className="relative flex items-center justify-center">
                    <Copy
                        className={`
              h-4 w-4 absolute transition-all duration-200
              ${copied ? "opacity-0 scale-75" : "opacity-100 scale-100"}
            `}
                    />
                    <Check
                        className={`
              h-4 w-4 absolute transition-all duration-200
              ${copied ? "opacity-100 scale-100" : "opacity-0 scale-75"}
            `}
                    />
                </span>
            </button>
        </div>
    );
};

export default Pre;
