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
      title: s.string(),
      description: s.string().optional(),
      date: s.isodate(),
      status: s.enum(["published", "draft"]).default("draft"),
      image: s.string().optional(),
      tags: s.string().array().optional(),
      toc: s.toc(),
      content: s.mdx(),
    })
    .transform(computedFields),
});
const components = defineCollection({
  name: "Components",
  pattern: "components/**/*.mdx",
  schema: s
    .object({
      slug: s.path(),
      title: s.string().max(50),
      description: s.string().max(200),
      tags: s.string().array().optional(),
      toc: s.toc(),
      content: s.mdx(),
    })
       .transform((data) => ({
      ...computedFields(data),
      category: data.slug.split("/")[1], // Extract category from the slug
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
    components,
  },
  mdx: {
    rehypePlugins: [rehypePrettyCode],
    remarkPlugins: [],
  },
});

