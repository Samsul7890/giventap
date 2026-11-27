<script lang="ts">
	interface Props {
		tagSlug?: string;
		currentStep?: number;
		statusText?: string;
	}

	let {
		tagSlug = 'TK-8492',
		currentStep = 1,
		statusText = 'First Tap Detected'
	}: Props = $props();

	const formattedTag = $derived(
		tagSlug.toUpperCase().startsWith('TK-') ? tagSlug.toUpperCase() : `TK-${tagSlug.toUpperCase()}`
	);
</script>

<header class="fixed top-0 inset-x-0 z-50 bg-surface/75 backdrop-blur-2xl shadow-[0_4px_20px_-4px_rgba(152,67,76,0.06)] border-b border-outline-variant/20">
	<div class="h-20 max-w-7xl mx-auto px-margin md:px-margin-desktop flex items-center justify-between gap-space-md">
		<!-- Brand & Hardware Chip Identifier -->
		<div class="flex items-center gap-space-md min-w-0 flex-shrink-0">
			<a href={tagSlug ? `/?tag=${encodeURIComponent(tagSlug)}` : '/'} class="flex items-center gap-space-sm group">
				<div class="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-200">
					<span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">contactless</span>
				</div>
				<span class="font-headline-sm text-headline-sm tracking-tight text-primary font-bold hidden sm:inline-block">
					Tap &amp; Keep
				</span>
			</a>

			<div class="hidden xl:flex items-center gap-space-xs px-3 py-1 rounded-full bg-surface-container-high/80 text-on-surface-variant font-label-sm text-label-sm shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
				<span class="w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span>
				<span class="font-semibold text-on-surface">Tag #{formattedTag}</span>
				<span class="opacity-40">•</span>
				<span class="text-tertiary font-medium">{statusText}</span>
			</div>
		</div>

		<!-- Breadcrumb / Workflow Stepper Navigation -->
		<nav
			class="hidden md:flex items-center bg-surface-container-low/70 p-1.5 rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] border border-outline-variant/20"
			aria-label="Workflow Steps"
		>
			<a
				href={tagSlug ? `/?tag=${encodeURIComponent(tagSlug)}` : '/'}
				aria-current={currentStep === 1 ? 'page' : undefined}
				class="px-4 py-1.5 rounded-full transition-all duration-200 text-label-md {currentStep === 1
					? 'bg-surface-container-lowest text-primary font-bold shadow-[0_2px_8px_rgba(152,67,76,0.08)]'
					: 'text-on-surface-variant font-medium hover:text-on-surface hover:bg-surface-container-high'}"
			>
				Step 1 · Occasion
			</a>
			<a
				href={tagSlug ? `/?tag=${encodeURIComponent(tagSlug)}&step=customize` : '/?step=customize'}
				aria-current={currentStep === 2 ? 'page' : undefined}
				class="px-4 py-1.5 rounded-full transition-all duration-200 text-label-md {currentStep === 2
					? 'bg-surface-container-lowest text-primary font-bold shadow-[0_2px_8px_rgba(152,67,76,0.08)]'
					: 'text-on-surface-variant font-medium hover:text-on-surface hover:bg-surface-container-high'}"
			>
				Step 2 · Customize &amp; Lock
			</a>
			<a
				href={tagSlug ? `/?tag=${encodeURIComponent(tagSlug)}&step=view` : '/?step=view'}
				aria-current={currentStep === 3 ? 'page' : undefined}
				class="px-4 py-1.5 rounded-full transition-all duration-200 text-label-md {currentStep === 3
					? 'bg-surface-container-lowest text-primary font-bold shadow-[0_2px_8px_rgba(152,67,76,0.08)]'
					: 'text-on-surface-variant font-medium hover:text-on-surface hover:bg-surface-container-high'}"
			>
				Step 3 · Recipient View
			</a>
		</nav>

		<!-- Right Action Controls -->
		<div class="flex items-center gap-space-sm flex-shrink-0">
			<a
				href="#help"
				class="hidden sm:inline-flex items-center px-3.5 py-1.5 rounded-full bg-surface-container/60 hover:bg-surface-container text-on-surface font-label-md text-label-md transition-all duration-200"
			>
				Help &amp; FAQ
			</a>
			<button
				type="button"
				aria-label="User Account"
				class="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-[0_2px_8px_rgba(152,67,76,0.25)] transition-transform hover:scale-105 active:scale-95"
			>
				<span class="material-symbols-outlined text-on-primary text-[18px]">person</span>
			</button>
		</div>
	</div>
</header>

