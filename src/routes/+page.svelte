<script lang="ts">
	import { onMount } from 'svelte';
	import { searchIcons, type IconWithEmbedding } from '$lib/search';
	import { icons } from 'lucide-svelte';
	import type { Component } from 'svelte';
	import type { IconData } from '$lib/icons-data';

	let { data } = $props();

	let query = $state('');
	let results = $state<IconData[]>(data.icons);
	let isSearching = $state(false);
	let copiedIcon = $state<string | null>(null);
	let embeddingsLoaded = $state(false);
	let embeddingsLoading = $state(true);
	let iconsWithEmbeddings = $state<IconWithEmbedding[]>([]);

	// Lazy load embeddings in the background (client-side only)
	onMount(async () => {
		try {
			const response = await fetch('/embeddings.json');
			iconsWithEmbeddings = await response.json();
			embeddingsLoaded = true;
		} catch (error) {
			console.error('Failed to load embeddings:', error);
		} finally {
			embeddingsLoading = false;
		}
	});

	// Debounced search
	let searchTimeout: ReturnType<typeof setTimeout>;
	$effect(() => {
		clearTimeout(searchTimeout);

		if (!query.trim()) {
			results = data.icons;
			isSearching = false;
			return;
		}

		// If embeddings aren't loaded yet, use simple text search as fallback
		if (!embeddingsLoaded) {
			results = data.icons.filter((icon) =>
				icon.searchText.toLowerCase().includes(query.toLowerCase())
			);
			isSearching = false;
			return;
		}

		isSearching = true;
		searchTimeout = setTimeout(async () => {
			try {
				results = await searchIcons(query, iconsWithEmbeddings);
			} catch (error) {
				console.error('Search error:', error);
			} finally {
				isSearching = false;
			}
		}, 500);
	});

	function getIconComponent(name: string): Component {
		return (icons as unknown as Record<string, Component>)[name];
	}

	function formatIconName(name: string): string {
		// Insert zero-width spaces between lowercase and uppercase letters for better wrapping
		return name.replace(/([a-z])([A-Z])/g, '$1\u200B$2');
	}

	async function copyToClipboard(iconName: string) {
		try {
			await navigator.clipboard.writeText(iconName);
			copiedIcon = iconName;
			setTimeout(() => {
				copiedIcon = null;
			}, 2000);
		} catch (error) {
			console.error('Failed to copy:', error);
		}
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		<header class="text-center mb-12">
			<h1 class="text-5xl font-bold text-slate-900 mb-3">Semantic Lucide</h1>
			<p class="text-xl text-slate-600">Search lucide-svelte icons by meaning</p>
		</header>

		<div class="max-w-2xl mx-auto mb-8">
			<input
				type="text"
				bind:value={query}
				placeholder="Search icons... (e.g., 'house', 'trash', 'happy')"
				class="w-full px-6 py-4 text-lg bg-white border-2 border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400"
			/>
		</div>

		<div class="mb-6 text-center text-slate-600">
			{#if isSearching}
				<span class="inline-flex items-center gap-2">
					<span
						class="inline-block w-4 h-4 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin"
					></span>
					Searching...
				</span>
			{:else}
				<span class="font-medium">{results.length}</span>
				{results.length === 1 ? 'icon' : 'icons'} found
			{/if}
		</div>

		<div
			class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2"
		>
			{#each results as icon (icon.name)}
				{@const IconComponent = getIconComponent(icon.name)}
				{@const isCopied = copiedIcon === icon.name}
				<button
					type="button"
					onclick={() => copyToClipboard(icon.name)}
					class="aspect-square p-3 rounded-lg border transition-all duration-200 flex flex-col items-center justify-center gap-2 cursor-pointer group {isCopied
						? 'bg-green-50 border-green-500 shadow-lg'
						: 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-lg'}"
				>
					<div
						class="transition-colors {isCopied
							? 'text-green-600'
							: 'text-slate-700 group-hover:text-blue-600'}"
					>
						<IconComponent size={24} />
					</div>
					<div
						class="text-[10px] text-center break-words w-full line-clamp-2 {isCopied
							? 'text-green-700 font-medium'
							: 'text-slate-600'}"
					>
						{isCopied ? 'Copied!' : formatIconName(icon.name)}
					</div>
				</button>
			{/each}
		</div>
	</div>
</div>
