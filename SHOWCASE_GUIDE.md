# Component Showcase System Guide

This guide explains how to create showcase components that are rendered in MDX documentation using the new Velite-driven content system.

## Architecture Overview

```
Content (MDX files in content/components/)
    ↓  Velite compiles with frontmatter
.velite/ (generated)
    ↓
config/showcase.ts (pulls from Velite)
    ↓
app/showcase/[category]/[slug]/page.tsx
    ↓  <ComponentPreview category="buttons" item="github-star" />
Component Preview (auto slug → export name conversion)
    ↓  (dynamic import with lazy loading)
Showcase Components (showcase/demo/*)
    ↓
Rendered in Browser (lazy-loaded, no SSR)
```

## Quick Start: Add a New Component

### Step 1: Create the Component File

Create `showcase/demo/buttons/your-button.tsx`:

```tsx
"use client";

import { cn } from "@/lib/utils";

interface YourButtonProps {
  className?: string;
}

export function YourButton({ className }: YourButtonProps) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-md bg-primary text-primary-foreground",
        "hover:bg-primary/90 transition-colors",
        className
      )}
    >
      Your Button
    </button>
  );
}
```

**Key points:**
- Always add `"use client"` directive
- Accept `className` prop for flexibility
- Use `cn()` for class composition
- Export as a named export (not default)

### Step 2: Export from Demo Index

Edit `showcase/demo/index.ts` and add:

```tsx
export { YourButton } from "./buttons/your-button";
```

### Step 3: Create MDX Documentation

Create `content/components/buttons/your-button.mdx`:

```mdx
---
title: Your Button
description: A beautiful custom button component
tags: [button, interactive]
---

## Overview

Your button does amazing things and is interactive.

<ComponentPreview category="buttons" item="your-button" />

## Usage

\`\`\`tsx
import { YourButton } from "@/showcase/demo";

export function MyPage() {
  return <YourButton />;
}
\`\`\`
```

**Important:** The MDX filename (`your-button.mdx`) slug is automatically converted to the export name:
- `your-button` → `YourButton` (for text/generic)
- `your-button` → `YourButtonButton` (WRONG for buttons category)

So for buttons, name your component file to avoid double-suffix. See naming conventions below.

### That's It!

- Velite auto-compiles the MDX
- Sidebar auto-updates from Velite data
- Routes auto-generate
- Component page is accessible at `/showcase/buttons/your-button`

## Component Naming Conventions

The ComponentPreview automatically converts filenames to export names based on category:

| Category | File | Slug | →  Export Name |
|----------|------|------|---|
| buttons | `my-button.tsx` | `my-button` | `MyButtonButton` ❌ WRONG |
| buttons | `my.tsx` | `my` | `MyButton` ✅ RIGHT |
| loaders | `bounce.tsx` | `bounce` | `BounceLoader` ✅ RIGHT |
| loaders | `bounce-animation.tsx` | `bounce-animation` | `BounceAnimationLoader` ✅ RIGHT |
| text | `animated-title.tsx` | `animated-title` | `AnimatedTitle` ✅ RIGHT |

**Strategy:** Name component files without the category suffix, they will be added automatically.

```tsx
// showcase/demo/buttons/my.tsx
export function MyButton() { ... }  // Export as MyButton, not My

// showcase/demo/loaders/bounce.tsx
export function BounceLoader() { ... }  // Export as BounceLoader

// showcase/demo/text/animated-title.tsx
export function AnimatedTitle() { ... }  // Export as AnimatedTitle (no suffix for text)
```

## MDX Components Available

In your component documentation, you can use:

```mdx
<ComponentPreview category="buttons" item="my-button" />
```

This will:
1. Convert `my-button` + `buttons` → `MyButton` export name
2. Dynamically import from `@/showcase/demo`
3. Display with loading state and error handling

## Performance Best Practices

### ✅ What We Do Right

1. **Velite-Driven Content**
   - MDX is compiled at build time
   - Frontmatter metadata extracted automatically
   - Type-safe content access

2. **Server-Side Sidebar**
   - Sidebar fetches component list at build time
   - Only client component for active link detection
   - Minimal JavaScript sent to browser

3. **Code Splitting (bundle-dynamic-imports)**
   - Components use `dynamic()` with `ssr: false`
   - Each component only loads when its page is visited
   - Reduces main bundle size significantly

4. **Lazy Loading with Suspense**
   - Components show loading state while importing
   - Zero impact on page load time
   - Error boundaries catch failures gracefully

### ✅ Common Patterns

#### Animation Component

```tsx
"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AnimatedFeature({ className }: { className?: string }) {
  const variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      className={cn("text-center", className)}
    >
      Animated content
    </motion.div>
  );
}
```

#### Interactive Component

```tsx
"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function InteractiveCounter({ className }: { className?: string }) {
  const [count, setCount] = useState(0);

  return (
    <button
      onClick={() => setCount(count + 1)}
      className={cn(
        "px-4 py-2 rounded-md transition-all",
        "bg-primary text-white hover:bg-primary/90",
        className
      )}
    >
      Clicks: {count}
    </button>
  );
}
```

## File Structure

```
showcase/
└── demo/
    ├── index.ts                    # Central exports
    ├── buttons/
    │   ├── my.tsx                  # Exports: MyButton
    │   ├── hover-reveal.tsx        # Exports: HoverRevealButton
    │   └── ...
    ├── loaders/
    │   ├── bounce.tsx              # Exports: BounceLoader
    │   └── ...
    ├── text/
    │   ├── animated-title.tsx      # Exports: AnimatedTitle
    │   └── ...
    └── ...
│
content/
└── components/
    ├── buttons/
    │   ├── my-button.mdx           # Uses: <ComponentPreview category="buttons" item="my" />
    │   ├── hover-reveal.mdx        # Uses: <ComponentPreview category="buttons" item="hover-reveal" />
    │   └── ...
    ├── loaders/
    │   └── ...
    └── text/
        └── ...
```

## Troubleshooting

### Component Not Showing

**Error:** "Export not found in @/showcase/demo"

Check:
1. Component file exists in `showcase/demo/[category]/`
2. Component is exported from `showcase/demo/index.ts`
3. Export name matches the calculated name:
   - File: `my.tsx` with category `buttons` → Export: `MyButton`
   - File: `bounce.tsx` with category `loaders` → Export: `BounceLoader`

### Component Not Loading

1. Ensure component has `"use client"` at the top
2. Check that all imports are correct
3. Verify no TypeScript errors in the component file

### Sidebar Doesn't Show Component

1. MDX file must be in `content/components/[category]/` 
2. Frontmatter must include `title` and `description`
3. Rebuild with `npm run dev` to re-compile Velite

### Wrong Export Name Generated

Use the conversion rules:
- `your-component` + `buttons` → `YourComponentButton`
- `your-component` + `loaders` → `YourComponentLoader`
- `your-component` + `text` → `YourComponent` (no suffix)

If you want different name, adjust the component filename or category.

## Summary Checklist

When adding a new showcase component:

- [ ] Created component in `showcase/demo/[category]/component-name.tsx` (no category suffix)
- [ ] Has `"use client"` at top
- [ ] Accepts `className` prop
- [ ] Uses `cn()` for styling
- [ ] Exported from `showcase/demo/index.ts`
- [ ] Created MDX in `content/components/[category]/component-name.mdx`
- [ ] MDX includes frontmatter with `title`, `description`, `tags` (optional)
- [ ] MDX uses `<ComponentPreview category="..." item="..." />`
- [ ] Rebuild with `npm run dev` (Velite recompiles)
- [ ] Component appears in sidebar and at `/showcase/[category]/[slug]`

---

**Questions?** Check:
1. The [SHOWCASE_STRUCTURE.md](./SHOWCASE_STRUCTURE.md) for architecture details
2. Console browser logs for import errors
3. File naming against the conversion table above

