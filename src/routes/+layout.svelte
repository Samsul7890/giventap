<script lang="ts">
	import './layout.css';
	import { page } from '$app/state';
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';
	import AmbientBackground from '#lib/components/AmbientBackground.svelte';
	import Header from '#lib/components/Header.svelte';
	import Footer from '#lib/components/Footer.svelte';

	let { children }: LayoutProps = $props();

	const currentSlug = $derived(page.url.searchParams.get('tag') || page.params.slug || 'TK-8492');
	const currentStep = $derived(
		page.url.searchParams.get('step') === 'customize' || page.url.pathname.includes('/customize')
			? 2
			: page.url.searchParams.get('step') === 'view' ||
				page.url.pathname.includes('/view') ||
				page.url.pathname.includes('/birthday') ||
				page.url.pathname.includes('/valentine') ||
				page.url.pathname.includes('/anniversary') ||
				page.url.pathname.includes('/graduation') ||
				page.url.pathname.includes('/wedding') ||
				page.url.pathname.includes('/just-because')
			? 3
			: 1
	);

	const isBirthdayPage = $derived(page.url.pathname.startsWith('/birthday'));
	const isAnniversaryPage = $derived(page.url.pathname.startsWith('/anniversary'));
	const isGraduationPage = $derived(page.url.pathname.startsWith('/graduation'));
	const isWeddingPage = $derived(page.url.pathname.startsWith('/wedding'));
	const isJustBecausePage = $derived(page.url.pathname.startsWith('/just-because'));
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if isBirthdayPage}
	<!-- Birthday: immersive full-screen, no chrome -->
	<main class="w-full min-h-screen bg-[#1a0d10] text-white">
		{@render children()}
	</main>
{:else if isGraduationPage}
	<!-- Graduation: immersive academic emerald & gold full-screen, no chrome -->
	<main class="w-full min-h-screen bg-[#081216] text-white">
		{@render children()}
	</main>
{:else if isWeddingPage}
	<!-- Wedding: immersive Gardenia Pearl & Champagne Gold full-screen, no chrome -->
	<main class="w-full min-h-screen bg-[#fdfaf4] text-[#2b241d]">
		{@render children()}
	</main>
{:else if isJustBecausePage}
	<!-- Just Because: immersive Wildflower Lavender full-screen, no chrome -->
	<main class="w-full min-h-screen bg-[#faf7ff] text-[#282135]">
		{@render children()}
	</main>
{:else if isAnniversaryPage}
	<!-- Anniversary: uses standard app shell with header/footer -->
	<AmbientBackground />
	<Header tagSlug={currentSlug} currentStep={3} />
	<main class="w-full pt-20 max-w-7xl mx-auto px-margin md:px-margin-desktop min-h-[calc(100vh-140px)]">
		{@render children()}
	</main>
	<Footer />
{:else}
	<!-- Normal app shell -->
	<AmbientBackground />
	<Header tagSlug={currentSlug} {currentStep} />
	<main class="w-full pt-20 max-w-7xl mx-auto px-margin md:px-margin-desktop min-h-[calc(100vh-140px)]">
		{@render children()}
	</main>
	<Footer />
{/if}
