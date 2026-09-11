import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import {
    getAllShowcaseComponents,
    getShowcaseComponent,
} from "@/config/showcase";
import { MDXContent } from "@/components/mdx/mdx";

interface Props {
    params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
    return getAllShowcaseComponents().map(({ category, slug }) => ({
        category,
        slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { category, slug } = await params;
    const component = getShowcaseComponent(category, slug);

    if (!component) {
        return {
            title: "Component Not Found",
        };
    }

    return {
        title: component.title,
        description: component.description,
    };
}

export default async function ComponentShowcasePage({ params }: Props) {
    const { category, slug } = await params;
    const component = getShowcaseComponent(category, slug);

    if (!component) {
        return (
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">Component Not Found</h1>
                <p className="text-muted-foreground mb-8">
                    The component you&apos;re looking for doesn&apos;t exist.
                </p>
                <Link
                    href="/showcase"
                    className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back to Showcase
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 flex">
            {/* Main Content */}
            <MDXContent code={component.content} type="component" />

            {/* TOC - renders as fixed button on mobile, sticky sidebar on desktop */}
            {/* <TableOfContents toc={component.toc} /> */}
        </div>
    );
}

