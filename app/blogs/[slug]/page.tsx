import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/content";
import { MDXContent } from "@/components/mdx/mdx";
import { TableOfContents } from "@/components/mdx/toc/toc";
import { JsonLd } from "@/components/seo/json-ld";
import { blogPostingSchema, breadcrumbSchema } from "@/lib/seo";
import {
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_LOCALE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";
import Image from "next/image";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slugAsParams }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return {};

  const title = post.title;
  const description = post.description ?? SITE_DESCRIPTION;
  const image = post.image ?? DEFAULT_OG_IMAGE;
  const url = `${SITE_URL}/blogs/${post.slugAsParams}`;

  return {
    title, // becomes "Post Title | mxnan" via the root template
    description,
    keywords: post.tags,
    alternates: { canonical: url },
    authors: [{ name: SITE_NAME, url: SITE_URL }],

    openGraph: {
      type: "article",
      url,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      title,
      description,
      publishedTime: new Date(post.date).toISOString(),
      modifiedTime: new Date(post.updatedAt ?? post.date).toISOString(),
      authors: [SITE_NAME],
      tags: post.tags,
      section: post.tags[0],
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
    <div className="relative flex w-full min-w-0 gap-8">
      <JsonLd data={blogPostingSchema(post)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blogs" },
          { name: post.title, path: `/blogs/${post.slugAsParams}` },
        ])}
      />

      <article className="flex min-w-0 flex-1 flex-col gap-8">
        <Image
          data-cursor="invert"
          src={post.image ?? DEFAULT_OG_IMAGE}
          alt={post.title}
          width={1200}
          height={630}
          className="w-min h-auto aspect-video rounded-lg mb-8"
          priority
        />
        <MDXContent code={post.body} />
      </article>
      <TableOfContents toc={post.toc} />
    </div>
  );
}
