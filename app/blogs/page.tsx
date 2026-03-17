import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blogs | mxnan",
  description: "Thoughts, notes, and articles powered by Velite and MDX.",
  openGraph: {
    title: "Blogs | mxnan",
    description: "Thoughts, notes, and articles powered by Velite and MDX.",
    type: "website",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  if (posts.length === 0) {
    return (
      <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-16">
        <section className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight">Blog</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            No posts have been published yet. Please check back soon.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-10 px-4 py-16">
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Blog</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Long-form notes, experiments, and write-ups about building with Next.js,
          React, and the modern web.
        </p>
      </section>

      <section className="space-y-6">
        <ul className="space-y-6">
          {posts.map((post) => (
            <li key={post.slug} className="group rounded-lg border border-neutral-200 bg-white/50 p-4 shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md dark:border-neutral-800 dark:bg-neutral-950/60 dark:hover:bg-neutral-900">
              <Link href={post.slug} className="block space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-lg font-semibold tracking-tight group-hover:text-neutral-900 dark:group-hover:text-neutral-50">
                    {post.title}
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                    <span>
                      {new Date(post.date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                      })}
                    </span>
                    {post.readingTime?.text && (
                      <span aria-hidden="true">•</span>
                    )}
                    {post.readingTime?.text && (
                      <span>{post.readingTime.text}</span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-300">
                  {post.description}
                </p>
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

