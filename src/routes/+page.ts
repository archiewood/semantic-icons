import type { PageLoad } from './$types';
import { iconsData } from '$lib/icons-data';

export const load: PageLoad = async () => {
	// Return lightweight icon data immediately for fast SSR
	return {
		icons: iconsData
	};
};
