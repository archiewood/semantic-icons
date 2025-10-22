import Fuse from 'fuse.js';
import { iconsData, type IconData } from './icons-data';

const fuse = new Fuse(iconsData, {
	keys: ['name', 'keywords'],
	threshold: 0.4,
	includeScore: true,
	minMatchCharLength: 1
});

export function searchIcons(query: string): IconData[] {
	if (!query.trim()) {
		return iconsData;
	}

	const results = fuse.search(query);
	return results.map((result) => result.item);
}
