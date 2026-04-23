/**
 * Showcase Configuration
 * 
 * Pulls showcase components directly from Velite-compiled content.
 * Add components as MDX files in: content/components/[category]/component-name.mdx
 * 
 * Velite automatically compiles them with frontmatter and MDX content.
 */

import { components } from "#site/content";

export type ShowcaseComponent = typeof components[number];

/**
 * Get all showcase categories
 */
export function getShowcaseCategories(): Array<{
	category: string;
	label: string;
	count: number;
}> {
	const categories = new Map<string, number>();

	components.forEach(comp => {
		const count = categories.get(comp.category) || 0;
		categories.set(comp.category, count + 1);
	});

	return Array.from(categories.entries()).map(([category, count]) => ({
		category,
		label: category.charAt(0).toUpperCase() + category.slice(1),
		count,
	}));
}

/**
 * Get components for a specific category
 */
export function getShowcaseCategoryComponents(category: string) {
	return components.filter(comp => comp.category === category);
}

/**
 * Resolve component slug to find it (slug is just the filename like "github-star")
 */
export function getShowcaseComponent(category: string, slug: string) {
	return components.find(
		comp => comp.category === category && comp.slugAsParams.endsWith(`/${slug}`)
	);
}

/**
 * Get all showcase components
 */
export function getAllShowcaseComponents() {
	return components.map(comp => {
		// Extract just the filename (last part) from slugAsParams
		// slugAsParams is like "buttons/github-star", we want just "github-star"
		const filename = comp.slugAsParams.split('/').pop() || comp.slugAsParams;
		return {
			category: comp.category,
			slug: filename,
			component: comp,
		};
	});
}

