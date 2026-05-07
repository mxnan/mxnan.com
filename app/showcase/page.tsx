import { Metadata } from "next";
import { getShowcaseCategories } from "@/config/showcase";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Showcase",
    description: "Interactive component showcase and demos",
};

export default function ShowcasePage() {
    const categories = getShowcaseCategories();

    return (
        <div className="relative w-full space-y-8">
            <div className="mb-12">
                <h1 className="text-4xl font-bold mb-4">Component Showcase</h1>
                <p className="text-muted-foreground text-lg">
                    Browse interactive component demos and explore the source code. Browse interactive component demos and explore the source code. Browse interactive component demos and explore the source code. Browse interactive component demos and explore the source code. Browse interactive component demos and explore the source code.

                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.map(({ category, label, count }) =>
                    count > 0 ? (
                        <Link
                            key={category}
                            href={`/showcase/${category}/github-star`}
                            className="border border-border rounded-lg p-6 hover:shadow-md hover:border-primary/50 transition-all group"
                        >
                            <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                                {label}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {count} component{count !== 1 ? "s" : ""}
                            </p>
                        </Link>
                    ) : (
                        <div
                            key={category}
                            className="border border-border rounded-lg p-6 opacity-50"
                        >
                            <h2 className="text-2xl font-bold mb-2">{label}</h2>
                            <p className="text-sm text-muted-foreground">
                                Coming soon...
                            </p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
