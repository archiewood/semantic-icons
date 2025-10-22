import type { PageLoad } from './$types';
import type { IconWithEmbedding } from '$lib/search';

export const ssr = false;

export const load: PageLoad = async ({ fetch }) => {
	const response = await fetch('/embeddings.json');
	const iconsWithEmbeddings: IconWithEmbedding[] = await response.json();

	return {
		iconsWithEmbeddings
	};
};
