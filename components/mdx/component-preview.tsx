"use client";

import dynamic from "next/dynamic";
import { AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

/**
 * LoadingFallback — Displayed while component lazy-loads
 */
function LoadingFallback() {
    return (
        <div className="flex items-center justify-center min-h-24 sm:h-32 bg-muted/50 rounded-lg sm:rounded-md w-full">
            <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-muted-foreground" />
                <p className="text-xs sm:text-sm text-muted-foreground">Loading preview...</p>
            </div>
        </div>
    );
}

/**
 * ErrorFallback — Displayed when component not found
 */
function ErrorFallback({ category, item }: { category: string; item: string }) {
    return (
        <div className="border border-destructive bg-destructive/5 dark:bg-destructive/10 rounded-lg sm:rounded-md p-3 sm:p-4 my-4 w-full overflow-hidden">
            <div className="flex gap-2 sm:gap-3">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-destructive shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                    <p className="font-medium text-destructive text-sm sm:text-base">Component not found</p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 break-words">
                        Could not load component from <code className="bg-muted px-1 py-0.5 rounded text-xs break-all">showcase/demo/{category}/{item}</code>
                    </p>
                    <p className="text-xs text-muted-foreground mt-2 break-words">
                        Make sure the file exists and is exported from <code className="bg-muted px-1 py-0.5 rounded text-xs break-all">showcase/demo/index.ts</code>
                    </p>
                </div>
            </div>
        </div>
    );
}

/**
 * ErrorBoundary for component failures
 */
interface ErrorBoundaryProps {
    children: ReactNode;
    category: string;
    item: string;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

class ComponentErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("[ComponentPreview]", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <ErrorFallback
                    category={this.props.category}
                    item={this.props.item}
                />
            );
        }

        return this.props.children;
    }
}

/**
 * Convert slug to export name with category suffix
 * 
 * Naming conventions:
 * - buttons/github-star → GithubStarButton
 * - loaders/bounce → BounceLoader
 * - text/animated-title → AnimatedTitle
 */
function slugToComponentName(slug: string, category: string): string {
    const pascalCase = slug
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');

    // Append category suffix (singular form)
    const categoryMap: Record<string, string> = {
        buttons: 'Button',
        loaders: 'Loader',
        text: '', // text components typically have no suffix
        other: '',
    };

    const suffix = categoryMap[category] || '';
    return pascalCase + suffix;
}

interface ComponentPreviewProps {
    category: string;
    item: string;
    className?: string;
}

/**
 * ComponentPreview — Dynamically loads and renders showcase components
 * 
 * Fetches from showcase/demo folder based on category and item slug.
 * Automatically converts item slug to PascalCase for the export name.
 * 
 * Usage in MDX:
 * <ComponentPreview category="buttons" item="github-star" />
 * 
 * This will load showcase/demo/buttons/github-star.tsx and look for
 * the GithubStarButton export in showcase/demo/index.ts
 */
export function ComponentPreview({
    category,
    item,
    className,
}: ComponentPreviewProps) {
    const componentName = slugToComponentName(item, category);

    // Dynamic import with error handling
    const Component = dynamic(
        async () => {
            try {
                const mod = await import("@/showcase/demo");
                const Component = mod[componentName as keyof typeof mod];

                if (!Component) {
                    console.error(`[ComponentPreview] Export "${componentName}" not found in @/showcase/demo`, {
                        available: Object.keys(mod),
                        requested: componentName,
                    });
                    throw new Error(`Export "${componentName}" not found`);
                }

                return { default: Component as React.ComponentType };
            } catch (error) {
                console.error(`[ComponentPreview] Failed to load ${category}/${item}:`, error);
                throw error;
            }
        },
        {
            ssr: false,
            loading: () => <LoadingFallback />,
            // Show error boundary instead of causing whitespace
        }
    );

    return (
        <ComponentErrorBoundary category={category} item={item}>
            <div
                className={cn(
                    "border border-border rounded-lg sm:rounded-md p-3 sm:p-4 my-4",
                    "bg-background",
                    "shadow-sm hover:shadow-md transition-shadow overflow-hidden",
                    className
                )}
            >
                <React.Suspense fallback={<LoadingFallback />}>
                    <Component />
                </React.Suspense>
            </div>
        </ComponentErrorBoundary>
    );
}