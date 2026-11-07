import rehypePrettyCode from "rehype-pretty-code";
import { defineConfig, defineCollection, s } from "velite";

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
      title: s.string().max(99),
      description: s.string().max(199).optional(),
      date: s.isodate(),
      updatedAt: s.isodate().optional(),
      status: s.enum(["published", "draft"]).default("draft"),
      featured: s.boolean().optional(),
      image: s.string().optional(),
      tags: s.string().array().optional(),
      toc: s.toc(),
      content: s.mdx(),
    })
    .transform((data) => ({
      ...computedFields(data),
      tags: data.tags ?? [],
      featured: Boolean(data.featured),
    })),
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
  collections: {
    blogs,
  },
  mdx: {
    rehypePlugins: [rehypePrettyCode],
    remarkPlugins: [],
  },
});

