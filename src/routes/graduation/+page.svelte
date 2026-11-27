<script lang="ts">
	import type { PageProps } from './$types';
	import GraduationOrnamentView from '#lib/components/GraduationOrnamentView.svelte';

	let { data }: PageProps = $props();

	// svelte-ignore state_referenced_locally
	let recipientName = $state(data.recipientName || 'David');
	let senderName = $state('Mama, Papa & Keluarga 🌟');
	let gradYear = $state(2026);

	$effect(() => {
		if (data.recipientName) recipientName = data.recipientName;
	});

	const formattedTag = $derived(
		data.slug.toUpperCase().startsWith('TK-') ? data.slug.toUpperCase() : `TK-${data.slug.toUpperCase()}`
	);

	// Unique Graduation Ceremony Intro State (Tassel Turn -> Cap Toss)
	let isTasselTurned = $state(false);
	let isCapLaunching = $state(false);
	let isOpened = $state(false);

	// Click-anywhere celebratory sparkles on intro screen
	let clickSparkles = $state<{ id: number; x: number; y: number; emoji: string }[]>([]);
	let nextSparkleId = 0;

	function handleBgClick(e: MouseEvent) {
		if ((e.target as HTMLElement).closest('button')) return;
		const emojis = ['🎓', '⭐', '✨', '📜'];
		const id = nextSparkleId++;
		clickSparkles = [
			...clickSparkles,
			{ id, x: e.clientX, y: e.clientY, emoji: emojis[Math.floor(Math.random() * emojis.length)] }
		];
		setTimeout(() => {
			clickSparkles = clickSparkles.filter((s) => s.id !== id);
		}, 900);
	}

	// Web Audio Graduation Fanfare & Soundtrack Synthesizer
	let isMusicPlaying = $state(false);
	let currentTrackIndex = $state(0);
	let synthCtx: AudioContext | null = null;
	let synthTimer: number | null = null;

	const TRACKS = [
		{
			title: 'Pomp & Triumph Chimes',
			artist: 'Commencement Orchestra',
			notes: [
				[261.63, 0.45], [329.63, 0.45], [392.00, 0.45], [523.25, 0.9],
				[493.88, 0.4], [440.00, 0.4], [392.00, 0.9],
				[349.23, 0.45], [392.00, 0.45], [440.00, 0.45], [523.25, 0.9],
				[587.33, 0.5], [523.25, 1.1]
			] as [number, number][]
		},
		{
			title: 'Midnight Library Lo-Fi',
			artist: 'Late Night Thesis',
			notes: [
				[293.66, 0.55], [349.23, 0.55], [440.00, 0.55], [523.25, 0.95],
				[440.00, 0.55], [392.00, 0.55], [349.23, 0.95],
				[329.63, 0.55], [392.00, 0.55], [440.00, 0.55], [392.00, 1.1]
			] as [number, number][]
		},
		{
			title: 'Golden Horizon',
			artist: 'New Chapter Waltz',
			notes: [
				[392.00, 0.4], [440.00, 0.4], [493.88, 0.4], [587.33, 0.85],
				[523.25, 0.4], [493.88, 0.4], [440.00, 0.85],
				[392.00, 0.4], [440.00, 0.4], [523.25, 0.4], [659.25, 1.1]
			] as [number, number][]
		}
	];

	function playGradSynth() {
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

				osc.type = 'triangle';
				osc.frequency.setValueAtTime(freq, startTime);

				gain.gain.setValueAtTime(0, startTime);
				gain.gain.linearRampToValueAtTime(0.14, startTime + 0.03);
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
					playGradSynth();
				}
			}, totalDur * 1000);
		} catch {
			// Ignore if AudioContext is blocked
		}
	}

	function stopGradSynth() {
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
			stopGradSynth();
		} else {
			isMusicPlaying = true;
			playGradSynth();
		}
	}

	function nextTrack() {
		currentTrackIndex = (currentTrackIndex + 1) % TRACKS.length;
		isMusicPlaying = true;
		playGradSynth();
	}

	// Gold & Emerald Confetti
	let confettiCanvas: HTMLCanvasElement | null = $state(null);

	function triggerGradConfetti() {
		if (!confettiCanvas) return;
		const ctx = confettiCanvas.getContext('2d');
		if (!ctx) return;
		const W = (confettiCanvas.width = window.innerWidth);
		const H = (confettiCanvas.height = window.innerHeight);
		const colors = ['#f5c563', '#fbbf24', '#34d399', '#10b981', '#ffffff', '#fde68a'];
		const P: { x: number; y: number; s: number; c: string; vx: number; vy: number; t: number; ti: number }[] = [];
		for (let i = 0; i < 120; i++) {
			P.push({
				x: W / 2,
				y: H * 0.45,
				s: Math.random() * 8 + 4,
				c: colors[Math.floor(Math.random() * colors.length)],
				vx: (Math.random() - 0.5) * 18,
				vy: (Math.random() - 0.85) * 20,
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
				p.vy += 0.34;
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

	function handleTurnTassel() {
		isTasselTurned = !isTasselTurned;
		if (!isMusicPlaying) {
			isMusicPlaying = true;
			playGradSynth();
		}
	}

	function handleLaunchCap() {
		if (isCapLaunching || isOpened) return;
		isTasselTurned = true;
		isCapLaunching = true;
		triggerGradConfetti();

		if (!isMusicPlaying) {
			isMusicPlaying = true;
			playGradSynth();
		}

		setTimeout(() => {
			isOpened = true;
			isCapLaunching = false;
			triggerGradConfetti();
			if (typeof window !== 'undefined') {
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}
		}, 680);
	}

	function handleReplayIntro() {
		isOpened = false;
		isCapLaunching = false;
		isTasselTurned = false;
	}
</script>

<svelte:head>
	<title>
		{isOpened
			? `Selamat Wisuda, ${recipientName}! 🎓 — Tap & Keep`
			: `Upacara Wisuda untuk ${recipientName} 🎓 — Tap & Keep`}
	</title>
	<meta
		name="description"
		content="Interactive Graduation Keepsake & Commencement Vault for {recipientName} on Tap & Keep."
	/>
</svelte:head>

<!-- Confetti Canvas -->
<canvas bind:this={confettiCanvas} class="fixed inset-0 pointer-events-none z-50 w-full h-full"></canvas>

{#if !isOpened}
	<!-- Click-anywhere floating graduation icons -->
	{#each clickSparkles as item (item.id)}
		<span
			class="fixed pointer-events-none z-50 text-2xl animate-[floatSparkle_0.9s_ease-out_forwards]"
			style="left: {item.x}px; top: {item.y}px;"
			aria-hidden="true"
		>
			{item.emoji}
		</span>
	{/each}

	<!-- ===== UNIQUE GRADUATION CAP TOSS & TASSEL CEREMONY ===== -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		onclick={handleBgClick}
		class="min-h-screen w-full bg-gradient-to-b from-[#081216] via-[#0c211c] to-[#060d10] text-white flex flex-col items-center justify-center py-10 px-4 select-none relative overflow-hidden"
	>
		<!-- Ambient Glows -->
		<div class="absolute -top-32 -left-24 w-96 h-96 rounded-full bg-emerald-500/15 blur-[130px] pointer-events-none" aria-hidden="true"></div>
		<div class="absolute -bottom-32 -right-24 w-96 h-96 rounded-full bg-amber-400/15 blur-[130px] pointer-events-none" aria-hidden="true"></div>

		<div class="relative w-full max-w-xl bg-white/5 backdrop-blur-2xl rounded-3xl p-8 sm:p-12 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.6)] border border-white/15 text-center overflow-hidden">
			<!-- Music Toggle -->
			<button
				type="button"
				onclick={toggleMusic}
				class="absolute top-4 right-4 z-30 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-amber-300 text-xs font-semibold transition-colors cursor-pointer border border-white/10"
			>
				<span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">
					{isMusicPlaying ? 'music_note' : 'music_off'}
				</span>
				<span>{isMusicPlaying ? 'Music On' : 'Play Music'}</span>
			</button>

			<!-- Edition Pill -->
			<div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/15 border border-amber-300/30 text-amber-200 text-xs font-bold uppercase tracking-wider mb-6">
				<span class="material-symbols-outlined text-[15px] text-amber-300" style="font-variation-settings: 'FILL' 1;">school</span>
				<span>Class of {gradYear} · #{formattedTag}</span>
			</div>

			<!-- Interactive Graduation Mortarboard Cap SVG -->
			<div class="relative flex justify-center mb-5">
				<button
					type="button"
					onclick={handleTurnTassel}
					title="Ketuk untuk memindahkan rumbai toga"
					class="group relative w-48 h-44 flex items-center justify-center cursor-pointer focus:outline-none transition-all duration-700 {isCapLaunching
						? '-translate-y-64 rotate-12 scale-110 opacity-0'
						: 'animate-[gentleBob_3.2s_ease-in-out_infinite] hover:scale-105'}"
				>
					<svg viewBox="0 0 240 200" class="w-full h-full drop-shadow-[0_16px_30px_rgba(0,0,0,0.5)]" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Interactive Graduation Cap">
						<!-- Base cap skull -->
						<path d="M55 95 C55 135, 185 135, 185 95 L175 72 L65 72 Z" fill="#132a24" stroke="#34d399" stroke-opacity="0.35" stroke-width="2" />
						<!-- Gold trim on base -->
						<path d="M62 104 C85 122, 155 122, 178 104" stroke="#f5c563" stroke-width="3" stroke-linecap="round" opacity="0.7" />
						<!-- Mortarboard Diamond Top -->
						<polygon points="120,24 224,68 120,108 16,68" fill="#1b3a32" stroke="#f5c563" stroke-width="2.5" stroke-linejoin="round" />
						<!-- Inner diamond highlight -->
						<polygon points="120,34 202,68 120,98 38,68" fill="#ffffff" fill-opacity="0.06" />
						<!-- Center Gold Button -->
						<circle cx="120" cy="68" r="7" fill="#f5c563" />
						<circle cx="120" cy="68" r="3" fill="#fffbeb" />

						<!-- Interactive Animated Tassel (Flips Left <-> Right!) -->
						<g
							class="transition-transform duration-500 origin-[120px_68px]"
							style="transform: {isTasselTurned ? 'scaleX(-1)' : 'scaleX(1)'};"
						>
							<path d="M120 68 Q70 76 52 108" stroke="#f5c563" stroke-width="4" stroke-linecap="round" fill="none" />
							<rect x="46" y="106" width="12" height="10" rx="3" fill="#e8b540" />
							<path d="M48 116 L43 142 M52 116 L52 144 M56 116 L61 142" stroke="#fbbf24" stroke-width="2.8" stroke-linecap="round" />
						</g>

						<!-- Sparkle stars -->
						<circle cx="38" cy="40" r="2.5" fill="#fde68a" opacity="0.8" />
						<circle cx="204" cy="44" r="3" fill="#34d399" opacity="0.7" />
						<circle cx="195" cy="112" r="2" fill="#f5c563" opacity="0.8" />
					</svg>
				</button>
			</div>

			<!-- Step Indicator Pill -->
			<div class="mb-4">
				<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide {isTasselTurned ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-white/10 text-slate-300 border border-white/10'}">
					<span class="material-symbols-outlined text-[14px]">{isTasselTurned ? 'check_circle' : 'touch_app'}</span>
					{isTasselTurned ? 'Rumbai Toga Dipindahkan • Resmi Lulus!' : 'Tips: Ketuk topi untuk memindahkan rumbai toga'}
				</span>
			</div>

			<!-- Heading -->
			<h1 class="font-headline-lg text-3xl sm:text-5xl font-bold text-white leading-tight mb-3">
				Selamat Kelulusan, <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-100 italic">{recipientName}</span>! 🎓
			</h1>
			<p class="text-emerald-100/80 text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
				{senderName} telah menyegel kapsul kehormatan wisudamu. Lempar topi togamu ke langit untuk membukanya!
			</p>

			<!-- Primary Launch CTA -->
			<div class="flex flex-col sm:flex-row items-center justify-center gap-3">
				<button
					type="button"
					onclick={handleLaunchCap}
					class="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-300 text-slate-950 font-extrabold text-base shadow-[0_14px_36px_-6px_rgba(245,197,99,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer inline-flex items-center justify-center gap-2.5"
				>
					<span>🎓</span>
					<span>Lempar Toga &amp; Buka Kapsul!</span>
				</button>
			</div>

			<!-- Footer Tag Info -->
			<p class="mt-8 text-xs text-emerald-200/60 font-medium flex items-center justify-center gap-1.5">
				<span class="material-symbols-outlined text-[14px] text-emerald-400" style="font-variation-settings: 'FILL' 1;">verified</span>
				<span>NFC Tag #{formattedTag} · Sealed Keepsake by Tap &amp; Keep™</span>
			</p>
		</div>
	</div>
{:else}
	<!-- ===== GRADUATION HONOR VAULT VIEW ===== -->
	<GraduationOrnamentView
		{recipientName}
		{senderName}
		{formattedTag}
		{gradYear}
		{isMusicPlaying}
		{currentTrackIndex}
		tracks={TRACKS}
		onToggleMusic={toggleMusic}
		onNextTrack={nextTrack}
		onReplayIntro={handleReplayIntro}
	/>
{/if}

<style>
	@keyframes gentleBob {
		0%, 100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-9px);
		}
	}
	@keyframes floatSparkle {
		0% {
			transform: translate(-50%, -50%) scale(0.8);
			opacity: 1;
		}
		100% {
			transform: translate(-50%, -130%) scale(1.5);
			opacity: 0;
		}
	}
</style>
