import { defineConfig, defineCollection, s } from "velite";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeAutoLinkHeadings from "rehype-autolink-headings";

const computedFields = <T extends { slug: string }>(data: T) => ({
  ...data,
  slugAsParams: data.slug.split("/").slice(1).join("/"),
});

const blogs = defineCollection({
  name: "Blogs",
  pattern: "blogs/*.mdx",
  schema: s
    .object({
      slug: s.path(),
      title: s.string().max(20),
      description: s.string().max(99).optional(),
      summary: s.string().max(200).optional(),
      date: s.isodate(),
      status: s.enum(["published", "draft"]).default("draft"),
      image: s.string().optional(),
      tags: s.string().array().optional(),
      content: s.mdx(),
    })
    .transform(computedFields),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { blogs },
  mdx: {
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: "tokyo-night",
        },
      ],
      [
        rehypeAutoLinkHeadings,
        {
          behavior: "after",
          properties: {
            className: ["subheading-anchor"],
            ariaLabel: "Link to section",
          },
        },
      ],
    ],
    remarkPlugins: [],
  },
});
