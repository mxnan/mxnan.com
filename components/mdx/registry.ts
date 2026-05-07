"use client";

import dynamic from "next/dynamic";

/**
 * COMPONENT_REGISTRY — Central registry for all showcase components
 * 
 * Enables:
 * • Type-safe component name validation
 * • Lazy loading with bundle splitting
 * • Easy component discovery and management
 * 
 * HOW TO ADD COMPONENTS:
 * 1. Create component in showcase/demo/[category]/component-name.tsx
 * 2. Export from showcase/demo/index.ts
 * 3. Add entry below with dynamic import
 * 4. ComponentPreview will automatically recognize it
 */
export const COMPONENT_REGISTRY = {
    GithubStarButton: dynamic(
        () => import("@/showcase/demo").then(mod => ({ default: mod.GithubStarButton })),
        { ssr: false }
    ),
    MagnetButton: dynamic(
        () => import("@/showcase/demo").then(mod => ({ default: mod.MagnetButton })),
        { ssr: false }
    ),
    // Add your components below this line
    // Format:
    // ComponentName: dynamic(
    //   () => import("@/showcase/demo").then(mod => ({ default: mod.ComponentName })),
    //   { ssr: false, loading: () => <LoadingFallback /> }
    // ),

} as const;

/**
 * Type-safe component name union
 * Use this to ensure only valid component names are passed to ComponentPreview
 */
export type RegisteredComponentName = keyof typeof COMPONENT_REGISTRY;

/**
 * Helper to validate if a component name is registered
 */
export function isRegisteredComponent(
    name: string
): name is RegisteredComponentName {
    return name in COMPONENT_REGISTRY;
}

/**
 * Get a component from the registry with type safety
 */
export function getRegisteredComponent(name: RegisteredComponentName) {
    return COMPONENT_REGISTRY[name];
}