import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blogs",
  description: "Thoughts, notes, and articles powered by Velite and MDX.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  if (posts.length === 0) {
    return (
      <main className="flex flex-col gap-8">
        <section className="space-y-4">
          <h1>Blogs</h1>
          <p>No posts have been published yet. Please check back soon.</p>
        </section>
      </main>
    );
  }

  return (
    <div className="relative space-y-8 ">
      <section className="space-y-3 text-center">
        <h1>Blogs</h1>
        <p>
          Long-form notes, experiments, and write-ups about building with
          Next.js, React, and the modern web.
        </p>
      </section>

      <section className="space-y-6 ">
        <div className="space-y-0 divide-y divide-border">
          {posts.map((post) => (
            <div
              data-cursor="takeover"
              key={post.slug}
              className="group rounded-lg border bg-card/50 p-4 shadow-sm transition hover:-translate-y-0.5 hover:bg-card hover:shadow-md"
            >
              <Link href={post.slug} className="flex items-start gap-4">
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-lg font-semibold tracking-tight group-hover:text-foreground">
                      {post.title}
                    </h2>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
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
                  <p className="text-sm text-muted-foreground">
                    {post.description}
                  </p>
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {post.image && (
                  <Image
                    src={post.image}
                    alt=""
                    width={112}
                    height={80}
                    sizes="(max-width: 640px) 80px, 112px"
                    className="h-20 w-20 shrink-0 rounded-md object-cover sm:h-20 sm:w-28"
                  />
                )}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
