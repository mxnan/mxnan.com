import { Metadata } from "next";
import { getShowcase } from "@/lib/content";
import { MDXContent } from "@/components/mdx/mdx";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: "Showcase",
    description: "Interactive component showcase and demos",
};

export default function ShowcasePage() {
    const showcase = getShowcase();

    if (!showcase) {
        notFound();
    }

    return (
        <div className="relative w-full">
            <MDXContent code={showcase.body} type="component" />
        </div>
    );
}
