# Showcase Folder Structure & Setup

Complete documentation of the showcase system folder structure and how all the pieces work together with Velite-driven content.

## 📁 Complete Folder Structure

```
app/
├── showcase/
│   ├── layout.tsx                        # Main layout (server) with sidebar
│   ├── page.tsx                          # Showcase overview/listing (server)
│   └── [category]/
│       └── [slug]/
│           └── page.tsx                  # Individual component page (server)
│
components/
├── mdx/
│   ├── component-preview.tsx             # MDX component that renders previews (client)
│   ├── mdx.tsx                           # Main MDX renderer with ComponentPreview
│   └── ...
├── nav/
│   ├── showcase-sidebar.tsx              # Server component (fetches from Velite)
│   └── showcase-sidebar-client.tsx       # Client component (active link detection)
│
config/
└── showcase.ts                           # Queries from Velite content
│
content/
└── components/
    ├── buttons/
    │   ├── github-star.mdx               # MDX with frontmatter + ComponentPreview
    │   └── ...
    ├── loaders/
    │   └── ...
    └── text/
        └── ...
│
showcase/
└── demo/
    ├── index.ts                          # Exports all demo components
    ├── buttons/
    │   └── github-star.tsx               # React component (use client)
    ├── loaders/
    └── ...
```

## 🔄 Complete Data Flow

### Build Time (Velite)
```
content/components/buttons/github-star.mdx
    ↓
Velite compiles with frontmatter
    ↓
.velite/components/github-star.ts
(contains: title, description, tags, slug, category, content.code, etc.)
```

### Runtime (Page Load)
```
User visits: /showcase/buttons/github-star

1. Route Match
   └─→ app/showcase/[category]/[slug]/page.tsx (Server Component)

2. Fetch from Velite
   └─→ config/showcase.ts: getShowcaseComponent("buttons", "github-star")
   └─→ Returns Velite component object with metadata + MDX code

3. Render Page
   ├─→ Header with title, description, tags (from frontmatter)
   ├─→ MDXContent component with MDX code
   │   └─→ Renders: <ComponentPreview category="buttons" item="github-star" />
   │
   └─→ Dynamic Import (client-side)
       1. Converts: category="buttons" + item="github-star"
                    ↓
                    GithubStarButton (via slugToComponentName)
       2. Imports: @/showcase/demo → GithubStarButton
       3. Shows loading state while importing
       4. Error boundary catches failures

4. Display Component
   └─→ Component rendered with lazy loading
```

### Sidebar (Server-Rendered)
```
show case-sidebar-client.tsx (usePathname hook for active state)
  ↑
showcase-sidebar.tsx (Server Component)
  ↑
getAllShowcaseComponents() from config/showcase.ts
  ↑
Velite compiled components from .velite/
```

## 📋 What Each File Does

### `config/showcase.ts`
- **Purpose:** Query layer for Velite components
- **How it works:** Imports from `#site/content`, filters by category/slug
- **Functions:**
  - `getShowcaseCategories()` - List all categories with counts
  - `getShowcaseCategoryComponents(category)` - Get components in a category
  - `getShowcaseComponent(category, slug)` - Get specific component
  - `getAllShowcaseComponents()` - Flatten all components

### `app/showcase/layout.tsx` (Server Component)
- **Purpose:** Wrapper layout with sidebar
- **Structure:** Flex layout with sidebar (w-56) + main content (max-w-3xl)
- **Renders:** ShowcaseSidebar + children (pages/content)

### `components/nav/showcase-sidebar.tsx` (Server Component)
- **Purpose:** Fetch and render sidebar navigation
- **What it does:** 
  - Fetches all components from Velite via `getAllShowcaseComponents()`
  - Maps to client component with minimal data
  - Sidebar auto-groups by category

### `components/nav/showcase-sidebar-client.tsx` (Client Component)
- **Purpose:** Handle active link state
- **What it does:**
  - Receives pre-mapped items from server
  - Uses `usePathname()` to detect active link
  - Groups items by category for display
  - CSS-only animations (no Framer Motion)

### `content/components/buttons/github-star.mdx`
- **Format:** Frontmatter + MDX content
- **Frontmatter:**
  ```yaml
  ---
  title: GitHub Star Button
  description: Beautiful animated button...
  tags: [button, animation, framer-motion]
  ---
  ```
- **Content:** Markdown + React JSX + `<ComponentPreview />`
- **Compiled by:** Velite into typed content

### `app/showcase/[category]/[slug]/page.tsx` (Server Component)
- **Purpose:** Individual component showcase page
- **How it works:**
  1. Gets params from URL
  2. Fetches component metadata from Velite
  3. Renders header with metadata
  4. Renders MDXContent with ComponentPreview
  5. Auto-routes via `generateStaticParams()`

### `components/mdx/component-preview.tsx` (Client Component)
- **Purpose:** Render showcase components in MDX
- **Props:** `category` (string) + `item` (string)
- **Features:**
  - Auto-converts `item` slug to export name based on `category`
  - Dynamic import from `@/showcase/demo`
  - Error boundary + suspense fallback
  - Loading state indicator

### `components/mdx/mdx.tsx` (Client Component)
- **Purpose:** Velite MDX renderer
- **Components available:** Button, FigCard, ComponentPreview, etc.
- **Used by:** Showcase pages to render MDX content

## 🔤 Slug to Export Name Conversion

The `slugToComponentName()` function converts filenames to JavaScript export names automatically:

**Algorithm:**
1. Split slug by hyphens: `github-star` → `["github", "star"]`
2. Capitalize each: `["Github", "Star"]`
3. Join: `GithubStar`
4. Append category suffix: `GithubStar` + `Button` = `GithubStarButton`

**Category Mapping:**
```tsx
const categoryMap = {
  buttons: 'Button',
  loaders: 'Loader',
  text: '',       // no suffix
  other: '',      // no suffix
};
```

**Examples:**
| Category | Filename | Slug | Export |
|----------|----------|------|--------|
| buttons | `github-star.tsx` | github-star | GithubStarButton |
| buttons | `hover-reveal.tsx` | hover-reveal | HoverRevealButton |
| loaders | `bounce.tsx` | bounce | BounceLoader |
| loaders | `pulse-animation.tsx` | pulse-animation | PulseAnimationLoader |
| text | `animated-title.tsx` | animated-title | AnimatedTitle |

## 🚀 How to Add a New Component

### Complete Flow

**1. Create React component**
```tsx
// showcase/demo/buttons/my.tsx
"use client";
export function MyButton() { return <button>Click</button>; }
```

**2. Export from index**
```tsx
// showcase/demo/index.ts
export { MyButton } from "./buttons/my";
```

**3. Create MDX documentation**
```mdx
---
title: My Button
description: Custom button component
tags: [button]
---

## Overview
Beautiful custom button.

<ComponentPreview category="buttons" item="my" />
```

**4. Rebuild and test**
```bash
npm run dev
# Velite recompiles content/
# Component appears in sidebar
# Accessible at /showcase/buttons/my
```

**That's it!** Everything else auto-updates.

## 📊 File Relationships

```
Content (Velite)
    ↓
content/components/[category]/[slug].mdx
    ↓
.velite/index.ts (auto-generated)
    ↓
config/showcase.ts imports "#site/content"
    ├→ getAllShowcaseComponents()
    │   ├→ components/nav/showcase-sidebar.tsx
    │   ├→ app/showcase/[category]/[slug]/page.tsx
    │   └→ app/showcase/page.tsx
    │
    └→ getShowcaseComponent(category, slug)
        ↓
        app/showcase/[category]/[slug]/page.tsx
        ↓
        <MDXContent code={component.content.code} />
        ↓
        <ComponentPreview category="..." item="..." />
        ↓
        dynamic(() => import("@/showcase/demo"))
```

## 🧪 Testing the Setup

1. **Visit showcase overview:**
   ```
   http://localhost:3000/showcase
   ```
   ✅ Should see all categories with component counts

2. **Visit component page:**
   ```
   http://localhost:3000/showcase/buttons/github-star
   ```
   ✅ Should render component preview with metadata

3. **Check sidebar:**
   - ✅ Should only show categories with components
   - ✅ Active link highlighted
   - ✅ No animations on desktop, smooth transitions

4. **Add a component:**
   - Create `showcase/demo/buttons/test.tsx`
   - Export from `showcase/demo/index.ts`
   - Create `content/components/buttons/test.mdx`
   - Run `npm run dev`
   - ✅ Component appears in sidebar and at `/showcase/buttons/test`

## 💡 Key Features

### ✅ Build-Time Compilation (Velite)
- MDX compiled with syntax highlighting
- Frontmatter parsed and typed
- No runtime MDX compilation

### ✅ Server-Side Sidebar
- Sidebar fetched at build time (SSG)
- Data embedded in HTML
- Only client component handles active state
- Minimal JavaScript

### ✅ Automatic Route Generation
- `generateStaticParams()` pre-generates all routes
- No manual route creation needed
- All routes pre-built for fast load

### ✅ Smart Slug Conversion
- Filename slug → export name automatic
- Category suffix appended intelligently
- No manual component map needed

### ✅ Code Splitting
- Each component lazy-loads on demand
- `dynamic()` with `ssr: false`
- Loading state while importing

### ✅ Centered Layout
- Sidebar fixed at w-56 on desktop
- Content max-w-3xl and centered
- Responsive on mobile

## 🐛 Troubleshooting

### Component Not in Sidebar

**Check:**
1. MDX file exists in `content/components/[category]/`
2. Frontmatter has `title` and `description`
3. Run `npm run dev` to rebuild Velite

### Route Shows 404

**Check:**
1. URL matches pattern: `/showcase/[category]/[slug]`
2. Filename slug is correct (kebab-case)
3. Rebuild with `npm run dev`

### ComponentPreview Shows Error

**Check console for export name:**
```
[ComponentPreview] Export "MissingName" not found
available: [GithubStarButton, ...]
```

**Fix:** Verify component is:
1. Exported from `showcase/demo/index.ts`
2. Category + filename converts correctly
3. File named without category suffix

### Sidebar Doesn't Highlight Active Link

**Check:**
1. Sidebar links use correct href format
2. Pathname from `usePathname()` matches URL
3. Browser console for errors

## ✨ Best Practices

1. **File Naming**
   - Use kebab-case: `my-button.tsx` not `myButton.tsx`
   - Don't include category in filename: `my.tsx` not `my-button.tsx` (for buttons)
   - Filenames become slugs in URLs and export names

2. **Export Naming**
   - Export with full name including suffix: `export function MyButton {}`
   - Not the short form: `export function My {}`
   - Let the auto-conversion handle category suffix

3. **MDX Files**
   - Match category structure: `content/components/buttons/`, not random folders
   - Include all frontmatter: title, description, tags
   - Use `<ComponentPreview category="..." item="..." />`

4. **Performance**
   - Don't import components at module level
   - Let ComponentPreview handle dynamic import
   - Components load only when page is viewed

## 📚 Files to Reference

- [SHOWCASE_GUIDE.md](./SHOWCASE_GUIDE.md) - How to add components
- [CLAUDE.md](./CLAUDE.md) - Project conventions
- `velite.config.ts` - MDX compilation config
- `config/showcase.ts` - Velite query layer
- `components/mdx/component-preview.tsx` - Preview rendering logic

