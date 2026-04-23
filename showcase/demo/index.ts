/**
 * Showcase Demo Components - Central Export
 * 
 * All components from this export are available in ComponentPreview via lazy loading.
 * 
 * HOW TO ADD A NEW COMPONENT:
 * 1. Create showcase/demo/[category]/component-name.tsx (with "use client")
 * 2. Export it here: export { ComponentName } from "./[category]/component-name"
 * 3. Add to COMPONENT_REGISTRY in components/mdx/registry.ts
 * 4. Use in MDX: <ComponentPreview componentName="ComponentName" />
 */

// ─── Buttons ────────────────────────────────────────────────────────────────
export { GithubStarButton } from "./buttons/github-star";

// Add more button components here:
// export { HoverRevealButton } from "./buttons/hover-reveal";
// export { GradientButton } from "./buttons/gradient";

// ─── Loaders ────────────────────────────────────────────────────────────────
// export { BounceLoader } from "./loaders/bounce-loader";
// export { PulseLoader } from "./loaders/pulse-loader";

// ─── Text ───────────────────────────────────────────────────────────────────
// export { AnimatedTitle } from "./text/animated-title";
// export { GradientText } from "./text/gradient-text";

// ─── Other ──────────────────────────────────────────────────────────────────
// export { OtherComponent } from "./others/component-name";