import { icons } from 'lucide-svelte';

export interface IconData {
	name: string;
	description: string;
	searchText: string;
}

// Extract icon names and create searchable data
export const iconsData: IconData[] = Object.keys(icons)
	.filter((key) => key !== 'createLucideIcon' && key !== 'Icon')
	.map((name) => {
		const description = generateDescription(name);
		return {
			name,
			description,
			searchText: `${name} ${description}`
		};
	});

function generateDescription(name: string): string {
	// Convert PascalCase to separate words
	const words = name
		.replace(/([A-Z])/g, ' $1')
		.trim()
		.toLowerCase();

	// Generate contextual description
	return `${words} icon`;
}
