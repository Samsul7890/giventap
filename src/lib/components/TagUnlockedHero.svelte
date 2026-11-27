<script lang="ts">
	interface Props {
		tagSlug: string;
		chipModel?: string;
		isExisting?: boolean;
		templateTitle?: string;
		status?: string;
	}

	let {
		tagSlug,
		chipModel = 'Micro-chip NTAG213',
		isExisting = false,
		templateTitle,
		status
	}: Props = $props();

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
			class="absolute -top-1 -right-1 w-6 h-6 rounded-full {isExisting ? 'bg-primary' : 'bg-tertiary'} text-white flex items-center justify-center shadow-md animate-bounce"
		>
			<span class="material-symbols-outlined text-[13px] font-bold">
				{isExisting ? 'bookmark' : 'check'}
			</span>
		</div>
	</div>

	<!-- Hardware & Tag Status Verification Pill -->
	<div
		class="inline-flex items-center gap-space-xs px-3.5 py-1 rounded-full {isExisting ? 'bg-primary/10 text-primary border-primary/20' : 'bg-primary-fixed text-on-primary-fixed border-primary-fixed-dim/40'} font-label-md text-label-md shadow-xs mb-3 border"
	>
		<span class="material-symbols-outlined text-[15px] {isExisting ? 'text-primary' : 'text-primary'}" style="font-variation-settings: 'FILL' 1;">
			{isExisting ? 'verified' : 'new_releases'}
		</span>
		<span class="font-bold">Tag #{formattedTag}</span>
		<span class="opacity-40">•</span>
		{#if isExisting && templateTitle}
			<span class="font-semibold text-primary">Template: {templateTitle}</span>
			<span class="opacity-40">•</span>
		{:else if !isExisting}
			<span class="font-semibold text-tertiary">New Tag</span>
			<span class="opacity-40">•</span>
		{/if}
		<span class="font-body-sm text-body-sm font-semibold opacity-90">{chipModel}</span>
	</div>

	<!-- Editorial Serifs Headline -->
	<h1 class="font-headline-lg text-headline-lg text-on-surface max-w-2xl leading-tight mb-2">
		{#if isExisting}
			Template Selected for Tag #{formattedTag}
		{:else}
			You’ve unlocked a new NFC gift tag!
		{/if}
	</h1>

	<!-- Editorial Lead Subtitle -->
	<p class="font-body-md text-body-md text-on-surface-variant max-w-xl mx-auto leading-relaxed">
		{#if isExisting}
			This tag is configured with the <strong class="text-on-surface font-semibold">{templateTitle || 'selected'}</strong> template. You can proceed directly or choose a new occasion below.
		{:else}
			Turn this physical tag into an unforgettable digital keepsake. Choose an occasion template to set up your new tag.
		{/if}
	</p>

	<!-- Quick Tag Simulation Links for easy testing -->
	<div class="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-label-sm font-label-sm text-on-surface-variant">
		<span class="text-xs opacity-60 mr-1">Simulate Tag URL:</span>
		<a
			href="/?tag=TK-8492"
			class="px-2.5 py-0.5 rounded-full transition-colors {formattedTag === 'TK-8492' ? 'bg-primary text-on-primary font-semibold' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'}"
		>
			TK-8492 (Valentine)
		</a>
		<a
			href="/?tag=TK-1001"
			class="px-2.5 py-0.5 rounded-full transition-colors {formattedTag === 'TK-1001' ? 'bg-primary text-on-primary font-semibold' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'}"
		>
			TK-1001 (Birthday)
		</a>
		<a
			href="/?tag=TK-2002"
			class="px-2.5 py-0.5 rounded-full transition-colors {formattedTag === 'TK-2002' ? 'bg-primary text-on-primary font-semibold' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'}"
		>
			TK-2002 (Anniversary)
		</a>
		<a
			href="/?tag=TK-9999"
			class="px-2.5 py-0.5 rounded-full transition-colors {formattedTag === 'TK-9999' ? 'bg-primary text-on-primary font-semibold' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'}"
		>
			TK-9999 (New Tag)
		</a>
		<a
			href="/birthday?tag=alisa"
			class="px-2.5 py-0.5 rounded-full transition-colors bg-amber-500/10 text-amber-900 font-semibold border border-amber-500/20 hover:bg-amber-500/20 flex items-center gap-1"
		>
			<span>🎁 Kado Alisa (/birthday?tag=alisa)</span>
		</a>
		<a
			href="/"
			class="px-2.5 py-0.5 rounded-full transition-colors {tagSlug === 'TK-NEW' ? 'bg-primary text-on-primary font-semibold' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'}"
		>
			/ (No Tag)
		</a>
	</div>
</div>
