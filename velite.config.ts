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
    rehypePlugins: [
      // rehypeSlug,
      //   [
      //     rehypePrettyCode,
      //     {
      //       theme: "vitesse-black",
      //     },
      //   ],
      // [
      //   rehypeAutoLinkHeadings,
      //   {
      //     behavior: ":wrap",
      //     properties: {
      //       className: ["subheading-anchor"],
      //       ariaLabel: "Link to section",
      //     },
      //   },
      // ],
    ],
    remarkPlugins: [],
  },
});

