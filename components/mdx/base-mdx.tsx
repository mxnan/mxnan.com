import { cn } from "@/lib/utils";
import React, { HTMLAttributes } from "react";
import Pre from "./mdx-ui/pre-with-copy";

// ─── Helpers ────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Returns the id slug from children.
 * Handles string children and arrays of strings/React elements.
 */
function getHeadingId(children: React.ReactNode, fallback: string): string {
  if (typeof children === "string") return slugify(children);
  if (Array.isArray(children)) {
    const text = children
      .map((c) => (typeof c === "string" ? c : ""))
      .join("");
    return text ? slugify(text) : fallback;
  }
  return fallback;
}

/**
 * Detects block-level elements inside children.
 * When present the `p` component must render as `div` to avoid
 * the React "cannot nest <p>" hydration error.
 */
const BLOCK_TYPES = new Set([
  "div", "section", "article", "aside", "figure", "figcaption",
  "ul", "ol", "li", "blockquote", "pre", "table",
  "h1", "h2", "h3", "h4", "h5", "h6", "hr", "p",
]);

function hasBlockChild(children: React.ReactNode): boolean {
  const checkNode = (node: React.ReactNode): boolean =>
    React.Children.toArray(node).some((child) => {
      if (!React.isValidElement(child)) return false;

      const type = child.type;
      const props = (child as React.ReactElement<any>).props;

      if (typeof type === "string") {
        if (BLOCK_TYPES.has(type)) return true;
        return checkNode(props.children);
      }

      if (type === React.Fragment) {
        return checkNode(props.children);
      }

      // Custom component: assume block-like if unknown, or recursively inspect if it has children.
      if (props?.children) {
        return checkNode(props.children);
      }
      return true;
    });

  return checkNode(children);
}

type ComponentsProps = HTMLAttributes<HTMLElement>;

// ─── Components ─────────────────────────────────────────────────────────────

export const BaseComponents = {
  // ── Headings ──────────────────────────────────────────────────────────────

  h1: ({ className, children, ...props }: ComponentsProps) => (
    <h1
      id={getHeadingId(children, "h1")}
      className={cn(
        "mt-8 mb-4 scroll-m-32 font-mono font-bold text-2xl sm:text-3xl md:text-4xl tracking-tight",
        "first:mt-0",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  ),

  h2: ({ className, children, ...props }: ComponentsProps) => (
    <h2
      id={getHeadingId(children, "h2")}
      className={cn(
        "mt-8 mb-3 scroll-m-32 font-mono font-bold text-lg sm:text-2xl tracking-tight leading-tight",
        "first:mt-0",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  ),

  h3: ({ className, children, ...props }: ComponentsProps) => (
    <h3
      id={getHeadingId(children, "h3")}
      className={cn(
        "mt-6 mb-2 scroll-m-32 font-mono font-bold text-base sm:text-xl tracking-tight leading-tight",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  ),

  h4: ({ className, children, ...props }: ComponentsProps) => (
    <h4
      id={getHeadingId(children, "h4")}
      className={cn(
        "mt-6 mb-2 scroll-m-16 font-mono font-bold text-sm sm:text-base tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </h4>
  ),

  // ── Paragraph ─────────────────────────────────────────────────────────────
  // Renders as <div> when block-level children are detected to prevent
  // the React "cannot nest <p>" hydration error from MDX output.

  p: ({ className, children, ...props }: ComponentsProps) => {
    if (hasBlockChild(children)) {
      return (
        <div
          className={cn("leading-7 text-xs sm:text-sm md:text-base mt-4", className)}
          {...props}
        >
          {children}
        </div>
      );
    }
    return (
      <p
        className={cn("leading-7 text-xs sm:text-sm md:text-base mt-4", className)}
        {...props}
      >
        {children}
      </p>
    );
  },

  // ── Inline ────────────────────────────────────────────────────────────────

  strong: ({ className, ...props }: ComponentsProps) => (
    <strong
      className={cn("font-semibold text-foreground", className)}
      {...props}
    />
  ),

  em: ({ className, ...props }: ComponentsProps) => (
    <em
      className={cn("not-italic text-muted-foreground", className)}
      {...props}
    />
  ),

  // ── Lists ─────────────────────────────────────────────────────────────────

  ul: ({ className, ...props }: ComponentsProps) => (
    <ul
      className={cn(
        "my-4 ml-4 sm:ml-5 list-disc space-y-1.5 text-xs sm:text-sm md:text-base text-muted-foreground",
        "[&>li]:pl-1",
        className
      )}
      {...props}
    />
  ),

  ol: ({ className, ...props }: ComponentsProps) => (
    <ol
      className={cn(
        "my-4 ml-4 sm:ml-5 list-decimal space-y-1.5 text-xs sm:text-sm md:text-base text-muted-foreground",
        "[&>li]:pl-1",
        className
      )}
      {...props}
    />
  ),

  li: ({ className, ...props }: ComponentsProps) => (
    <li
      className={cn("text-xs sm:text-sm md:text-base leading-relaxed", className)}
      {...props}
    />
  ),

  // ── Blockquote ────────────────────────────────────────────────────────────

  blockquote: ({ className, ...props }: ComponentsProps) => (
    <blockquote
      className={cn(
        "my-4 border-l-2 border-border pl-3 sm:pl-6 not-italic",
        "text-sm sm:text-base text-muted-foreground",
        "[&>p]:mt-0 [&>p]:leading-relaxed",
        className
      )}
      {...props}
    />
  ),

  // ── Divider ───────────────────────────────────────────────────────────────

  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr
      className="my-10 border-none h-px bg-border"
      {...props}
    />
  ),

  // ── Table ─────────────────────────────────────────────────────────────────

  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-4 w-full overflow-x-auto rounded-lg sm:rounded-xl border border-border">
      <table className={cn("w-full text-xs sm:text-sm border-collapse", className)} {...props} />
    </div>
  ),

  thead: ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className={cn("bg-muted/50", className)} {...props} />
  ),

  tbody: ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody className={cn("[&>tr:last-child>td]:border-b-0", className)} {...props} />
  ),

  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      className={cn("border-b border-border transition-colors hover:bg-muted/30", className)}
      {...props}
    />
  ),

  th: ({ className, ...props }: ComponentsProps) => (
    <th
      className={cn(
        "px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-widest",
        "text-muted-foreground border-b border-border",
        "[[align=center]]:text-center [[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),

  td: ({ className, ...props }: ComponentsProps) => (
    <td
      className={cn(
        "px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm text-muted-foreground",
        "[[align=center]]:text-center [[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),

  // ── Code ──────────────────────────────────────────────────────────────────

  pre: Pre,

  code: ({ className, ...props }: ComponentsProps) => (
    <code
      className={cn(
        "relative rounded px-1 py-0.5 font-mono font-medium text-xs sm:text-sm",
        className
      )}
      {...props}
    />
  ),

  // ── Links ─────────────────────────────────────────────────────────────────

  a: ({
    className,
    href,
    ...props
  }: React.HTMLAttributes<HTMLAnchorElement> & { href?: string }) => (
    <a
      href={href}
      className={cn(
        "text-foreground underline underline-offset-[3px] decoration-border",
        "decoration-[1px] transition-[text-decoration-color] duration-150",
        "hover:decoration-foreground",
        "text-xs sm:text-sm md:text-base",
        className
      )}
      {...props}
    />
  ),

  // ── Steps (custom MDX component) ─────────────────────────────────────────

  Step: ({ className, ...props }: React.ComponentProps<"div">) => (
    <div
      className={cn(
        "scroll-m-32 mt-6 flex gap-4   text-sm",
        "before:flex before:size-6 before:shrink-0 before:items-center before:justify-center",
        "before:rounded-full before:border before:border-border",
        "before:bg-muted before:text-xs before:font-semibold before:text-muted-foreground",
        "before:content-[counter(step)]",
        "[counter-increment:step]",
        className
      )}
      {...props}
    />
  ),

  Steps: ({ className, ...props }: React.ComponentProps<"div">) => (
    <div
      className={cn(
        "steps my-8 ml-2 space-y-6 border-l border-border pl-8 [counter-reset:step]",
        className
      )}
      {...props}
    />
  ),
};