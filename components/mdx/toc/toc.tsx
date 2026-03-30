// Main TOC component - exports client component
// Server-rendered structure is in toc-tree.server.tsx
// Client interactivity is in toc.client.tsx

export { TableOfContentsClient as TableOfContents } from "./toc.client";
export type { TocEntry } from "./toc.server";