<script lang="ts">
	import type { OccasionCategory, ViewMode } from '../types/tag';

	interface Props {
		occasion: OccasionCategory;
		isSelected: boolean;
		viewMode?: ViewMode;
		onSelect: (occasion: OccasionCategory) => void;
		onPreview: (occasion: OccasionCategory) => void;
	}

	let {
		occasion,
		isSelected = false,
		viewMode = 'grid',
		onSelect,
		onPreview
	}: Props = $props();

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onSelect(occasion);
		}
	}
</script>

<div
	role="radio"
	aria-checked={isSelected}
	tabindex="0"
	onclick={() => onSelect(occasion)}
	onkeydown={handleKeyDown}
	class="group relative cursor-pointer select-none rounded-2xl overflow-hidden transition-all duration-300 flex {viewMode === 'agenda'
		? 'flex-col sm:flex-row'
		: 'flex-col'} {isSelected
		? 'bg-surface-container-lowest border-2 border-primary shadow-[0_16px_36px_rgba(152,67,76,0.22)] -translate-y-1'
		: 'bg-surface-container-lowest border border-outline-variant/30 hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(152,67,76,0.12)]'}"
>
	<!-- Media Header with Aspect Ratio & Badges -->
	<div
		class="relative overflow-hidden bg-surface-container {viewMode === 'agenda'
			? 'w-full sm:w-56 sm:min-w-[14rem] aspect-[16/10] sm:aspect-auto'
			: 'w-full aspect-[16/10]'}"
	>
		<img
			src={occasion.image}
			alt={occasion.title}
			class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
			loading="lazy"
		/>
		<div
			class="absolute inset-0 {isSelected
				? 'bg-gradient-to-t from-primary/60 via-transparent to-black/10'
				: 'bg-gradient-to-t from-black/40 via-transparent to-black/10'}"
		></div>

		<!-- Badges Overlay (Top-Left) -->
		<div class="absolute top-3 left-3 flex items-center gap-1.5">
			{#if isSelected}
				<span
					class="px-2.5 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-[11px] font-bold flex items-center gap-1 shadow-sm"
				>
					<span class="material-symbols-outlined text-[12px]" style="font-variation-settings: 'FILL' 1;">
						favorite
					</span>
					Selected
				</span>
			{/if}

			{#each occasion.badges as badge}
				<span
					class="px-2 py-0.5 rounded-full font-label-sm text-[11px] shadow-xs flex items-center gap-1 {badge.variant ===
					'sotd'
						? 'bg-primary/85 text-on-primary font-semibold'
						: badge.variant === 'timeless' || badge.variant === 'anytime'
							? 'bg-secondary-fixed text-on-secondary-fixed font-semibold'
							: badge.variant === 'new-era'
								? 'bg-tertiary-fixed text-on-tertiary-fixed font-semibold'
								: 'bg-surface-container-lowest/90 backdrop-blur-md text-on-surface font-bold uppercase tracking-wider'}"
				>
					{#if badge.icon}
						<span class="material-symbols-outlined text-[12px]">{badge.icon}</span>
					{/if}
					{badge.label}
				</span>
			{/each}
		</div>

		<!-- Chip Spec (Top-Right) -->
		<div class="absolute top-3 right-3">
			<span
				class="px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-white font-label-sm text-[10px] flex items-center gap-1"
			>
				<span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
				{occasion.chipType}
			</span>
		</div>

		<!-- Occasion Number & Community Likes (Bottom) -->
		<div class="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white font-label-sm text-[11px]">
			<span class={isSelected ? 'font-medium' : 'text-white/90'}>
				Occasion #{occasion.number} {isSelected ? '· Active' : ''}
			</span>
			<span class="flex items-center gap-1 font-medium">
				<span
					class="material-symbols-outlined text-[14px] {isSelected
						? 'text-primary-fixed'
						: 'text-white/80'}"
					style="font-variation-settings: 'FILL' 1;"
				>
					favorite
				</span>
				{occasion.likes}
			</span>
		</div>
	</div>

	<!-- Card Body Content -->
	<div
		class="p-4 flex flex-col flex-1 justify-between transition-colors {isSelected
			? 'bg-primary-fixed/20'
			: 'bg-surface-container-lowest'}"
	>
		<div>
			<div class="flex items-start justify-between gap-2">
				<div>
					<div class="flex items-center gap-1.5">
						<h2
							class="font-headline-sm text-[18px] font-bold leading-tight transition-colors {isSelected
								? 'text-primary'
								: 'text-on-surface group-hover:text-primary'}"
						>
							{occasion.title}
						</h2>
						{#if occasion.isVerified || isSelected}
							<span
								class="material-symbols-outlined text-primary text-[16px]"
								style="font-variation-settings: 'FILL' 1;"
							>
								verified
							</span>
						{/if}
					</div>
					<p class="font-body-sm text-[12px] text-on-surface-variant mt-0.5">
						By {occasion.studio} • {occasion.edition}
					</p>
				</div>

				<!-- Radio Indicator -->
				<div
					class="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 shrink-0 mt-0.5 {isSelected
						? 'bg-primary text-on-primary shadow-xs'
						: 'bg-surface-container-high'}"
				>
					<span
						class="material-symbols-outlined text-[14px] font-bold {isSelected
							? 'text-on-primary'
							: 'text-transparent'}"
					>
						check
					</span>
				</div>
			</div>

			<p
				class="font-body-sm text-body-sm mt-2 line-clamp-2 {isSelected
					? 'text-on-surface'
					: 'text-on-surface-variant'}"
			>
				{occasion.description}
			</p>
		</div>

		<!-- Card Actions: Quick Preview & Select -->
		<div
			class="mt-4 pt-3 flex items-center justify-between gap-2 border-t {isSelected
				? 'border-primary/20'
				: 'border-outline-variant/30'}"
		>
			<button
				type="button"
				onclick={(e) => {
					e.stopPropagation();
					onPreview(occasion);
				}}
				class="px-3 py-1.5 rounded-full font-label-sm text-[12px] flex items-center gap-1 transition-colors cursor-pointer {isSelected
					? 'bg-surface-container-lowest hover:bg-surface-container text-on-surface shadow-xs'
					: 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface'}"
			>
				<span class="material-symbols-outlined text-[14px]">visibility</span>
				<span>Quick Preview</span>
			</button>

			<button
				type="button"
				onclick={(e) => {
					e.stopPropagation();
					onSelect(occasion);
				}}
				class="py-1.5 rounded-full font-label-sm text-[12px] font-semibold transition-all flex items-center gap-1 cursor-pointer {isSelected
					? 'px-4 bg-primary text-on-primary shadow-sm'
					: 'px-3.5 bg-surface-container text-on-surface hover:bg-primary hover:text-on-primary'}"
			>
				{#if isSelected}
					<span class="material-symbols-outlined text-[14px]">check</span>
					<span>Selected Occasion</span>
				{:else}
					<span>Select</span>
					<span class="material-symbols-outlined text-[14px]">add</span>
				{/if}
			</button>
		</div>
	</div>
</div>

