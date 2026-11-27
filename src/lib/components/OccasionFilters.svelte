<script lang="ts">
	import type { FilterGroup, SortMode, ViewMode } from '../types/tag';

	interface Props {
		selectedGroup: FilterGroup;
		viewMode: ViewMode;
		sortMode: SortMode;
		totalCount: number;
		counts: Record<FilterGroup, number>;
		onSelectGroup: (group: FilterGroup) => void;
		onToggleView: (mode: ViewMode) => void;
		onSelectSort: (sort: SortMode) => void;
		onReset: () => void;
	}

	let {
		selectedGroup = 'all',
		viewMode = 'grid',
		sortMode = 'curated',
		totalCount = 6,
		counts,
		onSelectGroup,
		onToggleView,
		onSelectSort,
		onReset
	}: Props = $props();

	let isSortOpen = $state(false);
	let isMoodOpen = $state(false);
	let selectedMood = $state('Warm & Intimate');

	const moods = ['Warm & Intimate', 'Playful & Festive', 'Serene & Minimal', 'Bold & Vibrant'];

	const filterPills: { id: FilterGroup; label: string }[] = [
		{ id: 'all', label: 'All Occasions' },
		{ id: 'romance', label: 'Romance' },
		{ id: 'milestones', label: 'Milestones' },
		{ id: 'celebrations', label: 'Celebrations' },
		{ id: 'spontaneous', label: 'Spontaneous' }
	];

	function handleSortChange(mode: SortMode) {
		onSelectSort(mode);
		isSortOpen = false;
	}

	function handleMoodChange(mood: string) {
		selectedMood = mood;
		isMoodOpen = false;
	}
</script>

<div class="mt-8 pt-6 border-t border-outline-variant/30 flex flex-col gap-4">
	<!-- Top Bar: Header, Filter Toggles, and Grid/Agenda View Switch -->
	<div class="flex flex-wrap items-center justify-between gap-3">
		<div class="flex items-center gap-2">
			<span class="font-headline-sm text-headline-sm text-on-surface font-semibold">Occasion Vaults</span>
			<span class="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm font-bold">
				{totalCount}
			</span>
		</div>

		<div class="flex items-center gap-2">
			<!-- Reset Filter Button -->
			<button
				type="button"
				onclick={onReset}
				class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-label-sm text-label-sm transition-colors cursor-pointer"
				title="Reset filters to default"
			>
				<span class="material-symbols-outlined text-[16px]">restart_alt</span>
				<span class="hidden sm:inline">Reset</span>
			</button>

			<!-- Layout View Switcher: Grid vs Agenda -->
			<div class="flex items-center bg-surface-container-low p-1 rounded-full border border-outline-variant/20" role="group" aria-label="Layout view mode">
				<button
					type="button"
					onclick={() => onToggleView('grid')}
					aria-label="Grid View"
					class="w-7 h-7 rounded-full transition-all flex items-center justify-center cursor-pointer {viewMode === 'grid'
						? 'bg-surface-container-lowest text-primary shadow-xs'
						: 'text-on-surface-variant hover:text-on-surface'}"
				>
					<span class="material-symbols-outlined text-[16px]">grid_view</span>
				</button>
				<button
					type="button"
					onclick={() => onToggleView('agenda')}
					aria-label="Agenda View"
					class="w-7 h-7 rounded-full transition-all flex items-center justify-center cursor-pointer {viewMode === 'agenda'
						? 'bg-surface-container-lowest text-primary shadow-xs'
						: 'text-on-surface-variant hover:text-on-surface'}"
				>
					<span class="material-symbols-outlined text-[16px]">view_agenda</span>
				</button>
			</div>
		</div>
	</div>

	<!-- Bottom Filter Row: Occasion Category Pills & Sorter Dropdowns -->
	<div class="flex flex-wrap items-center justify-between gap-2.5">
		<!-- Category Filter Pills -->
		<div class="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Category Filters">
			{#each filterPills as pill}
				<button
					type="button"
					role="tab"
					aria-selected={selectedGroup === pill.id}
					onclick={() => onSelectGroup(pill.id)}
					class="px-3.5 py-1.5 rounded-full font-label-sm text-label-sm transition-all flex items-center gap-1.5 cursor-pointer {selectedGroup === pill.id
						? 'bg-primary text-on-primary font-semibold shadow-xs'
						: 'bg-surface-container-low/80 hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface'}"
				>
					<span>{pill.label}</span>
					<span class="text-[10px] {selectedGroup === pill.id ? 'opacity-90 font-bold' : 'opacity-60'}">
						{counts[pill.id] ?? 0}
					</span>
				</button>
			{/each}
		</div>

		<!-- Sorter and Mood Dropdowns -->
		<div class="flex items-center gap-2 relative">
			<!-- Sort Dropdown -->
			<div class="relative">
				<button
					type="button"
					onclick={() => {
						isSortOpen = !isSortOpen;
						isMoodOpen = false;
					}}
					class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container-low/80 hover:bg-surface-container text-on-surface-variant font-label-sm text-label-sm border border-outline-variant/30 cursor-pointer transition-colors"
				>
					<span>Sort:</span>
					<span class="font-semibold text-on-surface capitalize">
						{sortMode === 'curated' ? 'Curated First' : sortMode === 'popular' ? 'Most Popular' : 'Title (A-Z)'}
					</span>
					<span class="material-symbols-outlined text-[14px]">expand_more</span>
				</button>

				{#if isSortOpen}
					<div class="absolute right-0 top-full mt-1.5 w-44 rounded-2xl bg-surface-container-lowest shadow-xl border border-outline-variant/20 py-1.5 z-30">
						<button
							type="button"
							onclick={() => handleSortChange('curated')}
							class="w-full text-left px-3 py-1.5 text-label-sm hover:bg-surface-container flex items-center justify-between {sortMode === 'curated' ? 'text-primary font-bold' : 'text-on-surface'}"
						>
							Curated First
							{#if sortMode === 'curated'}
								<span class="material-symbols-outlined text-[14px]">check</span>
							{/if}
						</button>
						<button
							type="button"
							onclick={() => handleSortChange('popular')}
							class="w-full text-left px-3 py-1.5 text-label-sm hover:bg-surface-container flex items-center justify-between {sortMode === 'popular' ? 'text-primary font-bold' : 'text-on-surface'}"
						>
							Most Popular
							{#if sortMode === 'popular'}
								<span class="material-symbols-outlined text-[14px]">check</span>
							{/if}
						</button>
						<button
							type="button"
							onclick={() => handleSortChange('title')}
							class="w-full text-left px-3 py-1.5 text-label-sm hover:bg-surface-container flex items-center justify-between {sortMode === 'title' ? 'text-primary font-bold' : 'text-on-surface'}"
						>
							Title (A-Z)
							{#if sortMode === 'title'}
								<span class="material-symbols-outlined text-[14px]">check</span>
							{/if}
						</button>
					</div>
				{/if}
			</div>

			<!-- Mood Dropdown -->
			<div class="relative hidden sm:block">
				<button
					type="button"
					onclick={() => {
						isMoodOpen = !isMoodOpen;
						isSortOpen = false;
					}}
					class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container-low/80 hover:bg-surface-container text-on-surface-variant font-label-sm text-label-sm border border-outline-variant/30 cursor-pointer transition-colors"
				>
					<span>Mood:</span>
					<span class="font-semibold text-on-surface">{selectedMood}</span>
					<span class="material-symbols-outlined text-[14px]">expand_more</span>
				</button>

				{#if isMoodOpen}
					<div class="absolute right-0 top-full mt-1.5 w-44 rounded-2xl bg-surface-container-lowest shadow-xl border border-outline-variant/20 py-1.5 z-30">
						{#each moods as mood}
							<button
								type="button"
								onclick={() => handleMoodChange(mood)}
								class="w-full text-left px-3 py-1.5 text-label-sm hover:bg-surface-container flex items-center justify-between {selectedMood === mood ? 'text-primary font-bold' : 'text-on-surface'}"
							>
								{mood}
								{#if selectedMood === mood}
									<span class="material-symbols-outlined text-[14px]">check</span>
								{/if}
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

