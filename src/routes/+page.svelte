<script lang="ts">
	import { searchIcons } from '$lib/search';
	import { icons } from 'lucide-svelte';

	let query = $state('');
	let results = $derived(searchIcons(query));
</script>

<div class="container">
	<header>
		<h1>Lucide Icon Search</h1>
		<p>Semantic search for Lucide icons - type to find icons by name or keyword</p>
	</header>

	<input
		type="text"
		bind:value={query}
		placeholder="Search icons... (e.g., 'home', 'user', 'arrow')"
		class="search-input"
	/>

	<div class="results-count">
		{results.length} {results.length === 1 ? 'icon' : 'icons'} found
	</div>

	<div class="icons-grid">
		{#each results as icon}
			{@const IconComponent = icons[icon.name]}
			<div class="icon-card">
				<div class="icon-preview">
					<svelte:component this={IconComponent} size={32} />
				</div>
				<div class="icon-name">{icon.name}</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	header {
		text-align: center;
		margin-bottom: 2rem;
	}

	h1 {
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
		color: #333;
	}

	p {
		color: #666;
		font-size: 1rem;
	}

	.search-input {
		width: 100%;
		padding: 1rem;
		font-size: 1.125rem;
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		margin-bottom: 1rem;
		transition: border-color 0.2s;
	}

	.search-input:focus {
		outline: none;
		border-color: #4a90e2;
	}

	.results-count {
		margin-bottom: 1.5rem;
		color: #666;
		font-size: 0.9rem;
	}

	.icons-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		gap: 1rem;
	}

	.icon-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1.5rem 1rem;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		transition: all 0.2s;
		cursor: pointer;
	}

	.icon-card:hover {
		border-color: #4a90e2;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		transform: translateY(-2px);
	}

	.icon-preview {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 0.75rem;
		color: #333;
	}

	.icon-name {
		font-size: 0.875rem;
		color: #666;
		text-align: center;
		word-break: break-word;
	}
</style>
