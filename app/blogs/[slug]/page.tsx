import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/content";
import { MDXContent } from "@/components/mdx/mdx";
import { TableOfContents } from "@/components/mdx/toc/toc";
import Image from "next/image";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slugAsParams }));
}

export async function generateMetadata(
  { params }: BlogPostPageProps
): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return {};

  // ✅ Don't append "| mxnan" — the template in layout.tsx does it
  const title = post.title;
  const description = post.description;
  const image = post.image ?? "/og/default.png";

  return {
    title,        // becomes "Post Title | mxnan" via template
    description,

    openGraph: {
      title,
      description,
      type: "article",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/blogs/${slug}`,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  return (
    <main className="mx-auto w-full min-h-screen">
      <section className="max-w-min mx-auto flex flex-col gap-8">
        <Image
          src={post.image ?? "/og/default.png"}
          alt={post.title}
          width={1200}
          height={630}
          className="w-full h-auto rounded-lg mb-8"
          priority
        />
        <MDXContent code={post.body} />
        <TableOfContents toc={post.toc} />
      </section>
    </main>
  );
}