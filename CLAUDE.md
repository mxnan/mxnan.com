# CLAUDE.md — Agent Skills File

This repo is organized around a blog-first portfolio. Keep the public content model simple:

- Route focus: Home, Blogs, individual article pages, Contact, Privacy, Terms
- Content source: `content/blogs/*.mdx`
- MDX rendering: shared components under `components/mdx/`
- Article-specific UI: `components/articles/[article-slug]/`
- No standalone showcase section, no `/showcase` routes, no showcase registry

## Critical rules

1. Keep server components as the default.
2. Only add `"use client"` when browser APIs or React state are truly required.
3. Use `cn()` from `lib/utils.ts` for conditional Tailwind classes.
4. Never edit files in `components/ui/` directly.
5. Keep content under `content/blogs/` and use Velite as the single source of truth.
6. Prefer explicit imports for article-specific React components.
7. Do not build a separate component catalog or showcase route.

## Content authoring

```mdx
---
title: My Post
description: Short summary
date: 2026-11-07
status: published
tags: [nextjs, mdx]
image: /static/cover.png
featured: true
---
```

## MDX pattern

- Global reusable MDX helpers live in `components/mdx/`
- Article-only React demos live under `components/articles/[slug]/`
- Import those article components explicitly inside the relevant MDX file
