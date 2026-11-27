<script lang="ts">
	import type { PageProps } from './$types';
	import AnniversaryOrnamentView from '#lib/components/AnniversaryOrnamentView.svelte';

	let { data }: PageProps = $props();

	// svelte-ignore state_referenced_locally
	let recipientName = $state(data.recipientName || 'Julian');
	let senderName = $state('Clara');
	let years = $state(5);

	$effect(() => {
		if (data.recipientName) recipientName = data.recipientName;
	});

	const formattedTag = $derived(
		data.slug.toUpperCase().startsWith('TK-') ? data.slug.toUpperCase() : `TK-${data.slug.toUpperCase()}`
	);

	// Anniversary Celebration Proposal State
	let isAccepted = $state(false);
	let noCount = $state(0);
	let noBtnOffset = $state<{ x: number; y: number }>({ x: 0, y: 0 });

	const NO_PHRASES = [
		'Belum Siap',
		'Yakin? 🥺',
		'Serius nih??',
		'Pikir lagi dong! 💭',
		'Kesempatan terakhir!',
		'Masa sih?',
		'Nanti nyesel loh!',
		'Coba pikirkan lagi!',
		'Jangan gitu dong! 💔',
		'Jangan dingin gitu! ❄️',
		'Berubah pikiran?',
		'Masa hati nuranimu bilang tidak?',
		'Final answer?',
		'Hatiku retak... 😢'
	];

	const MAX_NO_ATTEMPTS = 8;
	const noButtonText = $derived(NO_PHRASES[Math.min(noCount, NO_PHRASES.length - 1)]);
	const isNoInvisible = $derived(noCount >= MAX_NO_ATTEMPTS);
	const noOpacity = $derived(Math.max(0, 1 - noCount / MAX_NO_ATTEMPTS));
	const noScale = $derived(Math.max(0.2, 1 - noCount * 0.1));
	const yesFontSize = $derived(15 + noCount * 5);
	const yesPadX = $derived(32 + noCount * 10);
	const yesPadY = $derived(14 + noCount * 5);

	// Romantic Music Box Synthesizer
	let isMusicPlaying = $state(false);
	let currentTrackIndex = $state(0);
	let synthCtx: AudioContext | null = null;
	let synthTimer: number | null = null;

	const TRACKS = [
		{
			title: 'A Thousand Years',
			artist: 'Anniversary Music Box',
			notes: [
				[329.63, 0.5], [392.00, 0.5], [493.88, 0.5], [523.25, 1.0],
				[493.88, 0.5], [440.00, 0.5], [392.00, 0.5], [349.23, 1.0],
				[329.63, 0.5], [293.66, 0.5], [329.63, 0.5], [392.00, 1.0],
				[349.23, 0.5], [329.63, 0.5], [293.66, 0.5], [261.63, 1.2]
			] as [number, number][]
		},
		{
			title: 'Golden Hour Waltz',
			artist: 'Sunset Chimes',
			notes: [
				[261.63, 0.5], [329.63, 0.5], [392.00, 0.5], [440.00, 0.9],
				[392.00, 0.5], [329.63, 0.5], [293.66, 0.9],
				[246.94, 0.5], [293.66, 0.5], [349.23, 0.5], [392.00, 0.9],
				[349.23, 0.5], [293.66, 0.5], [261.63, 1.1]
			] as [number, number][]
		},
		{
			title: 'Forever Begins Tonight',
			artist: 'Celesta Serenade',
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

	// Click-anywhere floating champagne toasts on proposal screen
	let clickEmojis = $state<{ id: number; x: number; y: number }[]>([]);
	let nextClickEmojiId = 0;

	function handleProposalBgClick(e: MouseEvent) {
		if ((e.target as HTMLElement).closest('button')) return;
		const id = nextClickEmojiId++;
		clickEmojis = [...clickEmojis, { id, x: e.clientX, y: e.clientY }];
		setTimeout(() => {
			clickEmojis = clickEmojis.filter((h) => h.id !== id);
		}, 900);
	}

	// Confetti canvas for Yes celebration
	let confettiCanvas: HTMLCanvasElement | null = $state(null);

	function triggerConfetti() {
		if (!confettiCanvas) return;
		const ctx = confettiCanvas.getContext('2d');
		if (!ctx) return;
		const W = (confettiCanvas.width = window.innerWidth);
		const H = (confettiCanvas.height = window.innerHeight);
		const colors = ['#c5a155', '#98434c', '#f5c563', '#ffdadb', '#d9c2fd', '#e8b540', '#ffffff'];
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
		const maxOffsetX = 110;
		const maxOffsetY = 65;
		noBtnOffset = {
			x: Math.round((Math.random() - 0.5) * 2 * maxOffsetX),
			y: Math.round((Math.random() - 0.5) * 2 * maxOffsetY)
		};
	}

	function handleYesClick() {
		isAccepted = true;
		triggerConfetti();
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
			? `Happy ${years}th Anniversary, ${recipientName}! 🥂 — Tap & Keep`
			: `Rayakan Anniversary Bersama, ${recipientName}? 💍 — Tap & Keep`}
	</title>
	<meta
		name="description"
		content="Interactive Anniversary Keepsake & Celebration for {recipientName} on Tap & Keep."
	/>
</svelte:head>

<!-- Confetti Canvas -->
<canvas bind:this={confettiCanvas} class="fixed inset-0 pointer-events-none z-50 w-full h-full"></canvas>

{#if !isAccepted}
	<!-- Click-anywhere floating champagne on proposal screen -->
	{#each clickEmojis as emoji (emoji.id)}
		<span
			class="fixed pointer-events-none z-50 text-2xl animate-[floatTapEmoji_0.9s_ease-out_forwards]"
			style="left: {emoji.x}px; top: {emoji.y}px;"
			aria-hidden="true"
		>
			🥂
		</span>
	{/each}

	<!-- ===== INTERACTIVE PROPOSAL SCREEN ===== -->
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

			<!-- Decorative corner glows -->
			<div class="absolute -top-20 -left-20 w-52 h-52 rounded-full bg-primary-fixed/50 blur-3xl pointer-events-none" aria-hidden="true"></div>
			<div class="absolute -bottom-20 -right-20 w-52 h-52 rounded-full bg-secondary-container/40 blur-3xl pointer-events-none" aria-hidden="true"></div>

			<!-- Edition Pill -->
			<div class="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-fixed/70 text-on-primary-fixed font-label-sm text-label-sm font-bold uppercase tracking-wider mb-6">
				<span class="material-symbols-outlined text-[15px] text-primary" style="font-variation-settings: 'FILL' 1;">diamond</span>
				<span>Anniversary Celebration · #{formattedTag}</span>
			</div>

			<!-- Cute Animated Anniversary Ring SVG (Reacts to No clicks!) -->
			<div class="relative flex justify-center mb-6">
				<div class="w-40 h-40 sm:w-44 sm:h-44 flex items-center justify-center animate-[gentleBob_3s_ease-in-out_infinite]">
					<svg viewBox="0 0 200 200" class="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Cute Anniversary Ring Character">
						<!-- Soft shadow -->
						<ellipse cx="100" cy="182" rx="54" ry="8" fill="#c5a155" fill-opacity="0.12" />
						<!-- Ring body -->
						<circle
							cx="100"
							cy="96"
							r="58"
							stroke={noCount > 3 ? '#b8505a' : '#c5a155'}
							stroke-width="18"
							fill="none"
							class="transition-colors duration-300"
						/>
						<!-- Ring inner glow -->
						<circle cx="100" cy="96" r="58" stroke="#f5c563" stroke-width="8" fill="none" opacity="0.3" />
						<!-- Diamond -->
						<path
							d="M100 28L115 48H85L100 28Z"
							fill={noCount > 3 ? '#dac1c1' : '#f5c563'}
							class="transition-colors duration-300"
						/>
						<path d="M85 48H115L100 68Z" fill={noCount > 3 ? '#c5a155' : '#e8b540'} class="transition-colors duration-300" />
						<!-- Diamond sparkles -->
						<path d="M120 32L126 28L120 24" stroke="#f5c563" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.7" />
						<path d="M75 32L69 28L75 24" stroke="#f5c563" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.7" />
						<!-- Cute Eyes -->
						{#if noCount === 0}
							<!-- Happy sparkling eyes -->
							<circle cx="82" cy="98" r="6" fill="#251915" />
							<circle cx="80" cy="95.5" r="2.5" fill="white" />
							<circle cx="118" cy="98" r="6" fill="#251915" />
							<circle cx="116" cy="95.5" r="2.5" fill="white" />
							<!-- Cute smile -->
							<path d="M90 112C94 118 106 118 110 112" stroke="#251915" stroke-width="3.5" stroke-linecap="round" />
						{:else if noCount < 4}
							<!-- Pleading puppy eyes -->
							<circle cx="82" cy="98" r="7" fill="#251915" />
							<circle cx="79" cy="95" r="3" fill="white" />
							<circle cx="85" cy="101" r="1.5" fill="white" />
							<circle cx="118" cy="98" r="7" fill="#251915" />
							<circle cx="115" cy="95" r="3" fill="white" />
							<circle cx="121" cy="101" r="1.5" fill="white" />
							<!-- Worried eyebrows -->
							<path d="M72 85L87 89" stroke="#251915" stroke-width="3" stroke-linecap="round" />
							<path d="M128 85L113 89" stroke="#251915" stroke-width="3" stroke-linecap="round" />
							<!-- Little o mouth -->
							<ellipse cx="100" cy="114" rx="5" ry="6" fill="#251915" />
						{:else}
							<!-- Sad teary eyes -->
							<path d="M73 99Q82 92 90 99" stroke="#251915" stroke-width="3.5" stroke-linecap="round" />
							<path d="M110 99Q118 92 127 99" stroke="#251915" stroke-width="3.5" stroke-linecap="round" />
							<!-- Tear drops -->
							<circle cx="76" cy="107" r="3" fill="#93c5fd" />
							<circle cx="124" cy="107" r="3" fill="#93c5fd" />
							<!-- Sad wobble mouth -->
							<path d="M90 117Q100 109 110 117" stroke="#251915" stroke-width="3.5" stroke-linecap="round" />
						{/if}
						<!-- Rosy Cheeks -->
						<ellipse cx="68" cy="108" rx="8" ry="4" fill="#ffb2b7" fill-opacity="0.6" />
						<ellipse cx="132" cy="108" rx="8" ry="4" fill="#ffb2b7" fill-opacity="0.6" />
						<!-- Mini floating sparkles -->
						<circle cx="160" cy="38" r="3" fill="#f5c563" opacity="0.8">
							<animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
						</circle>
						<circle cx="40" cy="42" r="2.5" fill="#e8b540" opacity="0.6">
							<animate attributeName="opacity" values="0.6;0.2;0.6" dur="1.8s" repeatCount="indefinite" />
						</circle>
						<circle cx="150" cy="60" r="2" fill="#ffdadb" opacity="0.7">
							<animate attributeName="opacity" values="0.4;1;0.4" dur="2.2s" repeatCount="indefinite" />
						</circle>
					</svg>
				</div>
			</div>

			<!-- Proposal Heading -->
			<h1 class="relative font-headline-lg text-headline-lg sm:text-[44px] sm:leading-[52px] text-on-surface mb-3">
				Rayakan Anniversary Kita, <span class="text-primary italic font-medium">{recipientName}</span>?
			</h1>
			<p class="relative font-body-md text-body-md text-on-surface-variant max-w-md mx-auto mb-8">
				{#if noCount === 0}
					{senderName} telah menyegel kapsul kenangan anniversary spesial untukmu. Katakan iya untuk membukanya! 🥂
				{:else}
					Ayolah... kapsul cintaku menunggumu di dalam sana... 🥺💛
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
					<span>Iya, Rayakan!</span>
					<span>🥂</span>
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
	<!-- ===== AFTER YES CLICKED: ANNIVERSARY EDITION RECIPIENT VIEW ===== -->
	<AnniversaryOrnamentView
		{recipientName}
		{senderName}
		{formattedTag}
		{years}
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
	@keyframes floatTapEmoji {
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
