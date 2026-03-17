# CLAUDE.md — Agent Skills File

> This file is read automatically by Claude Code and other AI agents when working in this repo.
> It defines conventions, constraints, and patterns to follow — always read this before making changes.

---

## Project Identity

- **Stack:** Next.js 16 (App Router) · TypeScript 5 · Tailwind CSS 4 · Velite · Shadcn UI
- **Purpose:** Personal portfolio + interactive component library
- **Content:** MDX-driven via Velite (`content/` → `.velite/`)
- **Deployment:** Vercel

---

## Critical Rules (Never Break These)

1. **Never add `"use client"` to a file unless it genuinely needs browser APIs or React state/effects.** Default to Server Components.
2. **Never edit files inside `components/ui/`.** These are Shadcn-generated. Wrap or extend them instead.
3. **Never commit `.velite/` or `.next/`.** These are build artifacts.
4. **Never store secrets or API keys in code.** Use `.env.local` with `NEXT_PUBLIC_` prefix for browser-safe vars only.
5. **Always use `cn()` from `lib/utils.ts`** when composing Tailwind classes conditionally. Never use string interpolation for class names.
6. **Always accept and forward a `className` prop** in any reusable component.
7. **Never hardcode colors or spacing** for theme-sensitive values — use CSS variables (`var(--background)`, etc.) or Tailwind semantic tokens.

---

## Architecture Quick Reference

### Routing

```
/                            → app/page.tsx (SSG, loads home.mdx)
/blogs                       → app/(pages)/blogs/page.tsx
/blogs/[...slug]             → app/(pages)/blogs/[...slug]/page.tsx
/components                  → app/(pages)/components/page.tsx
/components/[cat]/[slug]     → app/(pages)/components/[category]/[slug]/page.tsx
/contact                     → app/(pages)/contact/page.tsx
/api/og                      → app/api/og/route.tsx (Edge, dynamic OG images)
```

### Content Access Pattern

```tsx
// Always import from the Velite alias, never relative paths to .velite/
import { blogs, components } from "#site/content";
```

### Path Aliases

```
@/          → project root (src alias)
#site/      → .velite/ (Velite generated content)
```

---

## File Creation Checklist

Before creating any new file, ask:

- [ ] Is this a page? → `app/(pages)/[route]/page.tsx`
- [ ] Is this a layout? → `app/(pages)/[route]/layout.tsx`
- [ ] Is this a reusable UI component? → `components/[name].tsx`
- [ ] Is it Shadcn-based? → Do not create manually, run `npx shadcn@latest add [name]`
- [ ] Is this a hook? → `hooks/use-[name].ts`
- [ ] Is this a utility function? → `lib/utils.ts` (add to existing file unless unrelated)
- [ ] Is this content? → `content/blogs/` or `content/components/[category]/`
- [ ] Is this a showcase/demo component? → `showcase/_components/`

---

## Component Patterns

### Minimal Server Component

```tsx
// components/example.tsx
import { cn } from "@/lib/utils";

interface ExampleProps {
  className?: string;
  children?: React.ReactNode;
}

export function Example({ className, children }: ExampleProps) {
  return (
    <div className={cn("your-base-styles", className)}>
      {children}
    </div>
  );
}
```

### Minimal Client Component

```tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ExampleProps {
  className?: string;
}

export function Example({ className }: ExampleProps) {
  const [active, setActive] = useState(false);

  return (
    <button
      onClick={() => setActive(!active)}
      className={cn("base-styles", active && "active-styles", className)}
    >
      Click me
    </button>
  );
}
```

### Dynamic Import (for heavy components)

```tsx
import dynamic from "next/dynamic";
import { BounceLoader } from "@/components/ui/bounce-loader";

const HeavyComponent = dynamic(() => import("@/components/heavy-component"), {
  ssr: false,
  loading: () => <BounceLoader />,
});
```

### Framer Motion Animation

```tsx
"use client";
import { motion } from "framer-motion";

// Define variants outside the component (stable reference)
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export function AnimatedSection() {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
    >
      content
    </motion.div>
  );
}
```

---

## Content Authoring Patterns

### Blog Post Frontmatter Schema

```mdx
---
title: string          # required · max 99 chars
description: string    # optional · max 199 chars
date: YYYY-MM-DD       # required
status: published      # "published" | "draft"
tags: [tag1, tag2]     # optional array
image: /static/x.png   # optional OG image
---
```

### Component Doc Frontmatter Schema

```mdx
---
title: string          # required · max 50 chars
description: string    # required · max 200 chars
tags: [tag1, tag2]     # optional array
---
```

### Registering a New Component Preview

When adding `<ComponentPreview componentName="Foo" />` to an MDX file:

1. Build the component at `showcase/_components/foo.tsx`
2. Open `components/mdx/component-preview.tsx`
3. Add to the component map:
   ```tsx
   import { Foo } from "@/showcase/_components/foo";
   
   const componentMap: Record<string, React.ComponentType> = {
     // ...existing entries
     Foo,
   };
   ```

### Adding a Component to the Sidebar

Open `config/site.ts` and add to the relevant category in `componentSidebarLinks`:

```ts
{
  category: "buttons",
  items: [
    { title: "Hover Reveal", href: "/components/buttons/hover-reveal" },
    { title: "Your New Button", href: "/components/buttons/your-new-button" }, // ← add here
  ],
}
```

---

## Styling Guide

### CSS Variable Usage

For any color or theme-sensitive value, use Tailwind semantic tokens backed by CSS variables:

```tsx
// ✅ correct — respects dark mode automatically
<div className="bg-background text-foreground border border-border" />

// ❌ wrong — breaks dark mode
<div style={{ backgroundColor: "#ffffff", color: "#000000" }} />
```

### Class Composition

```tsx
// ✅ always use cn()
className={cn("px-4 py-2 rounded-md", isActive && "bg-primary", className)}

// ❌ never do this
className={`px-4 py-2 rounded-md ${isActive ? "bg-primary" : ""}`}
```

### Responsive Pattern

Follow mobile-first:
```tsx
<div className="flex-col md:flex-row lg:gap-8" />
```

---

## Metadata Pattern

Every page should export metadata:

```tsx
// Static metadata
export const metadata: Metadata = {
  title: "Page Title | mxnan",
  description: "Page description here.",
  openGraph: {
    title: "Page Title",
    type: "website",
    url: "https://mxnan.com/page",
  },
};

// Dynamic metadata (for slug pages)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = blogs.find((b) => b.slugAsParams === params.slug.join("/"));
  if (!post) return {};
  return {
    title: `${post.title} | mxnan`,
    description: post.description,
  };
}
```

---

## Common Pitfalls to Avoid

| Pitfall | Fix |
|---|---|
| Importing from `.velite/` directly | Use `#site/content` alias |
| Editing `components/ui/` files | Wrap/extend, never edit |
| Using `process.env.SECRET` in client code | Only `NEXT_PUBLIC_` vars in client components |
| Adding `"use client"` to layout files | Layouts must be server components; use a `Providers` wrapper instead |
| Framer Motion in server components | Always pair with `"use client"` |
| Hardcoded pixel values for spacing | Use Tailwind scale (`p-4`, `gap-6`, etc.) |
| Multiple `cn()` arguments with conflicting Tailwind classes | `cn()` uses `tailwind-merge` — this is safe, let it handle conflicts |

---

## Velite Config Notes

- Content root: `content/`
- Output: `.velite/` (gitignored, rebuilt on `npm run dev` / `npm run build`)
- Syntax highlight theme: `vitesse-black`
- Two collections: `blogs` and `components`
- Computed field `slugAsParams` strips the collection prefix from slugs:
  - `blogs/my-post` → `my-post`
  - `components/buttons/hover-reveal` → `buttons/hover-reveal`

---

## When Unsure

1. Check `config/site.ts` for site-wide config and navigation structure.
2. Check `velite.config.ts` for content schema.
3. Check `lib/utils.ts` for shared utilities before writing new ones.
4. Check `components/mdx/mdx-components.tsx` for the full MDX component map.
5. Ask the user before restructuring folders or changing route shapes.
