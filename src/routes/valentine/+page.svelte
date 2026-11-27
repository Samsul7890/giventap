<script lang="ts">
	import type { PageProps } from './$types';
	import ValentineOrnamentView from '#lib/components/ValentineOrnamentView.svelte';

	let { data }: PageProps = $props();

	// svelte-ignore state_referenced_locally
	let recipientName = $state(data.recipientName || 'Mateo');
	let senderName = $state('Elena');

	$effect(() => {
		if (data.recipientName) recipientName = data.recipientName;
	});

	const formattedTag = $derived(
		data.slug.toUpperCase().startsWith('TK-') ? data.slug.toUpperCase() : `TK-${data.slug.toUpperCase()}`
	);

	// ValRequest Proposal State
	let isAccepted = $state(false);
	let noCount = $state(0);
	let noBtnOffset = $state<{ x: number; y: number }>({ x: 0, y: 0 });

	const NO_PHRASES = [
		'No',
		'Are you sure? 🥺',
		'Really sure??',
		'Think again! 💭',
		'Last chance!',
		'Surely not?',
		'You might regret this!',
		'Give it another thought!',
		'Have a heart! 💔',
		"Don't be so cold! ❄️",
		'Change of heart?',
		"Wouldn't you reconsider?",
		'Is that your final answer?',
		"You're breaking my heart ;("
	];

	const MAX_NO_ATTEMPTS = 8;
	const noButtonText = $derived(NO_PHRASES[Math.min(noCount, NO_PHRASES.length - 1)]);
	const isNoInvisible = $derived(noCount >= MAX_NO_ATTEMPTS);
	const noOpacity = $derived(Math.max(0, 1 - noCount / MAX_NO_ATTEMPTS));
	const noScale = $derived(Math.max(0.2, 1 - noCount * 0.1));
	// Yes button grows progressively larger until No is completely invisible
	const yesFontSize = $derived(15 + noCount * 5); // 15px -> 55px
	const yesPadX = $derived(32 + noCount * 10); // 32px -> 112px
	const yesPadY = $derived(14 + noCount * 5); // 14px -> 54px

	// Romantic Music Box Synthesizer (Web Audio API) with 3 selectable melodies
	let isMusicPlaying = $state(false);
	let currentTrackIndex = $state(0);
	let synthCtx: AudioContext | null = null;
	let synthTimer: number | null = null;

	const TRACKS = [
		{
			title: 'Lover (Soft Acoustic)',
			artist: 'Romantic Music Box',
			notes: [
				[329.63, 0.45], [392.00, 0.45], [493.88, 0.45], [523.25, 0.9],
				[493.88, 0.45], [392.00, 0.45], [329.63, 0.9],
				[293.66, 0.45], [349.23, 0.45], [440.00, 0.45], [493.88, 0.9],
				[440.00, 0.45], [349.23, 0.45], [293.66, 0.9],
				[261.63, 0.45], [329.63, 0.45], [392.00, 0.45], [523.25, 0.9],
				[493.88, 0.45], [440.00, 0.45], [392.00, 1.1]
			] as [number, number][]
		},
		{
			title: 'Moonlight Serenade',
			artist: 'Midnight Chimes',
			notes: [
				[261.63, 0.5], [329.63, 0.5], [392.00, 0.5], [440.00, 0.9],
				[392.00, 0.5], [329.63, 0.5], [293.66, 0.9],
				[246.94, 0.5], [293.66, 0.5], [349.23, 0.5], [392.00, 0.9],
				[349.23, 0.5], [293.66, 0.5], [261.63, 1.1]
			] as [number, number][]
		},
		{
			title: 'Forever & Always',
			artist: 'Celesta Waltz',
			notes: [
				[392.00, 0.4], [440.00, 0.4], [493.88, 0.4], [587.33, 0.8],
				[523.25, 0.4], [493.88, 0.4], [440.00, 0.8],
				[349.23, 0.4], [440.00, 0.4], [523.25, 0.4], [493.88, 0.8],
				[440.00, 0.4], [392.00, 1.0]
			] as [number, number][]
		}
	];

	function playRomanticSynth() {
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
				gain.gain.linearRampToValueAtTime(0.14, startTime + 0.03);
				gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);

				osc.connect(gain);
				gain.connect(synthCtx.destination);

				osc.start(startTime);
				osc.stop(startTime + dur);

				startTime += dur + 0.06;
			});

			const totalDur = startTime - synthCtx.currentTime;
			synthTimer = window.setTimeout(() => {
				if (isMusicPlaying) {
					playRomanticSynth();
				}
			}, totalDur * 1000);
		} catch {
			// Ignore if AudioContext is blocked
		}
	}

	function nextTrack() {
		currentTrackIndex = (currentTrackIndex + 1) % TRACKS.length;
		if (isMusicPlaying) {
			playRomanticSynth();
		} else {
			isMusicPlaying = true;
			playRomanticSynth();
		}
	}

	// Proposal interactive click-hearts
	let clickHearts = $state<{ id: number; x: number; y: number }[]>([]);
	let nextClickHeartId = 0;

	function handleProposalBgClick(e: MouseEvent) {
		if ((e.target as HTMLElement).closest('button')) return;
		const id = nextClickHeartId++;
		clickHearts = [...clickHearts, { id, x: e.clientX, y: e.clientY }];
		setTimeout(() => {
			clickHearts = clickHearts.filter((h) => h.id !== id);
		}, 900);
	}

	function stopRomanticSynth() {
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
			stopRomanticSynth();
		} else {
			isMusicPlaying = true;
			playRomanticSynth();
		}
	}

	// Confetti canvas for Yes celebration
	let confettiCanvas: HTMLCanvasElement | null = $state(null);

	function triggerHeartConfetti() {
		if (!confettiCanvas) return;
		const ctx = confettiCanvas.getContext('2d');
		if (!ctx) return;
		const W = (confettiCanvas.width = window.innerWidth);
		const H = (confettiCanvas.height = window.innerHeight);
		const colors = ['#98434c', '#e11d48', '#fb7185', '#ffdadb', '#d9c2fd', '#f43f5e', '#ffffff'];
		const P: { x: number; y: number; s: number; c: string; vx: number; vy: number; t: number; ti: number }[] = [];
		for (let i = 0; i < 100; i++) {
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
				p.vy += 0.32;
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

	function handleNoInteraction() {
		noCount++;
		// Playfully dodge within safe bounds
		const maxOffsetX = 110;
		const maxOffsetY = 65;
		noBtnOffset = {
			x: Math.round((Math.random() - 0.5) * 2 * maxOffsetX),
			y: Math.round((Math.random() - 0.5) * 2 * maxOffsetY)
		};
	}

	function handleYesClick() {
		isAccepted = true;
		triggerHeartConfetti();
		if (!isMusicPlaying) {
			isMusicPlaying = true;
			playRomanticSynth();
		}
		if (typeof window !== 'undefined') {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	function handleReplayProposal() {
		isAccepted = false;
		noCount = 0;
		noBtnOffset = { x: 0, y: 0 };
	}
</script>

<svelte:head>
	<title>
		{isAccepted
			? `Happy Valentine's Day, ${recipientName}! 💌 — Tap & Keep`
			: `Will You Be My Valentine, ${recipientName}? 💖 — Tap & Keep`}
	</title>
	<meta
		name="description"
		content="Interactive Valentine Keepsake & Proposal for {recipientName} on Tap & Keep."
	/>
</svelte:head>

<!-- Confetti Canvas -->
<canvas bind:this={confettiCanvas} class="fixed inset-0 pointer-events-none z-50 w-full h-full"></canvas>

{#if !isAccepted}
	<!-- Click-anywhere floating hearts on proposal screen -->
	{#each clickHearts as heart (heart.id)}
		<span
			class="fixed pointer-events-none z-50 text-2xl animate-[floatTapHeart_0.9s_ease-out_forwards]"
			style="left: {heart.x}px; top: {heart.y}px;"
			aria-hidden="true"
		>
			💖
		</span>
	{/each}

	<!-- ===== VALREQUEST-STYLE INTERACTIVE PROPOSAL SCREEN ===== -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		onclick={handleProposalBgClick}
		class="min-h-[calc(100vh-180px)] flex flex-col items-center justify-center py-8 px-4 select-none"
	>
		<div class="relative w-full max-w-xl bg-surface-container-lowest/90 backdrop-blur-2xl rounded-3xl p-8 sm:p-12 shadow-[0_24px_64px_-12px_rgba(152,67,76,0.2)] border border-outline-variant/30 text-center overflow-hidden">
			<!-- Top Music Quick Toggle -->
			<button
				type="button"
				onclick={toggleMusic}
				class="absolute top-4 right-4 z-30 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high/80 hover:bg-surface-container-highest text-primary text-xs font-semibold transition-colors cursor-pointer"
				aria-label={isMusicPlaying ? 'Matikan musik' : 'Putar musik'}
			>
				<span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">
					{isMusicPlaying ? 'music_note' : 'music_off'}
				</span>
				<span>{isMusicPlaying ? 'Music On' : 'Play Music'}</span>
			</button>
			<!-- Soft decorative corner glows -->
			<div class="absolute -top-20 -left-20 w-52 h-52 rounded-full bg-primary-fixed/50 blur-3xl pointer-events-none" aria-hidden="true"></div>
			<div class="absolute -bottom-20 -right-20 w-52 h-52 rounded-full bg-secondary-container/40 blur-3xl pointer-events-none" aria-hidden="true"></div>

			<!-- Edition Pill -->
			<div class="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-fixed/70 text-on-primary-fixed font-label-sm text-label-sm font-bold uppercase tracking-wider mb-6">
				<span class="material-symbols-outlined text-[15px] text-primary" style="font-variation-settings: 'FILL' 1;">favorite</span>
				<span>Valentine Request · #{formattedTag}</span>
			</div>

			<!-- Cute Animated Valentine Mascot SVG (Reacts to No clicks!) -->
			<div class="relative flex justify-center mb-6">
				<div class="w-40 h-40 sm:w-44 sm:h-44 flex items-center justify-center animate-[gentleBob_3s_ease-in-out_infinite]">
					<svg viewBox="0 0 200 200" class="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Cute Valentine Heart Character">
						<!-- Soft shadow -->
						<ellipse cx="100" cy="182" rx="54" ry="8" fill="#98434c" fill-opacity="0.12" />
						<!-- Main heart body -->
						<path
							d="M100 164C100 164 32 122 32 72C32 48 51 30 74 30C87 30 96 37 100 45C104 37 113 30 126 30C149 30 168 48 168 72C168 122 100 164 100 164Z"
							fill={noCount > 3 ? '#d9777f' : '#e11d48'}
							class="transition-colors duration-300"
						/>
						<!-- Highlight -->
						<path
							d="M52 62C55 50 66 43 76 44"
							stroke="white"
							stroke-width="6"
							stroke-linecap="round"
							stroke-opacity="0.45"
						/>
						<!-- Cute Eyes -->
						{#if noCount === 0}
							<!-- Happy sparkling eyes -->
							<circle cx="77" cy="88" r="7" fill="#251915" />
							<circle cx="75" cy="85.5" r="2.5" fill="white" />
							<circle cx="123" cy="88" r="7" fill="#251915" />
							<circle cx="121" cy="85.5" r="2.5" fill="white" />
							<!-- Cute smile -->
							<path d="M90 102C94 109 106 109 110 102" stroke="#251915" stroke-width="4" stroke-linecap="round" />
						{:else if noCount < 4}
							<!-- Pleading puppy eyes -->
							<circle cx="77" cy="88" r="8" fill="#251915" />
							<circle cx="74" cy="85" r="3" fill="white" />
							<circle cx="80" cy="91" r="1.5" fill="white" />
							<circle cx="123" cy="88" r="8" fill="#251915" />
							<circle cx="120" cy="85" r="3" fill="white" />
							<circle cx="126" cy="91" r="1.5" fill="white" />
							<!-- Worried eyebrows -->
							<path d="M67 75L84 79" stroke="#251915" stroke-width="3" stroke-linecap="round" />
							<path d="M133 75L116 79" stroke="#251915" stroke-width="3" stroke-linecap="round" />
							<!-- Little o mouth -->
							<ellipse cx="100" cy="105" rx="5" ry="6" fill="#251915" />
						{:else}
							<!-- Sad teary eyes -->
							<path d="M68 89Q77 82 85 89" stroke="#251915" stroke-width="4" stroke-linecap="round" />
							<path d="M115 89Q123 82 132 89" stroke="#251915" stroke-width="4" stroke-linecap="round" />
							<!-- Tear drops -->
							<circle cx="71" cy="98" r="3.5" fill="#93c5fd" />
							<circle cx="129" cy="98" r="3.5" fill="#93c5fd" />
							<!-- Sad wobble mouth -->
							<path d="M89 108Q100 99 111 108" stroke="#251915" stroke-width="4" stroke-linecap="round" />
						{/if}
						<!-- Rosy Cheeks -->
						<ellipse cx="62" cy="98" rx="9" ry="5" fill="#ffb2b7" fill-opacity="0.7" />
						<ellipse cx="138" cy="98" rx="9" ry="5" fill="#ffb2b7" fill-opacity="0.7" />
						<!-- Mini floating hearts -->
						<path d="M164 42C164 42 153 35 153 27C153 23 156 20 160 20C162 20 163.5 21 164 23C164.5 21 166 20 168 20C172 20 175 23 175 27C175 35 164 42 164 42Z" fill="#fb7185" />
						<path d="M36 48C36 48 27 42 27 36C27 33 29.5 31 32 31C33.8 31 35.2 32 36 33.5C36.8 32 38.2 31 40 31C42.5 31 45 33 45 36C45 42 36 48 36 48Z" fill="#f43f5e" />
					</svg>
				</div>
			</div>

			<!-- Proposal Heading -->
			<h1 class="relative font-headline-lg text-headline-lg sm:text-[44px] sm:leading-[52px] text-on-surface mb-3">
				Will you be my Valentine, <span class="text-primary italic font-medium">{recipientName}</span>?
			</h1>
			<p class="relative font-body-md text-body-md text-on-surface-variant max-w-md mx-auto mb-8">
				{#if noCount === 0}
					{senderName} has sealed a special keepsake capsule just for you. Say yes to unlock it! 💌
				{:else}
					Pretty please? My heart is waiting for your answer... 🥺💖
				{/if}
			</p>

			<!-- Interactive Yes / No Buttons -->
			<div class="relative flex flex-wrap items-center justify-center gap-4 min-h-[84px]">
				<button
					type="button"
					onclick={handleYesClick}
					style="font-size: {yesFontSize}px; padding: {yesPadY}px {yesPadX}px;"
					class="rounded-full bg-primary text-on-primary font-bold leading-none shadow-[0_12px_28px_-6px_rgba(152,67,76,0.5)] hover:shadow-[0_16px_34px_-6px_rgba(152,67,76,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer z-20 inline-flex items-center justify-center gap-2 max-w-full {isNoInvisible ? 'w-full' : ''}"
				>
					<span>Yes!</span>
					<span>💖</span>
				</button>

				{#if !isNoInvisible}
					<button
						type="button"
						onmouseenter={handleNoInteraction}
						onclick={handleNoInteraction}
						style="transform: translate({noBtnOffset.x}px, {noBtnOffset.y}px) scale({noScale}); opacity: {noOpacity};"
						class="px-6 py-3.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-lg text-label-lg font-semibold border border-outline-variant/40 hover:bg-surface-container-highest transition-all duration-200 cursor-pointer z-10"
					>
						{noButtonText}
					</button>
				{/if}
			</div>

			<!-- Footer Tag Info -->
			<p class="relative mt-8 text-xs text-outline font-medium flex items-center justify-center gap-1.5">
				<span class="material-symbols-outlined text-[14px] text-tertiary" style="font-variation-settings: 'FILL' 1;">verified</span>
				<span>NFC Tag #{formattedTag} · Sealed Keepsake by Tap &amp; Keep™</span>
			</p>
		</div>
	</div>
{:else}
	<!-- ===== AFTER YES CLICKED: VALENTINE EDITION RECIPIENT VIEW ===== -->
	<ValentineOrnamentView
		{recipientName}
		{senderName}
		{formattedTag}
		{isMusicPlaying}
		{currentTrackIndex}
		tracks={TRACKS}
		onToggleMusic={toggleMusic}
		onNextTrack={nextTrack}
		onReplayProposal={handleReplayProposal}
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
	@keyframes floatTapHeart {
		0% {
			transform: translate(-50%, -50%) scale(0.8);
			opacity: 1;
		}
		100% {
			transform: translate(-50%, -120%) scale(1.6);
			opacity: 0;
		}
	}
</style>
