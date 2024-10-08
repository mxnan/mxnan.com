import React from "react";
import { allComponents } from "contentlayer/generated";
import { Mdx } from "@/components/mdx/mdx-components";
import type { Metadata } from "next";
import type { Components } from "contentlayer/generated";

interface ComponentPageProps {
  params: { category: string; slug: string };
}

async function getComponents(
  category: string,
  slug: string
): Promise<Components | undefined> {
  return allComponents.find(
    (components) =>
      components.category === category &&
      components.slug === `${category}/${slug}`
  );
}

export async function generateStaticParams(): Promise<
  ComponentPageProps["params"][]
> {
  return allComponents.map((components) => ({
    category: components.category,
    slug: components.slug.split("/").pop() ?? "",
  }));
}

export async function generateMetadata({
  params,
}: ComponentPageProps): Promise<Metadata> {
  const components = await getComponents(params.category, params.slug);

  return {
    title: components?.title,
    description: components?.description,
    alternates: {
      canonical: `https://mxnan.com/components/${params.category}/${params.slug}`,
    },
  };
}

export default async function ComponentPage({
  params,
}: ComponentPageProps): Promise<React.ReactElement> {
  const component = await getComponents(params.category, params.slug);

  if (!component) {
    return <div>Component not found</div>;
  }

  return (
    <section className="flex-1 relative">
      <Mdx source={component.body.code} />
    </section>
  );
}
