/**
 * ComponentPreview — Dynamic showcase component renderer
 * 
 * This module provides a safe way to lazy-load and display interactive components
 * in MDX content without violating React 19's "Cannot create components during render" rule.
 * 
 * Architecture:
 * • Module-level component registry (createComponentRegistry) — all dynamic() calls
 *   are defined at module scope, NEVER during render
 * • Error boundary (ComponentErrorBoundary) — catches component load/render errors
 * • Fallback UIs (LoadingFallback, ErrorFallback) — user-friendly error states
 * 
 * React 19 Compliance:
 * ✓ No dynamic() calls inside component functions
 * ✓ No new Function() during render (see mdx.tsx for caching pattern)
 * ✓ All component creation at module scope
 * ✓ Proper caching prevents duplicate compilations
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import dynamic from "next/dynamic";
import { AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

/**
 * LoadingFallback — Loading spinner UI
 * Displayed while component bundle is fetched and mounted
 */
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-24 sm:h-32 bg-muted/50 rounded-lg sm:rounded-md w-full">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-muted-foreground" />
        <p className="text-xs sm:text-sm text-muted-foreground">
          Loading preview...
        </p>
      </div>
    </div>
  );
}

/**
 * createComponentRegistry — Build module-level component registry
 * 
 * This function is called ONCE at module import time, not during render.
 * All dynamic() calls MUST be inside this function to comply with React 19.
 * 
 * How it works:
 * 1. Each entry key: "category/item" (e.g., "buttons/github-star")
 * 2. Each entry value: next/dynamic() with lazy import + error handling
 * 3. dynamic() wraps the component with ssr:false and LoadingFallback
 * 
 * To add a new component:
 * 1. Create file: showcase/demo/[category]/component-name.tsx
 * 2. Export it: export { ComponentName } from "./[category]/component-name"
 * 3. Add entry below:
 *    "[category]/component-name": dynamic(
 *      () => import("@/showcase/demo").then((mod) => ({
 *        default: mod.ComponentName,
 *      })),
 *      { ssr: false, loading: LoadingFallback }
 *    )
 * 4. Use in MDX: <ComponentPreview category="category" item="component-name" />
 */
function createComponentRegistry(): Record<string, React.ComponentType<any>> {
  return {
    // ─── Buttons ────────────────────────────────────────────────────
    "buttons/github-star": dynamic(
      () =>
        import("@/showcase/demo").then((mod) => ({
          default: mod.GithubStarButton,
        })),
      {
        ssr: false,
        loading: LoadingFallback,
      }
    ),
    "buttons/magnet": dynamic(
      () =>
        import("@/showcase/demo").then((mod) => ({
          default: mod.MagnetButton,
        })),
      {
        ssr: false,
        loading: LoadingFallback,
      }
    ),

    // ─── Loaders ────────────────────────────────────────────────────
    // "loaders/bounce": dynamic(...),
    // "loaders/pulse": dynamic(...),

    // ─── Text ───────────────────────────────────────────────────────
    // "text/animated-title": dynamic(...),
    // "text/gradient-text": dynamic(...),

    // ─── Other ──────────────────────────────────────────────────────
    // Add your custom categories and components here
  };
}

/**
 * componentRegistry — Global component registry instance
 * 
 * Created at module import time, meaning all dynamic() imports are set up
 * before ANY React components render. This is the key to React 19 compliance.
 * 
 * Never modify this directly. Add entries to createComponentRegistry() instead.
 */
const componentRegistry = createComponentRegistry();

/**
 * ErrorFallback — Error state UI
 * 
 * Displayed when:
 * • ComponentPreview receives an unknown category/item combination
 * • Component fails to import from showcase/demo
 * • Component throws an error during render
 * 
 * Props:
 * • category: The category slug (e.g., "buttons", "loaders")
 * • item: The component slug (e.g., "github-star", "bounce")
 */
function ErrorFallback({ category, item }: { category: string; item: string }) {
  return (
    <div className="border border-destructive bg-destructive/5 dark:bg-destructive/10 rounded-lg sm:rounded-md p-3 sm:p-4 my-4 w-full overflow-hidden">
      <div className="flex gap-2 sm:gap-3">
        <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-destructive shrink-0 mt-0.5" />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-destructive text-sm sm:text-base">
            Component not found
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 wrap-break-word">
            Could not load component from{" "}
            <code className="bg-muted px-1 py-0.5 rounded text-xs break-all">
              showcase/demo/{category}/{item}
            </code>
          </p>
          <p className="text-xs text-muted-foreground mt-2 wrap-break-word">
            Make sure the file exists and is exported from{" "}
            <code className="bg-muted px-1 py-0.5 rounded text-xs break-all">
              showcase/demo/index.ts
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * ComponentErrorBoundary — React Error Boundary for component errors
 * 
 * Catches errors that occur during:
 * • Component render
 * • Component lifecycle (if using class components)
 * • Child component errors
 * 
 * Does NOT catch:
 * • Async errors (use try/catch)
 * • Event handler errors (use try/catch in handlers)
 * • Server-side errors
 * 
 * When an error is caught, displays ErrorFallback instead of crashing.
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

class ComponentErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
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
        <ErrorFallback category={this.props.category} item={this.props.item} />
      );
    }

    return this.props.children;
  }
}

/**
 * ComponentPreviewProps
 * 
 * category: The component category (e.g., "buttons", "loaders", "text")
 *           Maps to showcase/demo/[category]/ directory
 * 
 * item: The component slug (e.g., "github-star", "bounce", "animated-title")
 *       Maps to showcase/demo/[category]/[item].tsx
 *       Combined with category to form registry key: "category/item"
 * 
 * className: Optional Tailwind classes to extend the wrapper div
 *            Useful for sizing: className="h-72 w-full flex items-center justify-center"
 */
interface ComponentPreviewProps {
  category: string;
  item: string;
  className?: string;
}

/**
 * ComponentPreview — Main component
 * 
 * Safe MDX component for rendering interactive component showcases.
 * 
 * How it works:
 * 1. Constructs key: `${category}/${item}` (e.g., "buttons/github-star")
 * 2. Looks up key in componentRegistry (created at module scope)
 * 3. If found: wraps in error boundary + suspense, renders with fallbacks
 * 4. If not found: shows ErrorFallback with helpful message
 * 
 * React 19 Compliance:
 * ✓ Zero component creation during render
 * ✓ All dynamic() imports defined at module scope
 * ✓ Error boundary catches render errors
 * ✓ Suspense + loading fallback for async imports
 * 
 * Usage in MDX:
 * <ComponentPreview category="buttons" item="github-star" />
 * <ComponentPreview category="loaders" item="bounce" className="h-72" />
 * 
 * Console Logging:
 * • Registry miss: logs error with available keys and requested key
 * • Error boundary: logs any component render errors to console
 */
export function ComponentPreview({
  category,
  item,
  className,
}: ComponentPreviewProps) {
  const key = `${category}/${item}`;
  const Component = componentRegistry[key];

  // Component not found in registry
  if (!Component) {
    console.error(
      `[ComponentPreview] Component not found in registry: "${key}"`,
      {
        available: Object.keys(componentRegistry),
        requested: key,
      }
    );
    return <ErrorFallback category={category} item={item} />;
  }

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
        {/* Suspense for dynamic component loading */}
        <React.Suspense fallback={<LoadingFallback />}>
          <Component />
        </React.Suspense>
      </div>
    </ComponentErrorBoundary>
  );
}
