import type { Post } from "@/lib/content";
import {
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
} from "@/lib/site";

type JsonLd = Record<string, unknown>;

export function websiteSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "en",
    publisher: {
      "@type": "Person",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function professionalServiceSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    priceRange: "$$",
    areaServed: "Worldwide",
    serviceType: [
      "Product design",
      "Front-end development",
      "Landing page design",
      "UX design",
    ],
    founder: {
      "@type": "Person",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function blogSchema(posts: Post[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${SITE_NAME} Blog`,
    url: `${SITE_URL}/blogs`,
    description:
      "Essays and case studies on product design, front-end engineering, Next.js, React, and building interfaces people actually use.",
    inLanguage: "en",
    publisher: {
      "@type": "Person",
      name: SITE_NAME,
      url: SITE_URL,
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `${SITE_URL}/blogs/${post.slugAsParams}`,
      datePublished: new Date(post.date).toISOString(),
    })),
  };
}

export function blogPostingSchema(post: Post): JsonLd {
  const url = `${SITE_URL}/blogs/${post.slugAsParams}`;
  const image = absoluteUrl(post.image ?? DEFAULT_OG_IMAGE);
  const datePublished = new Date(post.date).toISOString();
  const dateModified = new Date(post.updatedAt ?? post.date).toISOString();

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description ?? SITE_DESCRIPTION,
    image: [image],
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    datePublished,
    dateModified,
    inLanguage: "en",
    author: {
      "@type": "Person",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(DEFAULT_OG_IMAGE),
      },
    },
    keywords: post.tags.join(", "),
    articleSection: post.tags[0],
    isPartOf: {
      "@type": "Blog",
      name: `${SITE_NAME} Blog`,
      url: `${SITE_URL}/blogs`,
    },
  };
}

export function breadcrumbSchema(
  items: Array<{ name: string; path: string }>,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
