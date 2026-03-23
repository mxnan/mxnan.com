import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/content";
import { MDXContent } from "@/components/mdx/mdx";
// import "@/styles/mdx.css";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.slugAsParams,
  }));
}

export async function generateMetadata(
  { params }: BlogPostPageProps,
): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {};
  }

  const title = `${post.title} | mxnan`;
  const description = post.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <article className="space-y-8">
        <header className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              Blog
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              {post.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span>
              {new Date(post.date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "2-digit",
              })}
            </span>
            {post.readingTime?.text && (
              <>
                <span aria-hidden="true">•</span>
                <span>{post.readingTime.text}</span>
              </>
            )}
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <section className="prose prose-neutral max-w-none dark:prose-invert">
          <MDXContent code={post.body} />
        </section>
      </article>
    </main>
  );
}

