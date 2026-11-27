<script lang="ts">
	import './layout.css';
	import { page } from '$app/state';
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';
	import AmbientBackground from '#lib/components/AmbientBackground.svelte';
	import Header from '#lib/components/Header.svelte';
	import Footer from '#lib/components/Footer.svelte';

	let { children }: LayoutProps = $props();

	const currentSlug = $derived(page.params.slug || 'TK-8492');
	const currentStep = $derived(
		page.url.pathname.includes('/customize') ? 2 : page.url.pathname.includes('/view') ? 3 : 1
	);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- Global Ambient Glow Backdrop -->
<AmbientBackground />

<!-- Global Header Navigation -->
<Header tagSlug={currentSlug} {currentStep} />

<!-- Main Application Shell -->
<main class="w-full pt-20 max-w-7xl mx-auto px-margin md:px-margin-desktop min-h-[calc(100vh-140px)]">
	{@render children()}
</main>

<!-- Global Footer -->
<Footer />
