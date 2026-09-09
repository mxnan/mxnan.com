/**
 * MDX Content Renderer
 *
 * This module safely compiles and renders MDX code at runtime without violating
 * React 19's "Cannot create components during render" rule.
 *
 * Architecture:
 * • Module-level compilation caches (mdxFunctionCache, mdxComponentCache)
 *   prevent duplicate compilations and ensure stable component instances
 * • getMDXComponent() uses cache-first lookup before calling new Function()
 * • useMemo() dependency on 'code' ensures cache is leveraged properly
 *
 * React 19 Compliance:
 * ✓ new Function(code) only called once per unique code string
 * ✓ Compiled components cached and reused across renders
 * ✓ getMDXComponent() is safe to call from useMemo
 *
 * Flow:
 * Velite (build-time) → MDX code string
 *   ↓
 * MDXContent component receives code prop
 *   ↓
 * useMemo(getMDXComponent(code), [code])
 *   ↓
 * getMDXComponent checks cache, compiles once if needed
 *   ↓
 * cached React component returned
 *   ↓
 * Component executed with component map (blogComponents or componentComponents)
 */

/* eslint-disable react-hooks/static-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as runtime from "react/jsx-runtime";
import { useMemo } from "react";
import { BaseComponents } from "./base-mdx";
import { Button } from "../ui/button";
import Link from "next/link";
import MDXErrorBoundary from "./error-boundary";
import { FigCard } from "./mdx-ui/figcard";
import { ComponentPreview } from "./component-preview";
import { CollapsibleCodeBlock } from "./mdx-ui/collapsible-codeblock";

// ─────────────────────────────────────────────────────────────────────────────
// Component Maps
// ─────────────────────────────────────────────────────────────────────────────

/**
 * coreComponents — Components available in all MDX contexts
 *
 * Includes:
 * • BaseComponents: headings (h1-h6), paragraphs, lists, tables, blockquotes, code blocks
 * • Button: Shadcn UI button component
 * • FigCard: Custom figure + caption component
 * • a: Next.js Link (for client-side navigation)
 * • CollapsibleCodeBlock: Expandable code sections
 */
const coreComponents = {
  ...BaseComponents,
  Button,
  FigCard,
  a: Link,
  CollapsibleCodeBlock,
};

/**
 * blogComponents — Components available in blog post MDX
 *
 * Same as coreComponents (no additional components needed for blog posts)
 */
const blogComponents = coreComponents;

/**
 * componentComponents — Components available in component showcase MDX
 *
 * Extends coreComponents with:
 * • ComponentPreview: Dynamic component showcase renderer
 */
const componentComponents = {
  ...coreComponents,
  ComponentPreview,
};

// ─────────────────────────────────────────────────────────────────────────────
// MDX Compilation Caching
// ─────────────────────────────────────────────────────────────────────────────

/**
 * mdxFunctionCache — Stores compiled MDX functions
 *
 * Key: MDX code string
 * Value: Function that executes the MDX with runtime context
 *
 * Why: Calling new Function(code) is expensive. We compile each unique code
 *      string exactly once and reuse the function across renders.
 *
 * Type: (args: { [key: string]: unknown }) => { default: React.ComponentType<any> }
 *       - Takes runtime context (jsx-runtime exports)
 *       - Returns object with .default property (the React component)
 */
const mdxFunctionCache = new Map<
  string,
  (args: { [key: string]: unknown }) => { default: React.ComponentType<any> }
>();

/**
 * mdxComponentCache — Stores compiled React components
 *
 * Key: MDX code string
 * Value: The React component extracted from the compiled function
 *
 * Why: Avoids re-executing the cached function on every render.
 *      Once we have the component, we can return it directly.
 *
 * Type: React.ComponentType<any>
 *       - A React functional component that accepts { components } prop
 */
const mdxComponentCache = new Map<string, React.ComponentType<any>>();

/**
 * getMDXComponent — Compile and cache MDX code
 *
 * This is the core of React 19 compliance. Instead of calling new Function()
 * during render, we check the cache first and only compile on a cache miss.
 *
 * Process:
 * 1. Check mdxComponentCache for existing compiled component
 * 2. If found: return immediately (no compilation needed)
 * 3. If miss: check mdxFunctionCache for existing function
 * 4. If not cached: compile with new Function(code) and cache it
 * 5. Execute cached function with runtime context
 * 6. Extract component from result and cache it
 * 7. Return component
 *
 * Performance:
 * • First call for code "X": new Function(), execution, 2 cache writes
 * • Second call for code "X": 1 cache lookup, immediate return
 *
 * Safe to call from useMemo because:
 * • Returns same component instance for same code string
 * • Caching prevents re-compilation
 * • Dependencies match cache key (code)
 *
 * @param code MDX compiled code string (from Velite)
 * @returns React component ready to render
 */
function getMDXComponent(code: string): React.ComponentType<any> {
  // Cache hit: component already compiled
  if (mdxComponentCache.has(code)) {
    return mdxComponentCache.get(code)!;
  }

  // Compile the function if not cached
  if (!mdxFunctionCache.has(code)) {
    const fn = new Function(code) as (args: { [key: string]: unknown }) => {
      default: React.ComponentType<any>;
    };
    mdxFunctionCache.set(code, fn);
  }

  // Execute the cached function with React runtime
  const fn = mdxFunctionCache.get(code)!;
  const component = fn({ ...runtime }).default;

  // Cache the component for next time
  mdxComponentCache.set(code, component);

  return component;
}

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * MDXType — Kind of MDX document
 *
 * "blog": Blog post (uses blogComponents)
 * "component": Component showcase (uses componentComponents, includes ComponentPreview)
 */
type MDXType = "blog" | "component";

/**
 * MDXProps
 *
 * code: MDX compiled code string from Velite
 *       Format: JavaScript code that exports a default React component
 *       Example: "import {jsxs as _jsxs} from 'react/jsx-runtime'; export default function MDXContent({...}){...}"
 *
 * type: MDX context type (default: "blog")
 *       Determines which component map to use (blogComponents vs componentComponents)
 */
interface MDXProps {
  code: string;
  type?: MDXType;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * MDXContent — Render MDX code with component support
 *
 * This is the main component used by all pages to render MDX content
 * (blog posts, component docs, etc.).
 *
 * Process:
 * 1. useMemo ensures getMDXComponent is only called when 'code' changes
 * 2. Determine which component map to use based on 'type'
 * 3. Wrap in error boundary for graceful error handling
 * 4. Execute component with component map as props
 *
 * Usage:
 * import { blogs } from "#site/content";
 *
 * export function BlogPostPage({ slug }: { slug: string }) {
 *   const post = blogs.find(b => b.slugAsParams === slug);
 *   if (!post) return <NotFound />;
 *
 *   return <MDXContent code={post.body} type="blog" />;
 * }
 *
 * Props passed to MDX component:
 * • components: { h1, h2, pre, code, ComponentPreview, etc. }
 *   These override standard HTML elements and add custom ones
 *
 * Error Handling:
 * • Error boundary catches render errors
 * • Displays helpful error message in development
 * • Prevents entire page from crashing
 */
export function MDXContent({ code, type = "blog" }: MDXProps) {
  // Compile or retrieve cached component
  // Only re-compiles if code string changes
  const Component = useMemo(() => getMDXComponent(code), [code]);

  // Choose component map based on context
  const components =
    type === "component" ? componentComponents : blogComponents;

  return (
    <MDXErrorBoundary>
      <div className="relative h-full w-full">
        {/* Pass component map to MDX component */}
        <Component components={components} />
      </div>
    </MDXErrorBoundary>
  );
}
