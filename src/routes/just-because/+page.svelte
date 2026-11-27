<script lang="ts">
	import type { PageProps } from './$types';
	import JustBecauseOrnamentView from '#lib/components/JustBecauseOrnamentView.svelte';

	let { data }: PageProps = $props();

	// svelte-ignore state_referenced_locally
	let recipientName = $state(data.recipientName || 'Chloe');
	let senderName = $state('Maya');

	$effect(() => {
		if (data.recipientName) recipientName = data.recipientName;
	});

	const formattedTag = $derived(
		data.slug.toUpperCase().startsWith('TK-') ? data.slug.toUpperCase() : `TK-${data.slug.toUpperCase()}`
	);

	// Interactive Wax-Sealed Envelope State
	let isSealBroken = $state(false);
	let isOpening = $state(false);
	let isOpened = $state(false);

	// Click-anywhere floating wildflowers
	let clickFlowers = $state<{ id: number; x: number; y: number; emoji: string }[]>([]);
	let nextFlowerId = 0;

	function handleBgClick(e: MouseEvent) {
		if ((e.target as HTMLElement).closest('button')) return;
		const emojis = ['🌿', '🪻', '💌', '🌻', '☕', '✨'];
		const id = nextFlowerId++;
		clickFlowers = [
			...clickFlowers,
			{ id, x: e.clientX, y: e.clientY, emoji: emojis[Math.floor(Math.random() * emojis.length)] }
		];
		setTimeout(() => {
			clickFlowers = clickFlowers.filter((f) => f.id !== id);
		}, 900);
	}

	// Cozy Lo-Fi & Kalimba Web Audio Synthesizer
	let isMusicPlaying = $state(false);
	let currentTrackIndex = $state(0);
	let synthCtx: AudioContext | null = null;
	let synthTimer: number | null = null;

	const TRACKS = [
		{
			title: 'Sunday Morning Coffee',
			artist: 'Lo-Fi Wildflower',
			notes: [
				[349.23, 0.55], [440.00, 0.55], [523.25, 0.55], [493.88, 0.9],
				[440.00, 0.55], [392.00, 0.55], [349.23, 0.95],
				[329.63, 0.55], [392.00, 0.55], [440.00, 0.55], [392.00, 1.1]
			] as [number, number][]
		},
		{
			title: 'Wildflower Breeze',
			artist: 'Acoustic Kalimba',
			notes: [
				[293.66, 0.45], [349.23, 0.45], [440.00, 0.45], [523.25, 0.85],
				[440.00, 0.45], [349.23, 0.45], [329.63, 0.85],
				[261.63, 0.45], [329.63, 0.45], [392.00, 0.45], [349.23, 1.0]
			] as [number, number][]
		},
		{
			title: 'Rainy Window Notes',
			artist: 'Cozy Piano',
			notes: [
				[261.63, 0.6], [329.63, 0.6], [392.00, 0.6], [493.88, 1.0],
				[440.00, 0.6], [392.00, 0.6], [329.63, 1.0],
				[293.66, 0.6], [349.23, 0.6], [392.00, 1.1]
			] as [number, number][]
		}
	];

	function playCozySynth() {
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
				gain.gain.linearRampToValueAtTime(0.13, startTime + 0.04);
				gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);

				osc.connect(gain);
				gain.connect(synthCtx.destination);

				osc.start(startTime);
				osc.stop(startTime + dur);

				startTime += dur + 0.08;
			});

			const totalDur = startTime - synthCtx.currentTime;
			synthTimer = window.setTimeout(() => {
				if (isMusicPlaying) {
					playCozySynth();
				}
			}, totalDur * 1000);
		} catch {
			// Ignore if AudioContext is blocked
		}
	}

	function stopCozySynth() {
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
			stopCozySynth();
		} else {
			isMusicPlaying = true;
			playCozySynth();
		}
	}

	function nextTrack() {
		currentTrackIndex = (currentTrackIndex + 1) % TRACKS.length;
		isMusicPlaying = true;
		playCozySynth();
	}

	// Lavender & Sage Confetti
	let confettiCanvas: HTMLCanvasElement | null = $state(null);

	function triggerCozyConfetti() {
		if (!confettiCanvas) return;
		const ctx = confettiCanvas.getContext('2d');
		if (!ctx) return;
		const W = (confettiCanvas.width = window.innerWidth);
		const H = (confettiCanvas.height = window.innerHeight);
		const colors = ['#685588', '#d9c2fd', '#46a488', '#fde68a', '#ffffff', '#a795d1'];
		const P: { x: number; y: number; s: number; c: string; vx: number; vy: number; t: number; ti: number }[] = [];
		for (let i = 0; i < 110; i++) {
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
				p.vy += 0.31;
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

	function handleOpenEnvelope() {
		if (isOpening || isOpened) return;
		isSealBroken = true;
		isOpening = true;
		triggerCozyConfetti();

		if (!isMusicPlaying) {
			isMusicPlaying = true;
			playCozySynth();
		}

		setTimeout(() => {
			isOpened = true;
			isOpening = false;
			triggerCozyConfetti();
			if (typeof window !== 'undefined') {
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}
		}, 650);
	}

	function handleReplayIntro() {
		isOpened = false;
		isSealBroken = false;
		isOpening = false;
	}
</script>

<svelte:head>
	<title>
		{isOpened
			? `Just Because, ${recipientName}! 🌿 — Tap & Keep`
			: `Surat Kejutan untuk ${recipientName} 💌 — Tap & Keep`}
	</title>
	<meta
		name="description"
		content="Kejutan spontan tanpa alasan khusus dari {senderName} untuk {recipientName} di Tap & Keep."
	/>
</svelte:head>

<canvas bind:this={confettiCanvas} class="fixed inset-0 pointer-events-none z-50 w-full h-full"></canvas>

{#if !isOpened}
	{#each clickFlowers as item (item.id)}
		<span
			class="fixed pointer-events-none z-50 text-2xl animate-[floatFlower_0.9s_ease-out_forwards]"
			style="left: {item.x}px; top: {item.y}px;"
			aria-hidden="true"
		>
			{item.emoji}
		</span>
	{/each}

	<!-- ===== INTERACTIVE WAX-SEALED WILDFLOWER ENVELOPE ===== -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		onclick={handleBgClick}
		class="min-h-screen w-full bg-gradient-to-b from-[#faf7ff] via-[#f6f2fb] to-[#f2f7f4] text-[#282135] flex flex-col items-center justify-center py-10 px-4 select-none relative overflow-hidden"
	>
		<!-- Ambient Glows -->
		<div class="absolute -top-32 -left-24 w-96 h-96 rounded-full bg-[#d9c2fd]/40 blur-[120px] pointer-events-none" aria-hidden="true"></div>
		<div class="absolute -bottom-32 -right-24 w-96 h-96 rounded-full bg-[#bbf7d0]/35 blur-[120px] pointer-events-none" aria-hidden="true"></div>

		<div class="relative w-full max-w-xl bg-white/90 backdrop-blur-2xl rounded-3xl p-8 sm:p-12 shadow-[0_24px_64px_-12px_rgba(104,85,136,0.2)] border border-[#e6def5] text-center overflow-hidden">
			<!-- Music Toggle -->
			<button
				type="button"
				onclick={toggleMusic}
				class="absolute top-4 right-4 z-30 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#faf7ff] hover:bg-[#ecdcff] text-[#685588] text-xs font-semibold transition-colors cursor-pointer border border-[#e3d9f5]"
			>
				<span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">
					{isMusicPlaying ? 'music_note' : 'music_off'}
				</span>
				<span>{isMusicPlaying ? 'Music On' : 'Play Lo-Fi'}</span>
			</button>

			<!-- Edition Pill -->
			<div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecdcff] text-[#4c3770] text-xs font-bold uppercase tracking-wider mb-6">
				<span class="material-symbols-outlined text-[15px] text-[#685588]" style="font-variation-settings: 'FILL' 1;">local_florist</span>
				<span>Just Because · #{formattedTag}</span>
			</div>

			<!-- Interactive Botanical Envelope SVG -->
			<div class="relative flex justify-center mb-5">
				<button
					type="button"
					onclick={handleOpenEnvelope}
					title="Ketuk untuk membuka amplop kejutan"
					class="group relative w-52 h-44 flex items-center justify-center cursor-pointer focus:outline-none transition-all duration-500 {isOpening ? 'scale-110 -translate-y-4 opacity-0' : 'animate-[gentleBob_3.2s_ease-in-out_infinite] hover:scale-105'}"
				>
					<svg viewBox="0 0 240 180" class="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Interactive Wildflower Envelope">
						<!-- Shadow -->
						<ellipse cx="120" cy="164" rx="82" ry="10" fill="#685588" fill-opacity="0.12" />
						<!-- Envelope body -->
						<rect x="30" y="52" width="180" height="104" rx="14" fill="#faf7ff" stroke="#d9c2fd" stroke-width="2.5" />
						<!-- Inner peeking letter -->
						<rect
							x="48"
							y={isSealBroken ? '24' : '44'}
							width="144"
							height="64"
							rx="8"
							fill="#ffffff"
							stroke="#e3d9f5"
							stroke-width="2"
							class="transition-all duration-500"
						/>
						<!-- Wildflower sprig on letter -->
						<path d="M120 42 Q125 28 134 24" stroke="#46a488" stroke-width="2.5" stroke-linecap="round" />
						<circle cx="136" cy="23" r="4" fill="#fde68a" />
						<circle cx="128" cy="30" r="3" fill="#d9c2fd" />
						<!-- Envelope bottom flaps -->
						<path d="M30 62 L120 118 L210 62" stroke="#d9c2fd" stroke-width="2.5" fill="#f3ecfc" fill-opacity="0.7" stroke-linejoin="round" />
						<!-- Wax Seal -->
						<g class="transition-transform duration-300 {isSealBroken ? 'scale-125 opacity-0' : 'group-hover:scale-110'}" style="transform-origin: 120px 108px;">
							<circle cx="120" cy="108" r="18" fill="#685588" />
							<circle cx="120" cy="108" r="13" fill="#836ba8" stroke="#ecdcff" stroke-width="1.5" />
							<text x="120" y="113" text-anchor="middle" fill="white" font-size="13">🌿</text>
						</g>
					</svg>
				</button>
			</div>

			<!-- Heading -->
			<h1 class="font-headline-lg text-3xl sm:text-5xl text-[#282135] leading-tight mb-3">
				Kejutan Kecil untuk <span class="italic text-[#685588]">{recipientName}</span> 🌿
			</h1>
			<p class="text-[#5f5570] text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
				Tidak perlu alasan khusus untuk membuatmu tersenyum. {senderName} menyelipkan sesuatu yang hangat di dalam amplop ini!
			</p>

			<!-- CTA Button -->
			<button
				type="button"
				onclick={handleOpenEnvelope}
				class="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#685588] to-[#836ba8] text-white font-bold text-base shadow-[0_14px_34px_-6px_rgba(104,85,136,0.45)] hover:scale-105 active:scale-95 transition-all cursor-pointer inline-flex items-center justify-center gap-2.5"
			>
				<span>💌</span>
				<span>Buka Amplop Kejutan</span>
			</button>

			<!-- Footer Tag Info -->
			<p class="mt-8 text-xs text-[#7b708f] font-medium flex items-center justify-center gap-1.5">
				<span class="material-symbols-outlined text-[14px] text-[#1f6b53]" style="font-variation-settings: 'FILL' 1;">verified</span>
				<span>NFC Tag #{formattedTag} · Sealed Keepsake by Tap &amp; Keep™</span>
			</p>
		</div>
	</div>
{:else}
	<JustBecauseOrnamentView
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
	@keyframes gentleBob {
		0%, 100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-8px);
		}
	}
	@keyframes floatFlower {
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
