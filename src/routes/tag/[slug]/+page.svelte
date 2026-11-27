<script lang="ts">
	import type { PageProps } from './$types';
	import type { FilterGroup, OccasionCategory, SortMode, ViewMode } from '#lib/types/tag';
	import TagUnlockedHero from '#lib/components/TagUnlockedHero.svelte';
	import OccasionFilters from '#lib/components/OccasionFilters.svelte';
	import OccasionGrid from '#lib/components/OccasionGrid.svelte';
	import VerificationNotice from '#lib/components/VerificationNotice.svelte';
	import FloatingDock from '#lib/components/FloatingDock.svelte';
	import QuickPreviewModal from '#lib/components/QuickPreviewModal.svelte';

	let { data }: PageProps = $props();

	// Interactive states
	// svelte-ignore state_referenced_locally
	let selectedId = $state(data.initialOccasionId || 'valentine');
	let selectedGroup = $state<FilterGroup>('all');
	let viewMode = $state<ViewMode>('grid');
	let sortMode = $state<SortMode>('curated');

	// Synchronize if url params change
	$effect(() => {
		if (data.initialOccasionId) {
			selectedId = data.initialOccasionId;
		}
	});

	// Modal states
	let previewOccasion = $state<OccasionCategory | null>(null);
	let isPreviewOpen = $state(false);

	// Pre-calculate filter counts
	const counts = $derived.by(() => {
		const res: Record<FilterGroup, number> = {
			all: data.occasions.length,
			romance: 0,
			milestones: 0,
			celebrations: 0,
			spontaneous: 0
		};
		for (const item of data.occasions) {
			if (res[item.filterGroup] !== undefined) {
				res[item.filterGroup]++;
			}
		}
		return res;
	});

	// Filtered & Sorted list
	const filteredOccasions = $derived.by(() => {
		let list = [...data.occasions];

		// Filter
		if (selectedGroup !== 'all') {
			list = list.filter((item: OccasionCategory) => item.filterGroup === selectedGroup);
		}

		// Sort
		if (sortMode === 'popular') {
			list.sort((a, b) => {
				const parseLikes = (s: string) => parseFloat(s.replace('k', '')) * (s.includes('k') ? 1000 : 1);
				return parseLikes(b.likes) - parseLikes(a.likes);
			});
		} else if (sortMode === 'title') {
			list.sort((a, b) => a.title.localeCompare(b.title));
		}

		return list;
	});

	// Currently selected occasion object
	const selectedOccasion = $derived(
		data.occasions.find((item: OccasionCategory) => item.id === selectedId) || data.occasions[0]
	);

	function handleSelect(occasion: OccasionCategory) {
		selectedId = occasion.id;
	}

	function handlePreview(occasion: OccasionCategory) {
		previewOccasion = occasion;
		isPreviewOpen = true;
	}

	function handleClosePreview() {
		isPreviewOpen = false;
		previewOccasion = null;
	}

	function handleSelectAndClose(occasion: OccasionCategory) {
		selectedId = occasion.id;
		handleClosePreview();
	}

	function handleResetFilters() {
		selectedGroup = 'all';
		sortMode = 'curated';
	}
</script>

<svelte:head>
	<title>Occasion Vaults — Tap &amp; Keep #{data.slug.toUpperCase()}</title>
	<meta
		name="description"
		content="You've unlocked a new NFC gift tag! Turn this physical tag into an unforgettable digital keepsake by choosing an occasion."
	/>
</svelte:head>

<div class="flex flex-col w-full">
	<div class="w-full max-w-7xl mx-auto pb-32 pt-4 px-2 sm:px-4">
		<!-- Ambient Tag Glow Deck -->
		<section
			aria-label="Category Selection Gallery Deck"
			class="relative bg-surface-container-lowest/80 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_24px_50px_-12px_rgba(152,67,76,0.12)] border border-outline-variant/30"
		>
			<!-- Micro Hardware & NFC Ping Header -->
			<TagUnlockedHero
				tagSlug={data.slug}
				chipModel={data.tagDetails.chipModel}
			/>

			<!-- Sleek Filter & Control Bar -->
			<OccasionFilters
				{selectedGroup}
				{viewMode}
				{sortMode}
				totalCount={filteredOccasions.length}
				{counts}
				onSelectGroup={(grp: FilterGroup) => (selectedGroup = grp)}
				onToggleView={(mode: ViewMode) => (viewMode = mode)}
				onSelectSort={(sort: SortMode) => (sortMode = sort)}
				onReset={handleResetFilters}
			/>

			<!-- Occasion Cards Grid -->
			<OccasionGrid
				occasions={filteredOccasions}
				{selectedId}
				{viewMode}
				onSelect={handleSelect}
				onPreview={handlePreview}
			/>

			<!-- Quick Physical Verification Callout & Security Info -->
			<VerificationNotice
				chipModel={data.tagDetails.chipModel}
				rewritesLeft={data.tagDetails.rewritesLeft}
				totalRewrites={data.tagDetails.totalRewrites}
				revision={data.tagDetails.revision}
			/>
		</section>

		<!-- Floating Dock Bottom Action Bar -->
		<FloatingDock
			{selectedOccasion}
			tagSlug={data.slug}
			stepText="Step 1 of 3"
		/>

		<!-- Quick Preview Modal -->
		<QuickPreviewModal
			occasion={previewOccasion}
			isOpen={isPreviewOpen}
			onClose={handleClosePreview}
			onSelectAndClose={handleSelectAndClose}
		/>
	</div>
</div>
