<script lang="ts">
	import type { OccasionCategory, ViewMode } from '../types/tag';
	import OccasionCard from './OccasionCard.svelte';

	interface Props {
		occasions: OccasionCategory[];
		selectedId: string;
		viewMode: ViewMode;
		onSelect: (occasion: OccasionCategory) => void;
		onPreview: (occasion: OccasionCategory) => void;
	}

	let {
		occasions,
		selectedId,
		viewMode = 'grid',
		onSelect,
		onPreview
	}: Props = $props();
</script>

<div
	role="radiogroup"
	aria-label="Gift Occasion Categories"
	class="mt-6 {viewMode === 'grid'
		? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
		: 'flex flex-col gap-4'}"
>
	{#each occasions as occasion (occasion.id)}
		<OccasionCard
			{occasion}
			isSelected={selectedId === occasion.id}
			{viewMode}
			{onSelect}
			{onPreview}
		/>
	{:else}
		<div class="col-span-full py-16 text-center bg-surface-container-low/40 rounded-3xl border border-dashed border-outline-variant/50">
			<span class="material-symbols-outlined text-[48px] text-primary/60 mb-2">search_off</span>
			<h3 class="font-headline-sm text-headline-sm text-on-surface">No occasion vaults found</h3>
			<p class="font-body-sm text-body-sm text-on-surface-variant max-w-sm mx-auto mt-1">
				Try resetting your category filters or mood selection to browse the entire collection.
			</p>
		</div>
	{/each}
</div>

