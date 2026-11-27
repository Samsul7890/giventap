<script lang="ts">
	import type { OccasionCategory } from '../types/tag';

	interface Props {
		selectedOccasion?: OccasionCategory;
		tagSlug: string;
		stepText?: string;
		onContinue?: () => void;
	}

	let {
		selectedOccasion,
		tagSlug,
		stepText = 'Step 1 of 3',
		onContinue
	}: Props = $props();

	const label = $derived(
		selectedOccasion ? `${selectedOccasion.title} ${selectedOccasion.emoji}` : 'Select an Occasion'
	);
</script>

<aside aria-label="Workflow Actions" class="fixed bottom-4 inset-x-4 max-w-xl mx-auto z-40">
	<div
		class="bg-surface-container-lowest/90 backdrop-blur-2xl p-3 sm:p-4 rounded-3xl shadow-[0_16px_36px_rgba(152,67,76,0.18)] flex items-center justify-between gap-3 border border-outline-variant/30 transition-all duration-300"
	>
		<div class="min-w-0 pl-2">
			<p class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
				{stepText}
			</p>
			<p class="font-headline-sm text-headline-sm text-primary truncate font-bold">
				{label}
			</p>
		</div>

		<a
			href={`/tag/${tagSlug}/customize?occasion=${selectedOccasion?.id ?? 'valentine'}`}
			onclick={(e) => {
				if (onContinue) {
					onContinue();
				}
			}}
			class="inline-flex items-center gap-space-xs px-6 py-3.5 rounded-full bg-primary text-on-primary font-label-lg text-label-lg shadow-[0_8px_20px_-4px_rgba(152,67,76,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-4px_rgba(152,67,76,0.5)] active:scale-95 shrink-0 group cursor-pointer"
		>
			<span>Personalize Message</span>
			<span class="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">
				arrow_forward
			</span>
		</a>
	</div>
</aside>

