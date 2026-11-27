<script lang="ts">
	interface Props {
		tagSlug: string;
		chipModel?: string;
	}

	let { tagSlug, chipModel = 'Micro-chip NTAG213' }: Props = $props();

	const formattedTag = $derived(
		tagSlug.toUpperCase().startsWith('TK-') ? tagSlug.toUpperCase() : `TK-${tagSlug.toUpperCase()}`
	);
</script>

<div class="flex flex-col items-center text-center">
	<!-- Tactile Physical Tag Target Ring with Live Wave Animations -->
	<div class="relative flex items-center justify-center mb-4">
		<div class="absolute w-24 h-24 rounded-full bg-primary-fixed opacity-40 animate-ping"></div>
		<div class="absolute w-20 h-20 rounded-full bg-primary-container/20 animate-pulse"></div>
		<div
			class="relative w-14 h-14 rounded-full bg-surface-container-lowest shadow-[0_8px_20px_rgba(152,67,76,0.18)] flex items-center justify-center text-primary"
		>
			<span class="material-symbols-outlined text-[28px]" style="font-variation-settings: 'FILL' 1;">
				contactless
			</span>
		</div>
		<div
			class="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center shadow-md animate-bounce"
		>
			<span class="material-symbols-outlined text-[13px] font-bold">check</span>
		</div>
	</div>

	<!-- Hardware Verification Pill -->
	<div
		class="inline-flex items-center gap-space-xs px-3.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-md text-label-md shadow-xs mb-3 border border-primary-fixed-dim/40"
	>
		<span class="material-symbols-outlined text-[15px] text-primary" style="font-variation-settings: 'FILL' 1;">
			verified
		</span>
		<span class="font-bold">Tag ID #{formattedTag} Unlocked</span>
		<span class="opacity-40">•</span>
		<span class="font-body-sm text-body-sm font-semibold opacity-90">{chipModel}</span>
	</div>

	<!-- Editorial Serifs Headline -->
	<h1 class="font-headline-lg text-headline-lg text-on-surface max-w-2xl leading-tight mb-2">
		You’ve unlocked a new NFC gift tag!
	</h1>

	<!-- Editorial Lead Subtitle -->
	<p class="font-body-md text-body-md text-on-surface-variant max-w-xl mx-auto leading-relaxed">
		Turn this physical tag into an unforgettable digital keepsake. Choose an occasion to start tailoring the experience.
	</p>
</div>

