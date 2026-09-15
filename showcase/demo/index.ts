/**
 * Showcase Demo Components — Central Export Hub
 *
 * This file serves as the single source of truth for all interactive showcase
 * components used in MDX content pages (component docs, etc.).
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * ARCHITECTURE OVERVIEW
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Why centralize exports here?
 *
 * 1. DYNAMIC IMPORTS
 *    The component-preview.tsx uses dynamic() to lazy-load components.
 *    A centralized export makes dynamic imports reliable and typed.
 *
 *    Example:
 *    import("@/showcase/demo").then(mod => mod.MyButton)
 *
 * 2. CODE ORGANIZATION
 *    All showcase components in one place = easy discovery, maintenance.
 *
 * 3. TYPESCRIPT AUTOCOMPLETE
 *    IDE can autocomplete available components:
 *    mod.GithubStarButton ✓
 *    mod.NonExistentComponent ✗
 *
 * 4. REACT 19 COMPLIANCE
 *    Safe for module-level registry pattern that avoids "Cannot create
 *    components during render" errors.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * HOW TO ADD A NEW COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Step 1: Create the component file
 * ─────────────────────────────────────────────────────────────────────────────
 * File: showcase/demo/[category]/component-name.tsx
 *
 * Example: showcase/demo/buttons/my-button.tsx
 *
 * "use client";
 *
 * export function MyButton() {
 *   return <button>Click me</button>;
 * }
 *
 * Step 2: Export it HERE
 * ─────────────────────────────────────────────────────────────────────────────
 * Add to the corresponding section below:
 *
 * export { MyButton } from "./buttons/my-button";
 *
 * Step 3: Register in component registry
 * ─────────────────────────────────────────────────────────────────────────────
 * Edit: components/mdx/component-preview.tsx
 *
 * In createComponentRegistry():
 *
 * "buttons/my-button": dynamic(
 *   () => import("@/showcase/demo").then((mod) => ({
 *     default: mod.MyButton,
 *   })),
 *   { ssr: false, loading: LoadingFallback }
 * )
 *
 * Step 4: Use in MDX
 * ─────────────────────────────────────────────────────────────────────────────
 * In your component MDX file:
 *
 * <ComponentPreview category="buttons" item="my-button" />
 *
 * Step 5 (Optional): Add to sidebar navigation
 * ─────────────────────────────────────────────────────────────────────────────
 * Edit: config/site.ts
 *
 * Add entry to componentSidebarLinks array
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * FILE ORGANIZATION
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Group by category:
 * • buttons/  — Button variants, interactive button patterns
 * • loaders/  — Loading spinners, skeleton screens
 * • text/     — Text animations, typography components
 * • other/    — Anything that doesn't fit above
 *
 * Each component should:
 * ✓ Be self-contained (render in isolation)
 * ✓ Not require external context/providers
 * ✓ Use "use client" if using hooks or browser APIs
 * ✓ Be reasonably small to load quickly
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * COMPONENT REGISTRY MAPPING
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * MDX Usage:
 *   <ComponentPreview category="buttons" item="github-star" />
 *
 * Maps to registry key:
 *   "buttons/github-star"
 *
 * Which points to export:
 *   GithubStarButton (defined below)
 *
 * Key format: "category/item" (kebab-case)
 * Export name: PascalCase (e.g., GithubStarButton for github-star)
 */

// ═════════════════════════════════════════════════════════════════════════════
// BUTTONS — Interactive button components
// ═════════════════════════════════════════════════════════════════════════════
// Use: <ComponentPreview category="buttons" item="github-star" />
//
export { GithubStarButton } from "./buttons/github-star";
export { MagnetButton } from "./buttons/magnet";
export { ScrollStackDemo } from "./blocks/scroll-stack-demo";
// Add more button components here:
// export { HoverRevealButton } from "./buttons/hover-reveal";
// export { GradientButton } from "./buttons/gradient";
// export { MyButton } from "./buttons/my-button";

// ═════════════════════════════════════════════════════════════════════════════
// LOADERS — Loading spinners and skeleton screens
// ═════════════════════════════════════════════════════════════════════════════
// Use: <ComponentPreview category="loaders" item="bounce" />
//
// export { BounceLoader } from "./loaders/bounce-loader";
// export { PulseLoader } from "./loaders/pulse-loader";
// export { SkeletonCard } from "./loaders/skeleton-card";

// ═════════════════════════════════════════════════════════════════════════════
// TEXT — Text animations and typography components
// ═════════════════════════════════════════════════════════════════════════════
// Use: <ComponentPreview category="text" item="animated-title" />
//
// export { AnimatedTitle } from "./text/animated-title";
// export { GradientText } from "./text/gradient-text";
// export { TypewriterText } from "./text/typewriter-text";

// ═════════════════════════════════════════════════════════════════════════════
// OTHER — Miscellaneous components
// ═════════════════════════════════════════════════════════════════════════════
// Use: <ComponentPreview category="other" item="component-name" />
//
// export { OtherComponent } from "./other/component-name";
