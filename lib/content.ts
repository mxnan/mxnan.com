import { blogs, components } from "#site/content";

export type Post = (typeof blogs)[number] & {
  published: boolean;
  tags: string[];
  readingTime?: {
    text: string;
    minutes: number;
    words: number;
  };
  body: string;
};

export type Showcase = (typeof components)[number] & {
  body: string;
};

function normalizeSlug(input: unknown): string {
  if (typeof input !== "string") return "";
  return input.replace(/^\/+|\/+$/g, "");
}

function isPublished(post: Post): boolean {
  return post.status === "published";
}

function compareByDateDesc(a: Post, b: Post): number {
  const aTime = new Date(a.date).getTime();
  const bTime = new Date(b.date).getTime();
  return bTime - aTime;
}

export function getAllPosts(): Post[] {
  return blogs
    .map((post) => ({
      ...post,
      published: post.status === "published",
      tags: post.tags ?? [],
      body: post.content,
    }))
    .filter(isPublished)
    .toSorted(compareByDateDesc);
}

export function getPostBySlug(slug: string): Post | null {
  const normalizedSlug = normalizeSlug(slug);
  const allPosts = getAllPosts();
  const match = allPosts.find(
    (post) => {
      const key = post.slugAsParams ?? post.slug;
      return normalizeSlug(key) === normalizedSlug;
    },
  );
  return match ?? null;
}

export function getShowcase(): Showcase | null {
  const showcase = components.find(
    (comp) => comp.category === "_showcase"
  );
  if (!showcase) return null;
  return {
    ...showcase,
    body: showcase.content,
  };
}

