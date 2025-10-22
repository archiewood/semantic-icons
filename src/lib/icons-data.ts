import { icons } from 'lucide-svelte';

export interface IconData {
	name: string;
	keywords: string[];
}

// Extract icon names and create searchable data
export const iconsData: IconData[] = Object.keys(icons)
	.filter((key) => key !== 'createLucideIcon' && key !== 'Icon')
	.map((name) => ({
		name,
		keywords: generateKeywords(name)
	}));

function generateKeywords(name: string): string[] {
	// Convert PascalCase to separate words and lowercase
	const words = name
		.replace(/([A-Z])/g, ' $1')
		.trim()
		.toLowerCase()
		.split(' ');

	return [
		name.toLowerCase(),
		...words,
		words.join(' '),
		words.join('-')
	];
}
