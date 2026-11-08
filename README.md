# mxnan.vercel.app

A blog-first portfolio that sells one thing: **product design and front-end for early-stage teams**.

Not a component gallery. Not a résumé. A single page that answers "what do you do, who is it for, and how do I hire you" — plus a blog that proves the work.

**Live:** [mxnan.vercel.app](https://mxnan.vercel.app)  
**Stack:** Next.js 16 · React 19 · TypeScript 5 · Tailwind CSS 4 · Velite · MDX

---

## Who this is for

- **Founders** who need a landing page, prototype, or product interface shipped in weeks, not quarters.
- **Small product teams** that need design decisions and front-end code from the same person.
- **Recruiters and peers** who want proof: case studies, technical write-ups, real tradeoffs.

The site is optimized for one conversion: **a project brief sent through `/contact`**. Everything else supports that.

---

## What ships

| Route | What it does | Indexed |
| --- | --- | --- |
| `/` | Positioning, services, process, testimonials, FAQ, primary CTA | Yes |
| `/blogs` | Post index with descriptions, tags, dates, and covers | Yes |
| `/blogs/[slug]` | MDX article, table of contents, syntax-highlighted code | Yes |
| `/contact` | Project brief form and reply expectation | Yes |
| `/privacy` | Privacy policy | No (placeholder copy) |
| `/terms` | Terms of service | No (placeholder copy) |
| `/sitemap.xml` | Generated from published posts only | — |
| `/robots.txt` | Crawl rules plus sitemap location | — |

There is no standalone showcase section. Case studies are blog posts.

---

## Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 16 App Router | Static rendering, metadata API, image optimization |
| UI | React 19 + TypeScript 5 | Server components by default |
| Styling | Tailwind CSS 4 + shadcn/ui | Token-based themes, no CSS sprawl |
| Content | Velite + MDX | Typed frontmatter, build-time compilation |
| Syntax highlighting | rehype-pretty-code + Shiki | No runtime flash |
| Motion | Motion + Lenis | Scroll and cursor effects, loaded client-side |
| Themes | next-themes | System, light, dark |
| Icons | lucide-react | Tree-shaken |
| Notifications | sonner | Contact form feedback |

---

## Architecture

```text
content/blogs/*.mdx
        │
        ▼
   Velite (velite.config.ts)
        │
        ▼
   .velite/blogs.json
        │
        ▼
   lib/content.ts  ──►  app/blogs/page.tsx
        │                 app/blogs/[slug]/page.tsx
        │                 app/sitemap.ts
        ▼
   components/mdx/mdx.tsx  ──►  rendered article
```

Velite is the single source of truth for content. Do not read MDX files at runtime.

### Project structure

```text
app/
  (static)/
    contact/page.tsx          Contact page + metadata
    privacy/page.tsx          Noindex placeholder
    terms/page.tsx            Noindex placeholder
  blogs/
    [slug]/page.tsx           Article page, metadata, JSON-LD
    layout.tsx                Blog shell
    page.tsx                  Post index + Blog schema
  layout.tsx                  Root metadata, fonts, providers, site JSON-LD
  page.tsx                    Marketing homepage
  providers.tsx               Theme, cursor, Lenis
  robots.ts                   robots.txt
  sitemap.ts                  sitemap.xml
  not-found.tsx               404
  globals.css                 Theme tokens

components/
  mdx/                        Shared MDX renderer and primitives
    mdx-ui/                   Image, link, code block, figure card
    toc/                      Table of contents
  nav/                        Header and footer
  seo/json-ld.tsx             JSON-LD script renderer
  site-assets/                Contact form, cursor, progress ring, Lenis
  ui/                         shadcn primitives (do not edit directly)

config/navigation.ts          Header nav
content/blogs/                Published and draft MDX
lib/
  content.ts                  Post queries and sorting
  seo.ts                      Schema.org builders
  site.ts                     Site constants and canonical URL
  utils.ts                    cn()
public/
  og/default.jpg              Default social card
  blogs/                      Post images
velite.config.ts              Content schema and MDX pipeline
next.config.ts                Images, headers, package optimization
```

---

## How content works

### Pipeline

```bash
content/blogs/*.mdx -> Velite -> .velite -> lib/content.ts -> app/blogs/*
```

`pnpm build` runs `velite` before `next build`. If the schema and the MDX frontmatter disagree, the build fails. That is the point.

### Frontmatter

```mdx
---
title: My Post
description: One sentence that earns the click.
date: 2026-11-09
updatedAt: 2026-11-12
status: published
featured: false
tags: [nextjs, mdx]
image: /blogs/my-post/cover.png
---
```

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | string, max 99 | Yes | Becomes the page title and H1 |
| `description` | string, max 199 | No | Meta description and index card |
| `date` | ISO date | Yes | Sort order and `datePublished` |
| `updatedAt` | ISO date | No | Shows freshness in schema |
| `status` | `published` or `draft` | No | Defaults to `draft` |
| `featured` | boolean | No | Available via `getFeaturedPosts()` |
| `tags` | string[] | No | Cards, keywords, article section |
| `image` | string | No | Local `/...` or `images.unsplash.com` URL |

Only `status: "published"` posts are listed, routed, and sitemapped. Drafts 404 in production.

### MDX components

Global components are wired in `components/mdx/mdx.tsx`:

- `Image` / `img` → optimized image with caption support
- `FigCard` → captioned figure block
- `CollapsibleCodeBlock` → expandable code
- `Button` → shadcn button
- `Steps` / `Step` → numbered walkthrough
- Custom `a`, headings, lists, tables, and code styling

Article-only demos should live in `components/articles/[slug]/` and be imported explicitly inside that MDX file. Keep shared primitives in `components/mdx/`.

### Images

- Local post images go in `public/blogs/<post-slug>/`.
- Remote images are allowed only from `images.unsplash.com` (see `next.config.ts`).
- Next.js serves AVIF/WebP and caches `/static/*` for a year.

---

## SEO: what is already wired

This is the part that actually moves search results. Every item below is implemented.

### 1. Metadata and canonical URLs

`app/layout.tsx` sets:

- `metadataBase` from `lib/site.ts`
- Title template: `%s | mxnan`
- Default title: `mxnan — Freelance Product Design & Front-End`
- Description, keywords, author, creator, publisher
- Open Graph and Twitter card defaults
- Googlebot directives with large image previews

Each route sets its own `alternates.canonical`, so `/`, `/blogs`, `/blogs/[slug]`, `/contact`, `/privacy`, and `/terms` cannot compete with each other as duplicates.

### 2. Sitemap

`app/sitemap.ts` generates `/sitemap.xml` at build time.

- Includes the homepage, blog index, contact page, and every published post.
- Uses `updatedAt ?? date` as `lastModified`.
- Excludes noindexed legal pages.

### 3. Robots

`app/robots.ts` generates `/robots.txt`.

- Allows all crawlers.
- Blocks `/api/`.
- Points to the sitemap and canonical host.

### 4. Structured data (JSON-LD)

Built in `lib/seo.ts`, rendered by `components/seo/json-ld.tsx`.

| Page | Schema |
| --- | --- |
| All pages | `WebSite`, `ProfessionalService` |
| `/blogs` | `Blog` with `BlogPosting` list |
| `/blogs/[slug]` | `BlogPosting`, `BreadcrumbList` |
| Sitewide | `Person` as founder/author/publisher |

This gives Google explicit entities for the site, the service, the author, and each article. Rich results become possible; they are never guaranteed.

### 5. Social cards

- Default: `public/og/default.jpg` at 1200×630.
- Posts override with their own `image`.
- `summary_large_image` is set for X/Twitter.
- `openGraph.type` is `article` on posts, with publish and modified times.

### 6. Semantic HTML

- One `H1` per page.
- Homepage sections use `H2`, not skipped `H3`s.
- Articles render inside `<article>`.
- Breadcrumbs describe Home → Blog → Post.
- Header and footer navigation are labeled.
- Skip link for keyboard users.

### 7. Performance and crawl hygiene

- Server components by default; client JS only where needed.
- AVIF/WebP images with explicit dimensions.
- Immutable caching on `/static/*`.
- `poweredByHeader: false`.
- 404 page for missing routes.
- Thin legal pages are `noindex, follow`.

---

## SEO: the launch checklist

Code alone will not rank the site. Do these once, in order.

### 1. Set the production URL

```bash
# .env.local (development)
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Production
NEXT_PUBLIC_APP_URL="https://mxnan.vercel.app"
```

Canonicals, sitemap URLs, robots, and JSON-LD all read from this value. If it is missing, the fallback is `https://mxnan.vercel.app`; if it is wrong, every canonical is wrong.

### 2. Verify with Google Search Console

1. Add `mxnan.vercel.app` as a Domain property.
2. Verify via DNS.
3. Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` if you prefer the meta tag method.
4. Submit `https://mxnan.vercel.app/sitemap.xml`.
5. Request indexing for `/`, `/blogs`, and the strongest case study.

Do the same in Bing Webmaster Tools.

### 3. Pick one hostname

Redirect `www` to non-`www` or the reverse. Never serve both. Canonicals already point to one origin, but a redirect removes ambiguity.

### 4. Replace the default social card

`/og/default.jpg` should be a branded image with your name and offer. Every share depends on it. Add per-post covers for case studies.

### 5. Fix the contact form before driving traffic

The current form in `components/site-assets/contact-form.tsx` simulates a request with `setTimeout`. It does not send anything. Wire it to a real endpoint, email service, or form provider before you market the site. A portfolio with a dead CTA wastes every click.

### 6. Replace placeholders

- Client testimonials on the homepage are placeholder names and quotes. Use real ones or remove the section.
- Privacy and Terms are placeholders. Replace them, then remove `robots: { index: false }` if you want them indexed.
- Add real project links and outcomes to case studies.

### 7. Add analytics and conversion tracking

Track inquiries, not pageviews. At minimum:

- Contact form submissions
- CTA clicks (`Contact me`)
- Blog post → contact page navigation

Vercel Analytics, Plausible, or GA4 all work. Pick one and keep it lightweight.

### 8. Earn links

Search engines need reasons to trust the domain:

- Link the site from GitHub, LinkedIn, X, and any client project pages.
- Publish case studies that clients will share.
- Cross-post technical posts to dev.to or Hashnode with a canonical back to `mxnan.vercel.app`.
- Answer questions where your posts are the actual answer.

### 9. Audit Core Web Vitals

Run Lighthouse on `/` and one post. Watch:

- LCP: hero image and font loading.
- CLS: fixed image dimensions and font swap.
- INP: cursor, Lenis, and motion effects.

The cursor and scroll effects are brand. Keep them, but measure them on a mid-range phone.

---

## Content and keyword strategy

The site has two content jobs. Treat them differently.

### Job 1: Sell the service

Target intent:

- freelance product designer
- freelance front-end developer
- Next.js developer for hire
- landing page design for startups
- product design for early-stage teams

Pages that serve this: `/`, `/contact`, and case studies.

### Job 2: Prove technical depth

Target intent:

- Next.js MDX blog
- rehype-pretty-code examples
- React cursor interaction
- Tailwind design tokens

These posts attract peers and links. They rarely bring clients directly. That is fine. They make the case studies credible.

### Rules that keep posts rankable

- One target query per post. Put it in the title, description, first 100 words, and one `H2`.
- Titles under 60 characters. Descriptions 140–160.
- Every case study includes a number: latency, conversion, load time, revenue, time saved.
- Link from every post to one relevant next step: another post or `/contact`.
- Publish one real case study per project. Do not pad the blog with tutorials you have not used.
- Update old posts when the stack changes. Set `updatedAt`.

### Page copy rules

- Lead with the result, not the process.
- Name the tech, the constraint, and the tradeoff.
- Cut the adjective. Keep the number.
- One CTA per screen. It is always "send a brief."

---

## Local development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Next.js dev server |
| `pnpm build` | Velite build, then production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint |
| `pnpm type-check` | TypeScript, no emit |
| `pnpm velite` | Compile content only |
| `pnpm velite:dev` | Watch content |
| `pnpm clean` | Remove `.next`, `.velite`, cache |

### Add a post

1. Create `content/blogs/my-post.mdx`.
2. Add frontmatter with `status: "published"`.
3. Run `pnpm dev` and visit `/blogs/my-post`.
4. Check the title, description, canonical, and social card.
5. Run `pnpm build` before shipping.

### Environment

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | Production | Canonical origin for metadata, sitemap, robots |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Optional | Search Console meta verification |

`.env.local` is not committed. Production values live in the host's dashboard.

---

## Deploy

The app is a standard Next.js build with no server database.

```bash
pnpm build
pnpm start
```

**Vercel:** import the repo, set `NEXT_PUBLIC_APP_URL=https://mxnan.vercel.app`, build with `pnpm build`. Static pages and the blog are prerendered. No runtime content dependency.

**Any Node host:** run `pnpm build`, then `pnpm start` behind a reverse proxy. Keep the Node version aligned with `package.json`.

After the first deploy:

1. Confirm `/robots.txt` and `/sitemap.xml` return 200.
2. Confirm canonicals point to the production domain.
3. Run the URL through the [Rich Results Test](https://search.google.com/test/rich-results).
4. Submit the sitemap.

---

## Repo conventions

- Server components are the default. Add `"use client"` only for browser APIs or state.
- Use `cn()` from `lib/utils.ts` for conditional Tailwind classes.
- Never edit `components/ui/` directly; wrap or compose instead.
- Content lives in `content/blogs/`. Velite is the only content source.
- Shared MDX primitives go in `components/mdx/`. Article-specific demos go in `components/articles/[slug]/`.
- Keep public routes to: home, blog index, post, contact, privacy, terms.
- Do not add a separate showcase route or component catalog.

---

## Known issues and roadmap

| Priority | Issue | Fix |
| --- | --- | --- |
| Blocker | Contact form only simulates submission | Wire to an API route, Resend, or a form provider |
| High | Testimonials are placeholders | Replace with real quotes or remove |
| High | Privacy and Terms are placeholders | Write real copy, then decide on indexing |
| Medium | Default OG image is generic | Add a branded 1200×630 card |
| Medium | `readingTime` is referenced in the blog index but not computed by Velite | Add a reading-time field or remove the UI |
| Medium | No RSS feed | Add `app/feed.xml/route.ts` for distribution |
| Low | No `sameAs` social profiles in `Person` schema | Add GitHub, LinkedIn, X once confirmed |
| Low | No analytics | Add one lightweight provider and track inquiries |

---

## License

Private portfolio project. All rights reserved.

**Work with me:** [mxnan.vercel.app/contact](https://mxnan.vercel.app/contact)
