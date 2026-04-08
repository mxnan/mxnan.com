# mxnan.com — Portfolio v2

A rebuilt personal portfolio and interactive component library.
Built with **Next.js 16 (App Router)**, **Velite**, **Tailwind CSS v4**, and **Shadcn UI**.

**Status:** 🚧 In progress  
**Old site:** https://mxnan.vercel.app/

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Project Structure](#project-structure)
- [Content Management (Velite)](#content-management-velite)
- [Component Conventions](#component-conventions)
- [Content Authoring Guide](#content-authoring-guide)
- [Development Workflow](#development-workflow)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)

---

## Tech Stack

| Layer | Library | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| UI Primitives | Shadcn UI / Radix UI | latest |
| Animations | Framer Motion | 11.x |
| Content | Velite (MDX) | 0.2.x |
| Forms | React Hook Form + Zod | 7.x / 3.x |
| Email | EmailJS Browser | 4.x |
| Icons | Lucide React | latest |
| Toasts | Sonner | latest |
| Dark Mode | next-themes | latest |
| Page Transitions | next-view-transitions | latest |

---

## Project Architecture

### High-Level Data Flow

```
content/ (MDX files)
    ↓  Velite build-time compilation
.velite/ (typed JS + compiled MDX)
    ↓  imported by pages/components
App Router Pages (RSC by default)
    ↓  interactive islands
Client Components ("use client")
    ↓
Tailwind + Framer Motion → rendered UI
```

### Rendering Strategy

| Route | Strategy | Reason |
|---|---|---|
| `/` | SSG | Static MDX-based hero |
| `/blogs` | SSG | Pre-rendered at build |
| `/blogs/[...slug]` | SSG via `generateStaticParams` | One page per MDX file |
| `/components/[cat]/[slug]` | SSG via `generateStaticParams` | One page per component MDX |
| `/contact` | SSG + client form | Static shell, dynamic EmailJS |
| `/api/og` | Dynamic (Edge) | Per-request OG image generation |

### Server vs Client Components

- **Server Components (default):** All pages, layouts, static content wrappers.
- **Client Components (`"use client"`):** Theme toggle, mobile nav, contact form, Framer Motion animations, any hook using `useState`/`useEffect`.
- **Dynamic Imports:** Heavy or animation-heavy client components are lazy-loaded with a `<BounceLoader />` fallback.

```tsx
// Pattern for heavy client components
const HeavyComponent = dynamic(() => import("@/components/heavy"), {
  ssr: false,
  loading: () => <BounceLoader />,
});
```

---

## Project Structure

```
.
├── app/
│   ├── layout.tsx                  # Root layout: metadata, providers, header, footer
│   ├── page.tsx                    # Home (loads home.mdx via Velite)
│   ├── globals.css                 # CSS variables + global resets
│   ├── providers.tsx               # ThemeProvider (client boundary)
│   ├── (pages)/
│   │   ├── blogs/
│   │   │   ├── page.tsx            # Blog listing (sorted, filtered)
│   │   │   └── [...slug]/page.tsx  # Dynamic blog post pages
│   │   ├── components/
│   │   │   ├── layout.tsx          # Sidebar layout for component section
│   │   │   ├── page.tsx            # Category overview
│   │   │   └── [category]/[slug]/page.tsx
│   │   ├── contact/page.tsx
│   │   └── demo/page.tsx
│   └── api/
│       └── og/route.tsx            # Dynamic OG image (next/og)
│
├── components/
│   ├── mdx/                        # MDX rendering primitives
│   │   ├── mdx-components.tsx      # HTML tag → component map
│   │   ├── component-preview.tsx   # Live component previews
│   │   ├── pre-with-copy.tsx       # Code block + copy button
│   │   ├── toc.tsx                 # Auto-generated table of contents
│   │   └── ...
│   ├── navigation/                 # Header, footer, mobile nav, sidebar
│   ├── ui/                         # Shadcn UI primitives
│   └── ...                         # Feature components
│
├── content/
│   ├── blogs/                      # Blog MDX files
│   └── components/                 # Component docs MDX files
│       ├── home.mdx                # Home page content
│       ├── playground/
│       ├── blocks/
│       ├── buttons/
│       ├── loaders/
│       └── text/
│
├── hooks/
│   ├── use-mounted.ts
│   └── use-dimension.ts
│
├── lib/
│   └── utils.ts                    # cn(), formatDate(), sortBlogs()
│
├── config/
│   └── site.ts                     # Site metadata, nav links, sidebar config
│
├── showcase/                       # Standalone demo components
│
├── public/
│   └── static/                     # Velite-generated image assets
│
├── velite.config.ts
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── CLAUDE.md                       # AI agent skill file (read this first)
```

---

## Content Management (Velite)

Velite compiles MDX files in `content/` into typed JS at build time, outputting to `.velite/`.

### Collections

#### Blogs (`content/blogs/*.mdx`)

```mdx
---
title: My Post Title           # required, max 99 chars
description: Short summary     # optional, max 199 chars
date: 2025-01-15               # required, ISO date
status: published              # "published" | "draft"
tags: [nextjs, animation]      # optional
image: /static/cover.png       # optional OG cover
---

Your MDX content here.
```

#### Components (`content/components/[category]/[slug].mdx`)

```mdx
---
title: Hover Reveal Button     # required, max 50 chars
description: Brief description # required, max 200 chars
tags: [button, animation]      # optional
---

## Overview

<ComponentPreview componentName="HoverReveal" />
```

### Category Slugs

| Folder | Route |
|---|---|
| `content/components/playground/` | `/components/playground/[slug]` |
| `content/components/blocks/` | `/components/blocks/[slug]` |
| `content/components/buttons/` | `/components/buttons/[slug]` |
| `content/components/loaders/` | `/components/loaders/[slug]` |
| `content/components/text/` | `/components/text/[slug]` |

### Importing Content

```tsx
import { blogs, components } from "#site/content";

// All published blogs, newest first
const published = blogs
  .filter((b) => b.status === "published")
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

// Single component by slug
const item = components.find((c) => c.slugAsParams === "buttons/hover-reveal");
```

### Rehype Plugin Pipeline

```
MDX source
  → rehype-slug          (adds id="" to all headings)
  → rehype-pretty-code   (syntax highlighting, theme: vitesse-black)
  → rehype-autolink-headings (wraps headings in anchor tags)
```

---

## Component Conventions

### File Naming

| Type | Convention | Example |
|---|---|---|
| Page | `page.tsx` | `app/(pages)/blogs/page.tsx` |
| Layout | `layout.tsx` | `app/(pages)/components/layout.tsx` |
| Component | `kebab-case.tsx` | `components/blog-card.tsx` |
| Hook | `use-kebab-case.ts` | `hooks/use-mounted.ts` |
| Util | `kebab-case.ts` | `lib/utils.ts` |
| MDX content | `kebab-case.mdx` | `content/blogs/my-post.mdx` |

### "use client" Directive Rules

Add `"use client"` **only** when the component uses:
- `useState`, `useEffect`, `useRef`, or any React hook with side effects
- Browser APIs (`window`, `document`, `localStorage`)
- Event listeners or form handlers
- Framer Motion (unless using RSC-compatible APIs)
- `next-themes` (`useTheme`)

Do **not** add `"use client"` to:
- Layout wrappers that only pass children
- Components that only render static JSX
- Server-side data fetching components

### Styling Conventions

```tsx
// Always use cn() for conditional classes
import { cn } from "@/lib/utils";

<div className={cn(
  "base-classes here",
  isActive && "active-class",
  className  // always accept and forward className prop
)} />
```

- Use **CSS variables** for all theme-sensitive values (colors, backgrounds).
- Prefer **Tailwind utilities** over inline styles.
- Use `tailwind-merge` (via `cn()`) to safely compose class strings.

### Component Structure Template

```tsx
// components/feature-name.tsx
import { cn } from "@/lib/utils";

interface FeatureNameProps {
  className?: string;
  // ... other props
}

export function FeatureName({ className, ...props }: FeatureNameProps) {
  return (
    <div className={cn("default-styles", className)}>
      {/* content */}
    </div>
  );
}
```

### Animation Pattern (Framer Motion)

```tsx
"use client";
import { motion } from "framer-motion";

// Prefer variants over inline initial/animate for reusability
const variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

<motion.div variants={variants} initial="hidden" animate="visible">
  content
</motion.div>
```

---

## Content Authoring Guide

### Writing a New Blog Post

1. Create `content/blogs/my-post-slug.mdx`
2. Add required frontmatter (title, date, status)
3. Write MDX content — standard Markdown + JSX components
4. Set `status: published` when ready
5. Velite auto-detects on next build / dev restart

Available MDX components in blog posts:

| Component | Usage |
|---|---|
| `<Callout>` | Info / warning callout boxes |
| `<CollapsibleCodeblock>` | Expandable code sections |
| `<VideoFromSrc src="..." />` | Inline video embed |
| Code fences | Auto-highlighted via rehype-pretty-code |

### Writing a New Component Doc

1. Create `content/components/[category]/component-name.mdx`
2. Add frontmatter (title, description, tags)
3. Add `<ComponentPreview componentName="YourComponent" />` to show live preview
4. Register `YourComponent` in `components/mdx/component-preview.tsx`
5. Add entry to sidebar config in `config/site.ts`

### Adding a Showcase Component

1. Create the component in `showcase/_components/your-component.tsx`
2. Export it from the showcase index
3. Register it in the MDX component preview map

---

## Development Workflow

```bash
# Install dependencies
npm install

# Start dev server (Velite watches content, Next.js HMR)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint
npm run lint
```

### Adding a Shadcn Component

```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
```

Components land in `components/ui/` — do not edit them directly; wrap or extend instead.

---

## Environment Variables

Create `.env.local` at root:

```env
# EmailJS (contact form)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

All vars prefixed `NEXT_PUBLIC_` are exposed to the browser — do not store secrets here.

---

## Deployment

### Vercel (primary)

1. Push to GitHub
2. Import project in Vercel dashboard
3. Add environment variables in project settings
4. Vercel runs `npm run build` (Velite → Next.js) on every push
5. Automatic previews on PRs

### Build Output Notes

- `.velite/` is a **generated** directory — never commit it, add to `.gitignore`
- `.next/` is a **generated** directory — never commit it
- `public/static/` contains Velite-processed images — **do** commit this

### Recommended `.gitignore` additions

```
.velite/
.next/
.env.local
```

---

**Built with 💻 by mxnan**
