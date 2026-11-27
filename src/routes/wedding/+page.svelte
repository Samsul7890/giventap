<script lang="ts">
	import type { PageProps } from './$types';
	import WeddingOrnamentView from '#lib/components/WeddingOrnamentView.svelte';

	let { data }: PageProps = $props();

	// svelte-ignore state_referenced_locally
	let recipientName = $state(data.recipientName || 'Clara & Lucas');
	let senderName = $state('Elena');

	$effect(() => {
		if (data.recipientName) recipientName = data.recipientName;
	});

	const formattedTag = $derived(
		data.slug.toUpperCase().startsWith('TK-') ? data.slug.toUpperCase() : `TK-${data.slug.toUpperCase()}`
	);

	// Interactive Ring Entwine Ceremony State
	let ringsJoined = $state(false);
	let isUnlocking = $state(false);
	let isOpened = $state(false);

	// Click-anywhere floating white petals & rings on ceremony card
	let clickPetals = $state<{ id: number; x: number; y: number; emoji: string }[]>([]);
	let nextPetalId = 0;

	function handleBgClick(e: MouseEvent) {
		if ((e.target as HTMLElement).closest('button')) return;
		const emojis = ['🕊️', '💍', '🤍', '🌸', '✨'];
		const id = nextPetalId++;
		clickPetals = [
			...clickPetals,
			{ id, x: e.clientX, y: e.clientY, emoji: emojis[Math.floor(Math.random() * emojis.length)] }
		];
		setTimeout(() => {
			clickPetals = clickPetals.filter((p) => p.id !== id);
		}, 900);
	}

	// Wedding Harp & Celesta Synthesizer (Web Audio API)
	let isMusicPlaying = $state(false);
	let currentTrackIndex = $state(0);
	let synthCtx: AudioContext | null = null;
	let synthTimer: number | null = null;

	const TRACKS = [
		{
			title: 'Canon in D (Celesta Harp)',
			artist: 'Altar Strings',
			notes: [
				[587.33, 0.55], [440.00, 0.55], [493.88, 0.55], [369.99, 0.55],
				[392.00, 0.55], [293.66, 0.55], [392.00, 0.55], [440.00, 0.85],
				[587.33, 0.55], [523.25, 0.55], [493.88, 0.55], [440.00, 0.55],
				[392.00, 0.55], [440.00, 0.55], [587.33, 1.0]
			] as [number, number][]
		},
		{
			title: 'A Thousand Years',
			artist: 'Gardenia Quartet',
			notes: [
				[329.63, 0.5], [392.00, 0.5], [493.88, 0.5], [523.25, 0.95],
				[493.88, 0.5], [440.00, 0.5], [392.00, 0.5], [349.23, 0.95],
				[329.63, 0.5], [293.66, 0.5], [329.63, 0.5], [392.00, 1.1]
			] as [number, number][]
		},
		{
			title: 'Golden Vows Waltz',
			artist: 'Champagne Orchestra',
			notes: [
				[392.00, 0.45], [440.00, 0.45], [493.88, 0.45], [587.33, 0.85],
				[523.25, 0.45], [493.88, 0.45], [440.00, 0.85],
				[392.00, 0.45], [493.88, 0.45], [587.33, 1.0]
			] as [number, number][]
		}
	];

	function playWeddingSynth() {
		try {
			if (synthTimer) {
				clearTimeout(synthTimer);
				synthTimer = null;
			}
			if (!synthCtx || synthCtx.state === 'closed') {
				const AudioContextClass =
					window.AudioContext ||
					(window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
				synthCtx = new AudioContextClass();
			}
			if (synthCtx.state === 'suspended') {
				synthCtx.resume();
			}

			const activeNotes = TRACKS[currentTrackIndex]?.notes ?? TRACKS[0].notes;
			let startTime = synthCtx.currentTime + 0.08;
			activeNotes.forEach(([freq, dur]) => {
				if (!synthCtx) return;
				const osc = synthCtx.createOscillator();
				const gain = synthCtx.createGain();

				osc.type = 'sine';
				osc.frequency.setValueAtTime(freq, startTime);

				gain.gain.setValueAtTime(0, startTime);
				gain.gain.linearRampToValueAtTime(0.13, startTime + 0.03);
				gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);

				osc.connect(gain);
				gain.connect(synthCtx.destination);

				osc.start(startTime);
				osc.stop(startTime + dur);

				startTime += dur + 0.07;
			});

			const totalDur = startTime - synthCtx.currentTime;
			synthTimer = window.setTimeout(() => {
				if (isMusicPlaying) {
					playWeddingSynth();
				}
			}, totalDur * 1000);
		} catch {
			// Ignore if AudioContext is blocked
		}
	}

	function stopWeddingSynth() {
		if (synthTimer) {
			clearTimeout(synthTimer);
			synthTimer = null;
		}
		if (synthCtx && synthCtx.state !== 'closed') {
			try {
				synthCtx.suspend();
			} catch {}
		}
	}

	function toggleMusic() {
		if (isMusicPlaying) {
			isMusicPlaying = false;
			stopWeddingSynth();
		} else {
			isMusicPlaying = true;
			playWeddingSynth();
		}
	}

	function nextTrack() {
		currentTrackIndex = (currentTrackIndex + 1) % TRACKS.length;
		isMusicPlaying = true;
		playWeddingSynth();
	}

	// Pearl & Champagne Gold Confetti
	let confettiCanvas: HTMLCanvasElement | null = $state(null);

	function triggerWeddingConfetti() {
		if (!confettiCanvas) return;
		const ctx = confettiCanvas.getContext('2d');
		if (!ctx) return;
		const W = (confettiCanvas.width = window.innerWidth);
		const H = (confettiCanvas.height = window.innerHeight);
		const colors = ['#b68b4c', '#e5cc99', '#ffffff', '#f5e1e0', '#d4af37', '#a3c1ad'];
		const P: { x: number; y: number; s: number; c: string; vx: number; vy: number; t: number; ti: number }[] = [];
		for (let i = 0; i < 120; i++) {
			P.push({
				x: W / 2,
				y: H * 0.45,
				s: Math.random() * 8 + 4,
				c: colors[Math.floor(Math.random() * colors.length)],
				vx: (Math.random() - 0.5) * 16,
				vy: (Math.random() - 0.85) * 18,
				t: 0,
				ti: Math.random() * 0.08 + 0.04
			});
		}
		let alpha = 1;
		(function draw() {
			if (!ctx) return;
			ctx.clearRect(0, 0, W, H);
			alpha -= 0.006;
			if (alpha <= 0) {
				ctx.clearRect(0, 0, W, H);
				return;
			}
			ctx.globalAlpha = Math.max(0, alpha);
			for (const p of P) {
				p.x += p.vx;
				p.y += p.vy;
				p.vy += 0.3;
				p.vx *= 0.98;
				p.t += p.ti;
				ctx.fillStyle = p.c;
				ctx.beginPath();
				ctx.ellipse(p.x, p.y, p.s, p.s / 2, Math.sin(p.t) * 0.8, 0, Math.PI * 2);
				ctx.fill();
			}
			requestAnimationFrame(draw);
		})();
	}

	function handleJoinRings() {
		ringsJoined = !ringsJoined;
		if (ringsJoined && !isMusicPlaying) {
			isMusicPlaying = true;
			playWeddingSynth();
		}
	}

	function handleOpenWedding() {
		if (isUnlocking || isOpened) return;
		ringsJoined = true;
		isUnlocking = true;
		triggerWeddingConfetti();

		if (!isMusicPlaying) {
			isMusicPlaying = true;
			playWeddingSynth();
		}

		setTimeout(() => {
			isOpened = true;
			isUnlocking = false;
			triggerWeddingConfetti();
			if (typeof window !== 'undefined') {
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}
		}, 650);
	}

	function handleReplayIntro() {
		isOpened = false;
		ringsJoined = false;
		isUnlocking = false;
	}
</script>

<svelte:head>
	<title>
		{isOpened
			? `Happy Wedding, ${recipientName}! 💍 — Tap & Keep`
			: `Kado Pernikahan untuk ${recipientName} 💍 — Tap & Keep`}
	</title>
	<meta
		name="description"
		content="Kado ucapan pernikahan digital interaktif dari {senderName} untuk {recipientName} di Tap & Keep."
	/>
</svelte:head>

<canvas bind:this={confettiCanvas} class="fixed inset-0 pointer-events-none z-50 w-full h-full"></canvas>

{#if !isOpened}
	{#each clickPetals as petal (petal.id)}
		<span
			class="fixed pointer-events-none z-50 text-2xl animate-[floatPetal_0.9s_ease-out_forwards]"
			style="left: {petal.x}px; top: {petal.y}px;"
			aria-hidden="true"
		>
			{petal.emoji}
		</span>
	{/each}

	<!-- ===== INTERACTIVE RING ENTWINE & WAX SEAL CEREMONY ===== -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		onclick={handleBgClick}
		class="min-h-screen w-full bg-gradient-to-b from-[#fdfaf4] via-[#f9f3e8] to-[#f4ecde] text-[#2b241d] flex flex-col items-center justify-center py-10 px-4 select-none relative overflow-hidden"
	>
		<!-- Soft Pearl Glows -->
		<div class="absolute -top-32 -left-24 w-96 h-96 rounded-full bg-[#e9d5b0]/45 blur-[120px] pointer-events-none" aria-hidden="true"></div>
		<div class="absolute -bottom-32 -right-24 w-96 h-96 rounded-full bg-[#ebd5d2]/45 blur-[120px] pointer-events-none" aria-hidden="true"></div>

		<div class="relative w-full max-w-xl bg-white/90 backdrop-blur-2xl rounded-3xl p-8 sm:p-12 shadow-[0_24px_64px_-12px_rgba(140,108,62,0.2)] border border-[#e8dcc6] text-center overflow-hidden">
			<!-- Music Toggle -->
			<button
				type="button"
				onclick={toggleMusic}
				class="absolute top-4 right-4 z-30 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fbf5e9] hover:bg-[#f3e7d3] text-[#8a6328] text-xs font-semibold transition-colors cursor-pointer border border-[#e5d0a8]"
			>
				<span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">
					{isMusicPlaying ? 'music_note' : 'music_off'}
				</span>
				<span>{isMusicPlaying ? 'Music On' : 'Play Harp'}</span>
			</button>

			<!-- Edition Pill -->
			<div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fbf5e9] border border-[#e2cfa9] text-[#7c5922] text-xs font-bold uppercase tracking-wider mb-6">
				<span class="material-symbols-outlined text-[15px] text-[#b68b4c]" style="font-variation-settings: 'FILL' 1;">redeem</span>
				<span>Kado Pernikahan dari {senderName} · #{formattedTag}</span>
			</div>

			<!-- Interactive Two Entwined Gold Rings SVG -->
			<div class="relative flex justify-center mb-4">
				<button
					type="button"
					onclick={handleJoinRings}
					title="Ketuk untuk menyatukan cincin pernikahan"
					class="relative w-52 h-40 flex items-center justify-center cursor-pointer focus:outline-none transition-transform duration-500 {isUnlocking ? 'scale-110 opacity-0' : 'hover:scale-105'}"
				>
					<svg viewBox="0 0 240 160" class="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Interactive Wedding Rings">
						<!-- Soft silk pillow shadow -->
						<ellipse cx="120" cy="138" rx="76" ry="12" fill="#c29b61" fill-opacity="0.16" />

						<!-- Left Ring -->
						<g class="transition-transform duration-700 ease-out" style="transform: translateX({ringsJoined ? '20px' : '0px'});">
							<circle cx="82" cy="82" r="38" stroke="url(#goldRingGrad1)" stroke-width="11" />
							<circle cx="82" cy="82" r="38" stroke="white" stroke-opacity="0.35" stroke-width="2" />
						</g>

						<!-- Right Ring (with Diamond) -->
						<g class="transition-transform duration-700 ease-out" style="transform: translateX({ringsJoined ? '-20px' : '0px'});">
							<circle cx="158" cy="82" r="38" stroke="url(#goldRingGrad2)" stroke-width="11" />
							<circle cx="158" cy="82" r="38" stroke="white" stroke-opacity="0.35" stroke-width="2" />
							<!-- Diamond gem -->
							<polygon points="158,30 170,42 158,52 146,42" fill="#fffbeb" stroke="#b68b4c" stroke-width="2" />
						</g>

						<!-- Center sparkle when joined -->
						{#if ringsJoined}
							<g class="animate-pulse">
								<path d="M120 18 L123 28 L133 31 L123 34 L120 44 L117 34 L107 31 L117 28 Z" fill="#d4af37" />
							</g>
						{/if}

						<defs>
							<linearGradient id="goldRingGrad1" x1="44" y1="44" x2="120" y2="120" gradientUnits="userSpaceOnUse">
								<stop stop-color="#e5cc99" />
								<stop offset="0.5" stop-color="#b68b4c" />
								<stop offset="1" stop-color="#8a6328" />
							</linearGradient>
							<linearGradient id="goldRingGrad2" x1="120" y1="44" x2="196" y2="120" gradientUnits="userSpaceOnUse">
								<stop stop-color="#f3e1b8" />
								<stop offset="0.5" stop-color="#c29b61" />
								<stop offset="1" stop-color="#8a6328" />
							</linearGradient>
						</defs>
					</svg>
				</button>
			</div>

			<!-- Ring Status Hint -->
			<div class="mb-4">
				<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold {ringsJoined ? 'bg-[#e8f2ec] text-[#2f5e48] border border-[#c7dccb]' : 'bg-[#faf6ee] text-[#8c7b67] border border-[#e6d7be]'}">
					<span class="material-symbols-outlined text-[14px]">{ringsJoined ? 'favorite' : 'touch_app'}</span>
					{ringsJoined ? 'Dua Cincin Telah Menyatu 💍✨' : 'Ketuk cincin untuk menyatukan janji suci'}
				</span>
			</div>

			<!-- Heading -->
			<h1 class="font-headline-lg text-3xl sm:text-5xl text-[#2b241d] leading-tight mb-3">
				Untuk Mempelai Berbahagia, <span class="italic text-[#9c7232]">{recipientName}</span> 🕊️
			</h1>
			<p class="text-[#665949] text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
				{senderName} telah menyegel kado ucapan pernikahan spesial untuk kalian berdua. Satukan cincin di atas, lalu buka kadonya!
			</p>

			<!-- CTA Button -->
			<button
				type="button"
				onclick={handleOpenWedding}
				class="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#b68b4c] to-[#9c7232] text-white font-bold text-base shadow-[0_14px_34px_-6px_rgba(156,114,50,0.45)] hover:scale-105 active:scale-95 transition-all cursor-pointer inline-flex items-center justify-center gap-2.5"
			>
				<span>🎁</span>
				<span>Buka Kado Pernikahan</span>
			</button>

			<!-- Footer Tag Info -->
			<p class="mt-8 text-xs text-[#8c7b67] font-medium flex items-center justify-center gap-1.5">
				<span class="material-symbols-outlined text-[14px] text-[#3e6b58]" style="font-variation-settings: 'FILL' 1;">verified</span>
				<span>NFC Tag #{formattedTag} · Sealed Keepsake by Tap &amp; Keep™</span>
			</p>
		</div>
	</div>
{:else}
	<WeddingOrnamentView
		{recipientName}
		{senderName}
		{formattedTag}
		{isMusicPlaying}
		{currentTrackIndex}
		tracks={TRACKS}
		onToggleMusic={toggleMusic}
		onNextTrack={nextTrack}
		onReplayIntro={handleReplayIntro}
	/>
{/if}

<style>
	@keyframes floatPetal {
		0% {
			transform: translate(-50%, -50%) scale(0.8);
			opacity: 1;
		}
		100% {
			transform: translate(-50%, -125%) scale(1.5);
			opacity: 0;
		}
	}
</style>
