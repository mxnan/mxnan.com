# mxnan.com

A blog-first personal portfolio built with Next.js 16, TypeScript, Tailwind CSS, and Velite-powered MDX content.

## Stack

- Next.js 16 App Router
- TypeScript 5
- Tailwind CSS 4
- Velite
- React 19

## Architecture

- Public content lives under `content/blogs/`
- Every blog post is an MDX file with frontmatter
- Only `status: "published"` posts are exposed in listings and route generation
- Article-specific UI stays close to the article under `components/articles/[slug]/`
- Shared MDX primitives remain in `components/mdx/`
- The site is intentionally blog-focused; there is no standalone showcase section

## Content flow

```bash
content/blogs/*.mdx -> Velite -> .velite -> lib/content.ts -> app/blogs/*
```

## Local development

```bash
pnpm install
pnpm dev
```

## Production build

```bash
pnpm build
```
