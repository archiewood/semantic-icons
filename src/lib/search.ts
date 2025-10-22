import type { IconData } from './icons-data';

export interface IconWithEmbedding extends IconData {
	embedding: number[];
}

// Calculate cosine similarity between two vectors
function cosineSimilarity(a: number[], b: number[]): number {
	let dotProduct = 0;
	let magnitudeA = 0;
	let magnitudeB = 0;

	for (let i = 0; i < a.length; i++) {
		dotProduct += a[i] * b[i];
		magnitudeA += a[i] * a[i];
		magnitudeB += b[i] * b[i];
	}

	magnitudeA = Math.sqrt(magnitudeA);
	magnitudeB = Math.sqrt(magnitudeB);

	if (magnitudeA === 0 || magnitudeB === 0) {
		return 0;
	}

	return dotProduct / (magnitudeA * magnitudeB);
}

export async function searchIcons(
	query: string,
	iconsWithEmbeddings: IconWithEmbedding[]
): Promise<IconData[]> {
	if (!query.trim()) {
		return iconsWithEmbeddings.map(({ embedding, ...icon }) => icon);
	}

	// Get query embedding from API
	const response = await fetch('/api/embed', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ text: query })
	});

	if (!response.ok) {
		throw new Error('Failed to generate embedding');
	}

	const { embedding: queryEmbedding } = await response.json();

	// Calculate similarity scores
	const results = iconsWithEmbeddings.map((icon) => ({
		icon,
		score: cosineSimilarity(queryEmbedding, icon.embedding)
	}));

	// Sort by similarity score (highest first)
	results.sort((a, b) => b.score - a.score);

	// Return top results (filter out very low scores)
	return results
		.filter((result) => result.score > 0.3)
		.map(({ icon: { embedding, ...icon } }) => icon);
}
