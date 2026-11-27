<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		recipientName: string;
		senderName?: string;
		formattedTag: string;
		isMusicPlaying?: boolean;
		currentTrackIndex?: number;
		tracks?: { title: string; artist: string }[];
		onToggleMusic?: () => void;
		onNextTrack?: () => void;
		onReplayProposal?: () => void;
	}

	let {
		recipientName = 'Mateo',
		senderName = 'Elena',
		formattedTag = 'TK-8492',
		isMusicPlaying = false,
		currentTrackIndex = 0,
		tracks = [
			{ title: 'Lover (Soft Acoustic)', artist: 'Romantic Music Box' },
			{ title: 'Moonlight Serenade', artist: 'Midnight Chimes' },
			{ title: 'Forever & Always', artist: 'Celesta Waltz' }
		],
		onToggleMusic,
		onNextTrack,
		onReplayProposal
	}: Props = $props();

	const activeTrack = $derived(tracks[currentTrackIndex] ?? tracks[0]);

	// 1. Tap Back Kisses & Floating Hearts
	let kissCount = $state(58);
	let isKissAnimating = $state(false);
	let floatingHearts = $state<{ id: number; x: number; y: number; emoji: string }[]>([]);
	let nextHeartId = 0;

	const LOVE_EMOJIS = ['❤️', '💖', '💕', '💘', '🌹', '✨', '😘'];

	function spawnFloatingBurst(x: number, y: number, count = 1) {
		const newHearts = Array.from({ length: count }, (_, i) => ({
			id: nextHeartId++,
			x: x + (Math.random() - 0.5) * (count > 1 ? 80 : 20),
			y: y - i * 6,
			emoji: LOVE_EMOJIS[Math.floor(Math.random() * LOVE_EMOJIS.length)]
		}));
		floatingHearts = [...floatingHearts, ...newHearts];
		const ids = new Set(newHearts.map((h) => h.id));
		setTimeout(() => {
			floatingHearts = floatingHearts.filter((h) => !ids.has(h.id));
		}, 1100);
	}

	function handleSendKiss(e: MouseEvent) {
		kissCount++;
		isKissAnimating = true;
		setTimeout(() => {
			isKissAnimating = false;
		}, 300);
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		spawnFloatingBurst(rect.left + rect.width / 2, rect.top, 4);
	}

	// 2. Interactive Polaroid Flip & Reaction
	let flippedPolaroids = $state<{ first: boolean; second: boolean }>({
		first: false,
		second: false
	});
	let polaroidReactions = $state<{ first: string; second: string }>({
		first: '😍',
		second: '🥹'
	});
	const REACTION_OPTIONS = ['😍', '🥹', '❤️', '🔥', '🥰'];

	function cycleReaction(which: 'first' | 'second', e: MouseEvent) {
		e.stopPropagation();
		const current = polaroidReactions[which];
		const idx = REACTION_OPTIONS.indexOf(current);
		polaroidReactions[which] = REACTION_OPTIONS[(idx + 1) % REACTION_OPTIONS.length];
		spawnFloatingBurst(e.clientX, e.clientY, 2);
	}

	// 3. Interactive Scratch-Off Secret Love Voucher
	let scratchCanvas: HTMLCanvasElement | null = $state(null);
	let isScratching = $state(false);
	let scratchRevealed = $state(false);
	let scratchProgress = $state(0);

	function initScratchCard() {
		if (!scratchCanvas) return;
		const ctx = scratchCanvas.getContext('2d');
		if (!ctx) return;
		const w = scratchCanvas.width;
		const h = scratchCanvas.height;

		const grad = ctx.createLinearGradient(0, 0, w, h);
		grad.addColorStop(0, '#98434c');
		grad.addColorStop(0.5, '#c85a66');
		grad.addColorStop(1, '#d9777f');
		ctx.globalCompositeOperation = 'source-over';
		ctx.fillStyle = grad;
		ctx.fillRect(0, 0, w, h);

		// Subtle shimmer pattern
		ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
		for (let i = 0; i < 24; i++) {
			ctx.beginPath();
			ctx.arc((i * 37) % w, (i * 23) % h, 2, 0, Math.PI * 2);
			ctx.fill();
		}

		ctx.fillStyle = '#ffffff';
		ctx.font = '600 14px "Plus Jakarta Sans", sans-serif';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText('✨ Gosok di sini untuk Kejutan Rahasia ✨', w / 2, h / 2);
	}

	onMount(() => {
		initScratchCard();
	});

	function scratchAt(clientX: number, clientY: number) {
		if (!scratchCanvas || scratchRevealed) return;
		const ctx = scratchCanvas.getContext('2d');
		if (!ctx) return;
		const rect = scratchCanvas.getBoundingClientRect();
		const scaleX = scratchCanvas.width / rect.width;
		const scaleY = scratchCanvas.height / rect.height;
		const x = (clientX - rect.left) * scaleX;
		const y = (clientY - rect.top) * scaleY;

		ctx.globalCompositeOperation = 'destination-out';
		ctx.beginPath();
		ctx.arc(x, y, 22, 0, Math.PI * 2);
		ctx.fill();

		// Estimate cleared percentage sparsely
		const data = ctx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height).data;
		let transparent = 0;
		const step = 16;
		for (let i = 3; i < data.length; i += 4 * step) {
			if (data[i] < 128) transparent++;
		}
		const pct = Math.round((transparent / (data.length / (4 * step))) * 100);
		scratchProgress = pct;
		if (pct >= 45 && !scratchRevealed) {
			scratchRevealed = true;
			spawnFloatingBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 10);
		}
	}

	function resetScratchCard() {
		scratchRevealed = false;
		scratchProgress = 0;
		initScratchCard();
	}

	// 4. Interactive Date Night Picker / Spinner
	const DATE_IDEAS = [
		{ id: 'dinner', icon: 'restaurant', title: 'Candlelight Dinner', desc: 'Makan malam romantis berdua dengan cahaya lilin' },
		{ id: 'movie', icon: 'movie', title: 'Movie & Cuddle Night', desc: 'Maraton film favorit sambil makan popcorn hangat' },
		{ id: 'walk', icon: 'icecream', title: 'Midnight Walk & Gelato', desc: 'Jalan santai malam hari ditemani es krim manis' },
		{ id: 'stargaze', icon: 'nights_stay', title: 'Stargazing Picnic', desc: 'Piknik malam menatap bintang sambil dengar musik' }
	];
	let selectedDateId = $state<string>('dinner');
	let isSpinningDate = $state(false);
	let dateConfirmed = $state(false);

	function spinRandomDate() {
		if (isSpinningDate) return;
		isSpinningDate = true;
		dateConfirmed = false;
		let ticks = 0;
		const interval = setInterval(() => {
			selectedDateId = DATE_IDEAS[ticks % DATE_IDEAS.length].id;
			ticks++;
			if (ticks > 10) {
				clearInterval(interval);
				selectedDateId = DATE_IDEAS[Math.floor(Math.random() * DATE_IDEAS.length)].id;
				isSpinningDate = false;
			}
		}, 90);
	}

	function confirmDateChoice(e: MouseEvent) {
		dateConfirmed = true;
		spawnFloatingBurst(e.clientX, e.clientY, 8);
	}

	// 5. Interactive Love Note Reply (Write back a sweet note)
	let replyNote = $state('');
	let savedReplies = $state<string[]>([]);

	function submitReply(e: SubmitEvent) {
		e.preventDefault();
		const trimmed = replyNote.trim();
		if (!trimmed) return;
		savedReplies = [trimmed, ...savedReplies];
		replyNote = '';
		kissCount += 3;
	}

	// 6. Wallet Toast Notification
	let walletToast = $state<string | null>(null);
	function handleWalletPass(platform: 'Apple' | 'Google') {
		walletToast = `${platform} Wallet Pass untuk ${recipientName} siap disimpan!`;
		setTimeout(() => {
			walletToast = null;
		}, 2800);
	}
</script>

<!-- Floating Hearts Overlay -->
{#each floatingHearts as heart (heart.id)}
	<span
		class="fixed pointer-events-none z-50 text-2xl animate-[floatUpFade_1.05s_ease-out_forwards]"
		style="left: {heart.x}px; top: {heart.y}px;"
		aria-hidden="true"
	>
		{heart.emoji}
	</span>
{/each}

<!-- Wallet Toast Notification -->
{#if walletToast}
	<div class="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-on-surface text-surface text-xs font-semibold shadow-xl flex items-center gap-2 animate-bounce">
		<span class="material-symbols-outlined text-[16px] text-tertiary-fixed" style="font-variation-settings: 'FILL' 1;">check_circle</span>
		<span>{walletToast}</span>
	</div>
{/if}

<div class="flex flex-col w-full pb-space-2xl">
	<div class="relative w-full pt-space-md pb-space-lg">
		<!-- Status Ribbon / Micro Chips -->
		<div class="flex flex-wrap items-center justify-between gap-space-sm mb-space-lg">
			<div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-high/80 backdrop-blur-md shadow-sm">
				<span class="flex h-2 w-2 relative">
					<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
					<span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
				</span>
				<span class="font-label-md text-label-md text-on-surface-variant font-semibold tracking-wide">
					Verified NFC Keepsake • Tag #{formattedTag}
				</span>
				<span class="text-outline-variant">•</span>
				<span class="font-label-sm text-label-sm text-tertiary font-bold tracking-wider uppercase">
					Sealed Permanently
				</span>
			</div>

			<div class="flex items-center gap-2">
				<div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary-fixed/50 backdrop-blur-md text-on-secondary-fixed">
					<span class="material-symbols-outlined text-[16px] text-secondary" style="font-variation-settings: 'FILL' 1;">favorite</span>
					<span class="font-label-md text-label-md font-medium">Valentine Romance Edition • Tap Recipient Vault</span>
				</div>
				{#if onReplayProposal}
					<button
						type="button"
						onclick={onReplayProposal}
						class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container-high/80 hover:bg-surface-container-highest text-primary font-label-sm text-label-sm font-semibold transition-colors cursor-pointer"
						title="Ulangi Pertanyaan Valentine"
					>
						<span class="material-symbols-outlined text-[14px]">replay</span>
						<span class="hidden sm:inline">Replay</span>
					</button>
				{/if}
			</div>
		</div>

		<!-- Hero Banner -->
		<div class="relative w-full mb-space-xl overflow-hidden rounded-3xl bg-surface-container-lowest/90 backdrop-blur-xl shadow-xl">
			<div class="relative w-full h-48 md:h-[260px] overflow-hidden rounded-t-3xl">
				<img
					alt="Romantic Valentine celebration banner with delicate pink and red garden roses"
					class="w-full h-full object-cover object-center"
					src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1400&q=80"
				/>
				<div class="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/30 to-transparent"></div>
			</div>
			<div class="relative px-space-md md:px-space-xl pb-space-lg pt-2 text-center flex flex-col items-center">
				<div class="flex flex-wrap items-center justify-center gap-2 mb-3">
					<span class="inline-flex items-center px-3 py-1 rounded-full bg-primary-fixed/80 text-on-primary-fixed font-label-sm text-label-sm font-semibold shadow-sm">
						🌹 Be My Valentine
					</span>
					<span class="inline-flex items-center px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold shadow-sm">
						💖 Eternal Keepsake
					</span>
					<span class="inline-flex items-center px-3 py-1 rounded-full bg-tertiary-container/20 text-on-tertiary-container font-label-sm text-label-sm font-semibold shadow-sm">
						✨ Interactive Love Vault
					</span>
				</div>
				<h1 class="font-headline-lg text-headline-lg md:text-[52px] md:leading-[60px] text-on-surface leading-[1.15] mb-2">
					Happy Valentine's Day, {recipientName}! 💌🌹
				</h1>
				<p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
					Every heartbeat and quiet romantic whisper preserved in timeless NFC memory
				</p>
			</div>
		</div>

		<!-- Main Editorial Keepsake Grid: 5 / 7 Asymmetrical Luxury Split -->
		<div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
			<!-- LEFT COLUMN: Interactive Flip Polaroids + Telemetry (5 cols) -->
			<div class="lg:col-span-5 flex flex-col gap-space-xl">
				<!-- Polaroids Dynamic Layered Canvas (Tap to Flip!) -->
				<div class="relative w-full pt-4 pb-8 flex flex-col items-center justify-center">
					<p class="font-label-sm text-label-sm uppercase tracking-widest text-primary/80 font-bold mb-4 flex items-center gap-1.5">
						<span class="material-symbols-outlined text-[15px]">touch_app</span>
						Ketuk Foto untuk Membalik Kenangan
					</p>

					<div class="relative w-full flex items-center justify-center min-h-[380px]">
						<div class="absolute inset-0 bg-gradient-to-tr from-primary-fixed/40 via-secondary-container/30 to-surface-container-high/50 rounded-3xl blur-2xl -z-10"></div>

						<!-- Bottom Polaroid (Offset & Tilted, Click to flip) -->
						<button
							type="button"
							onclick={() => (flippedPolaroids.first = !flippedPolaroids.first)}
							class="text-left absolute w-[86%] sm:w-[320px] aspect-[4/5] bg-surface-container-lowest p-3.5 pb-6 rounded-2xl shadow-xl transform -rotate-6 translate-x-3 translate-y-6 transition-all duration-500 hover:-rotate-3 hover:translate-y-4 cursor-pointer group"
						>
							{#if !flippedPolaroids.first}
								<div class="relative w-full aspect-square rounded-lg overflow-hidden bg-surface-container-high mb-3">
									<img
										class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
										alt="Intimate cozy candid couple laughing together with warm pastel lighting"
										src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80"
									/>
									<div class="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-surface-container-lowest/80 backdrop-blur-md text-[10px] font-semibold text-on-surface-variant tracking-wider uppercase">
										Dec 28
									</div>
								</div>
								<p class="font-headline-sm text-headline-sm text-center text-on-surface/85 italic tracking-tight">
									Winter Walks &amp; Hot Cocoa
								</p>
							{:else}
								<div class="w-full h-full rounded-xl bg-surface-container-low p-5 flex flex-col items-center justify-center text-center border border-outline-variant/30">
									<span class="text-3xl mb-3">☕❄️</span>
									<p class="font-headline-sm text-on-surface font-bold mb-2">Behind the Moment</p>
									<p class="font-body-sm text-on-surface-variant leading-relaxed">
										“Malam paling dingin tahun lalu, tapi tawa kita bikin segalanya terasa paling hangat.”
									</p>
									<span class="mt-4 text-[11px] font-bold text-primary uppercase tracking-wider">Ketuk untuk kembali</span>
								</div>
							{/if}
						</button>

						<!-- Top Polaroid (Hero Keepsake, Click to flip + Reaction badge) -->
						<div
							role="button"
							tabindex="0"
							onclick={() => (flippedPolaroids.second = !flippedPolaroids.second)}
							onkeydown={(e) => e.key === 'Enter' && (flippedPolaroids.second = !flippedPolaroids.second)}
							class="relative w-[92%] sm:w-[340px] aspect-[4/5] bg-surface-container-lowest p-4 pb-8 rounded-2xl shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-500 z-10 hover:shadow-[0_25px_50px_-12px_rgba(152,67,76,0.25)] cursor-pointer"
						>
							<div class="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-primary-fixed/80 backdrop-blur-sm rounded-sm shadow-sm opacity-80 rotate-1"></div>

							{#if !flippedPolaroids.second}
								<div class="relative w-full aspect-square rounded-xl overflow-hidden bg-surface-container mb-4 shadow-inner">
									<img
										alt="Couple smiling warmly under sparkling evening lights"
										class="w-full h-full object-cover"
										src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80"
									/>
									<div class="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-full bg-surface/90 backdrop-blur-md flex items-center gap-1.5 shadow-sm">
										<span class="material-symbols-outlined text-primary text-[14px]" style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
										<span class="font-label-sm text-label-sm text-on-surface font-semibold tracking-wide">Archival Grade</span>
									</div>
									<button
										type="button"
										onclick={(e) => cycleReaction('second', e)}
										class="absolute bottom-2.5 right-2.5 w-9 h-9 rounded-full bg-surface/95 backdrop-blur-md shadow-md flex items-center justify-center text-lg hover:scale-110 active:scale-90 transition-transform cursor-pointer"
										title="Ganti Reaksi"
									>
										{polaroidReactions.second}
									</button>
								</div>
								<div class="text-center px-2">
									<p class="font-headline-md text-headline-md text-on-surface leading-tight tracking-tight select-none">
										You &amp; Me Under The Fairy Lights ❤️
									</p>
									<p class="font-label-sm text-label-sm text-outline uppercase tracking-widest mt-1">
										Feb 14th • Tap photo to flip
									</p>
								</div>
							{:else}
								<div class="w-full h-full rounded-xl bg-gradient-to-br from-primary-fixed/40 to-surface-container-low p-6 flex flex-col items-center justify-center text-center border border-primary/20">
									<span class="text-4xl mb-3">✨📸</span>
									<p class="font-headline-md text-on-surface font-bold mb-2">Secret Note for {recipientName}</p>
									<p class="font-body-md text-on-surface-variant leading-relaxed">
										Di antara ribuan foto yang pernah kita ambil, senyummu di foto ini selalu jadi favoritku nomor satu.
									</p>
									<span class="mt-5 text-[11px] font-bold text-primary uppercase tracking-wider">Ketuk untuk melihat foto</span>
								</div>
							{/if}
						</div>
					</div>
				</div>

				<!-- Interactive Scratch-Off Secret Love Voucher -->
				<div class="bg-surface-container-lowest/90 backdrop-blur-xl p-5 rounded-3xl shadow-lg border border-outline-variant/25">
					<div class="flex items-center justify-between mb-3">
						<div class="flex items-center gap-2">
							<span class="material-symbols-outlined text-primary text-[20px]" style="font-variation-settings: 'FILL' 1;">redeem</span>
							<h3 class="font-headline-sm text-headline-sm text-on-surface font-bold">Kejutan Gosok Rahasia</h3>
						</div>
						{#if scratchRevealed}
							<button
								type="button"
								onclick={resetScratchCard}
								class="text-xs font-semibold text-primary hover:underline cursor-pointer"
							>
								Reset
							</button>
						{:else}
							<span class="text-[11px] font-semibold text-on-surface-variant">{scratchProgress}%</span>
						{/if}
					</div>

					<div class="relative w-full h-28 rounded-2xl overflow-hidden border border-primary/20 bg-gradient-to-r from-primary-fixed/60 via-surface-container-low to-secondary-fixed/50 flex flex-col items-center justify-center text-center p-4 select-none">
						<p class="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold mb-1">
							🎁 Golden Love Voucher
						</p>
						<p class="font-headline-sm text-on-surface font-bold">
							1x Dinner Romantis + Pelukan Sepuasnya! 🍽️🤗
						</p>
						<p class="text-[11px] text-on-surface-variant mt-0.5">Berlaku seumur hidup · Khusus untuk {recipientName}</p>

						{#if !scratchRevealed}
							<canvas
								bind:this={scratchCanvas}
								width="400"
								height="120"
								onmousedown={(e) => {
									isScratching = true;
									scratchAt(e.clientX, e.clientY);
								}}
								onmousemove={(e) => isScratching && scratchAt(e.clientX, e.clientY)}
								onmouseup={() => (isScratching = false)}
								onmouseleave={() => (isScratching = false)}
								ontouchstart={(e) => {
									isScratching = true;
									if (e.touches[0]) scratchAt(e.touches[0].clientX, e.touches[0].clientY);
								}}
								ontouchmove={(e) => {
									if (isScratching && e.touches[0]) {
										e.preventDefault();
										scratchAt(e.touches[0].clientX, e.touches[0].clientY);
									}
								}}
								ontouchend={() => (isScratching = false)}
								class="absolute inset-0 w-full h-full cursor-crosshair touch-none"
							></canvas>
						{/if}
					</div>
				</div>

				<!-- Telemetry & Hardware Authentication Stack -->
				<div class="flex flex-col gap-space-sm">
					<div class="grid grid-cols-2 gap-space-sm">
						<div class="bg-surface-container-low p-space-md rounded-2xl flex items-center gap-3 shadow-sm">
							<div class="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary flex-shrink-0">
								<span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">contactless</span>
							</div>
							<div class="min-w-0">
								<p class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-medium">Memory Tap</p>
								<p class="font-headline-sm text-headline-sm text-on-surface font-bold">56 Times</p>
							</div>
						</div>
						<div class="bg-surface-container-low p-space-md rounded-2xl flex items-center gap-3 shadow-sm">
							<div class="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary flex-shrink-0">
								<span class="material-symbols-outlined text-[20px]">lock</span>
							</div>
							<div class="min-w-0">
								<p class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-medium">Vault State</p>
								<p class="font-headline-sm text-headline-sm text-tertiary font-bold">Write Locked</p>
							</div>
						</div>
					</div>
					<div class="bg-surface-container-low/70 backdrop-blur-md p-space-md rounded-2xl flex items-center justify-between shadow-sm">
						<div class="flex items-center gap-3">
							<div class="w-9 h-9 rounded-xl bg-surface-container-highest flex items-center justify-center text-secondary">
								<span class="material-symbols-outlined text-[18px]">memory</span>
							</div>
							<div>
								<p class="font-label-md text-label-md font-semibold text-on-surface">Hardware Authenticated</p>
								<p class="font-body-sm text-body-sm text-on-surface-variant">NTAG215 • AES-128 Permanent Seal</p>
							</div>
						</div>
						<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-tertiary-container/20 text-on-tertiary-container font-label-sm text-label-sm font-bold">
							<span class="material-symbols-outlined text-[14px]">verified</span> Validated
						</span>
					</div>
				</div>
			</div>

			<!-- RIGHT COLUMN: Love Letter, Date Night Picker, Reply Note & Engagement Deck (7 cols) -->
			<div class="lg:col-span-7 flex flex-col gap-space-lg">
				<!-- Main Keepsake Love Letter Card -->
				<article class="relative bg-surface-container-lowest/90 backdrop-blur-xl p-space-lg md:p-space-xl rounded-3xl shadow-xl overflow-hidden">
					<div class="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary-fixed/40 blur-3xl pointer-events-none"></div>

					<div class="flex flex-wrap items-center justify-between gap-space-sm mb-space-lg pb-space-sm">
						<div class="flex items-center gap-2">
							<span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
							<span class="font-label-md text-label-md font-bold uppercase tracking-wider text-primary">Opened Valentine Capsule</span>
						</div>
						<div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
							<span class="material-symbols-outlined text-[14px]">event</span>
							<span>Recorded Feb 14 • Forever Intact</span>
						</div>
					</div>

					<h2 class="font-headline-lg text-headline-lg md:text-[48px] md:leading-[56px] text-on-surface leading-[1.15] mb-space-md">
						To my favorite person in the whole universe, {recipientName}! 💌
					</h2>

					<div class="space-y-space-md text-on-surface-variant font-body-lg text-body-lg leading-relaxed">
						<p>
							I made this little keepsake because ordinary words in a fleeting text message could never hold what you mean to me. Remember that freezing night under the twinkling garden lights, laughing so hard our ribs ached while the steam rose from our cups?
						</p>
						<p>
							Every time the world gets dizzying and loud, holding on to your hand is what brings me back home. Your patience, your sudden midnight jokes, and the quiet comfort you bring into every room are treasures I never take for granted.
						</p>
						<p class="italic font-headline-md text-headline-md leading-snug text-primary">
							“Anytime you tap this keepsake with your phone, let it be an unbreakable reminder: a piece of my heartbeat is forever right here with you.”
						</p>
						<p>
							Happy Valentine’s Day, {recipientName}. Thank you for making ordinary days feel like poetry and winter evenings feel like pure sunshine.
						</p>
					</div>

					<div class="mt-space-xl pt-space-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md">
						<div>
							<p class="font-label-sm text-label-sm tracking-wider uppercase text-outline">Eternal Devotion</p>
							<p class="font-headline-md text-headline-md text-primary font-serif italic mt-0.5">
								Forever &amp; unconditionally yours, {senderName} 🌹
							</p>
						</div>
						<div class="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg transform -rotate-12 hover:rotate-0 transition-transform">
							<span class="material-symbols-outlined text-on-primary text-[28px]" style="font-variation-settings: 'FILL' 1;">favorite</span>
						</div>
					</div>
				</article>

				<!-- Interactive Date Night Picker ("Pilih Kencan Valentine Kita!") -->
				<div class="bg-surface-container-lowest/90 backdrop-blur-xl p-space-lg rounded-3xl shadow-lg border border-outline-variant/25">
					<div class="flex flex-wrap items-center justify-between gap-3 mb-4">
						<div>
							<p class="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">Date Night Generator</p>
							<h3 class="font-headline-sm text-headline-sm text-on-surface font-bold">Pilih Rencana Kencan Kita 🌹</h3>
						</div>
						<button
							type="button"
							onclick={spinRandomDate}
							class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-label-md font-bold hover:brightness-95 active:scale-95 transition-all cursor-pointer"
						>
							<span class="material-symbols-outlined text-[16px] {isSpinningDate ? 'animate-spin' : ''}">casino</span>
							<span>Acak Pilihan</span>
						</button>
					</div>

					<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
						{#each DATE_IDEAS as idea (idea.id)}
							<button
								type="button"
								onclick={() => {
									selectedDateId = idea.id;
									dateConfirmed = false;
								}}
								class="p-3.5 rounded-2xl text-left transition-all cursor-pointer border flex items-start gap-3 {selectedDateId === idea.id
									? 'bg-primary-fixed/50 border-primary shadow-sm scale-[1.01]'
									: 'bg-surface-container-low/70 border-transparent hover:bg-surface-container-low'}"
							>
								<div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 {selectedDateId === idea.id ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-primary'}">
									<span class="material-symbols-outlined text-[18px]">{idea.icon}</span>
								</div>
								<div class="min-w-0">
									<p class="font-label-lg text-label-lg font-bold text-on-surface">{idea.title}</p>
									<p class="font-body-sm text-body-sm text-on-surface-variant leading-snug">{idea.desc}</p>
								</div>
							</button>
						{/each}
					</div>

					<div class="flex items-center justify-between gap-3 pt-2 border-t border-outline-variant/20">
						{#if dateConfirmed}
							<p class="text-xs font-bold text-tertiary flex items-center gap-1.5">
								<span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">event_available</span>
								Deal! Kencan terkunci untuk {recipientName} &amp; {senderName} 💖
							</p>
						{:else}
							<p class="text-xs text-on-surface-variant">Pilih salah satu atau acak, lalu kunci jadwalnya!</p>
						{/if}
						<button
							type="button"
							onclick={confirmDateChoice}
							class="px-5 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer shrink-0"
						>
							{dateConfirmed ? 'Terkonfirmasi ✓' : 'Kunci Kencan!'}
						</button>
					</div>
				</div>

				<!-- Interactive Engagement Deck (3 Pillars) -->
				<div class="grid grid-cols-1 md:grid-cols-3 gap-space-md">
					<!-- 1. Tap Back Reaction Card -->
					<div class="bg-surface-container-low p-space-md rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
						<div>
							<div class="flex items-center justify-between mb-2">
								<span class="material-symbols-outlined text-primary text-[22px]" style="font-variation-settings: 'FILL' 1;">volunteer_activism</span>
								<span class="font-label-md text-label-md px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-bold">
									{kissCount} 💖
								</span>
							</div>
							<h3 class="font-headline-sm text-headline-sm text-on-surface">Tap Back</h3>
							<p class="font-body-sm text-body-sm text-on-surface-variant mt-1">
								Send a tactile haptic kiss directly back to {senderName}’s phone tag.
							</p>
						</div>
						<button
							type="button"
							onclick={handleSendKiss}
							class="mt-space-md w-full py-2.5 px-3 rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold shadow-md hover:bg-primary/95 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer {isKissAnimating ? 'scale-105 bg-tertiary' : ''}"
						>
							<span class="material-symbols-outlined text-[16px]">favorite</span>
							<span>Send Sweet Kisses (Tap!)</span>
						</button>
					</div>

					<!-- 2. Wallet & Digital Vault Pass -->
					<div class="bg-surface-container-low p-space-md rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
						<div>
							<div class="flex items-center justify-between mb-2">
								<span class="material-symbols-outlined text-secondary text-[22px]">wallet</span>
								<span class="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold tracking-wider">Pass Ready</span>
							</div>
							<h3 class="font-headline-sm text-headline-sm text-on-surface">Digital Archive</h3>
							<p class="font-body-sm text-body-sm text-on-surface-variant mt-1">
								Pin {senderName}’s polaroid note to your lock screen &amp; smart wallet.
							</p>
						</div>
						<div class="mt-space-md flex flex-col gap-1.5">
							<button
								type="button"
								onclick={() => handleWalletPass('Apple')}
								class="w-full py-2 px-3 rounded-full bg-surface-container-highest text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container shadow-sm active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
							>
								<span class="material-symbols-outlined text-[16px]">phone_iphone</span>
								<span>Apple Wallet Pass</span>
							</button>
							<button
								type="button"
								onclick={() => handleWalletPass('Google')}
								class="w-full py-2 px-3 rounded-full bg-surface-container-highest text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container shadow-sm active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
							>
								<span class="material-symbols-outlined text-[16px]">android</span>
								<span>Google Wallet</span>
							</button>
						</div>
					</div>

					<!-- 3. Daily Romance Widget -->
					<div class="bg-surface-container-low p-space-md rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
						<div>
							<div class="flex items-center justify-between mb-2">
								<span class="material-symbols-outlined text-tertiary text-[22px]" style="font-variation-settings: 'FILL' 1;">notifications_active</span>
								<span class="inline-flex items-center px-2 py-0.5 rounded-full bg-tertiary-container/20 text-on-tertiary-container font-label-sm text-label-sm font-bold">Active</span>
							</div>
							<h3 class="font-headline-sm text-headline-sm text-on-surface">Daily Sweet Reminder</h3>
							<p class="font-body-sm text-body-sm text-on-surface-variant mt-1">
								Syncs a surprise note from this vault to your home screen widget every sunrise.
							</p>
						</div>
						<div class="mt-space-md p-2.5 rounded-xl bg-surface-container-lowest/80 flex items-center gap-2">
							<span class="material-symbols-outlined text-primary text-[18px]">alarm_on</span>
							<span class="font-body-sm text-body-sm font-medium text-on-surface truncate">Next: Tomorrow at 8:00 AM</span>
						</div>
					</div>
				</div>

				<!-- Interactive Love Note Reply Box -->
				<div class="bg-surface-container-lowest/90 backdrop-blur-xl p-space-md sm:p-space-lg rounded-3xl shadow-md border border-outline-variant/25">
					<h3 class="font-headline-sm text-headline-sm text-on-surface font-bold mb-1 flex items-center gap-2">
						<span class="material-symbols-outlined text-primary text-[20px]">edit_note</span>
						Balas Pesan Cinta untuk {senderName}
					</h3>
					<p class="font-body-sm text-body-sm text-on-surface-variant mb-3">
						Tulis pesan balasan singkat untuk disimpan di kapsul kenangan ini (+3 💖):
					</p>
					<form onsubmit={submitReply} class="flex flex-col sm:flex-row gap-2.5">
						<input
							type="text"
							bind:value={replyNote}
							placeholder="Contoh: Love you more! Ketemu nanti malam ya 💖"
							class="flex-1 px-4 py-2.5 rounded-full bg-surface-container-low border border-outline-variant/40 text-sm text-on-surface focus:outline-none focus:border-primary"
						/>
						<button
							type="submit"
							class="px-5 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer shrink-0"
						>
							Kirim Balasan 💌
						</button>
					</form>

					{#if savedReplies.length > 0}
						<div class="mt-4 space-y-2">
							{#each savedReplies as msg}
								<div class="px-4 py-2.5 rounded-2xl bg-primary-fixed/35 border border-primary/15 text-sm text-on-surface flex items-center justify-between gap-2">
									<span>“{msg}”</span>
									<span class="text-[11px] font-bold text-primary shrink-0">— {recipientName} 💖</span>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Docked Romantic Audio Player (Frosted Capsule with Track Switcher) -->
<div class="fixed bottom-6 right-6 z-40 max-w-sm w-[calc(100vw-3rem)] sm:w-auto">
	<div class="bg-surface-container-lowest/90 backdrop-blur-2xl px-4 py-3 rounded-full shadow-[0_16px_40px_-8px_rgba(152,67,76,0.3)] flex items-center justify-between gap-3 border border-outline-variant/20">
		<!-- Spinning Heart / Vinyl Token -->
		<div class="relative flex-shrink-0">
			<div class="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center shadow-md {isMusicPlaying ? 'animate-[spin_6s_linear_infinite]' : ''}">
				<span class="material-symbols-outlined text-on-primary text-[18px]" style="font-variation-settings: 'FILL' 1;">favorite</span>
			</div>
			{#if isMusicPlaying}
				<div class="absolute inset-0 rounded-full ring-2 ring-primary-fixed animate-ping opacity-30"></div>
			{/if}
		</div>

		<!-- Track Information & Animated EQ -->
		<div class="flex flex-col min-w-0 pr-1">
			<div class="flex items-center gap-1.5">
				<p class="font-label-md text-label-md font-bold text-on-surface truncate">{activeTrack.title}</p>
				<span class="font-label-sm text-label-sm text-primary uppercase font-bold tracking-tight">Audio Tag</span>
			</div>
			<div class="flex items-center gap-2 mt-0.5">
				<p class="font-body-sm text-body-sm text-on-surface-variant truncate text-[12px]">
					{isMusicPlaying ? `${activeTrack.artist} • Playing` : 'Paused • Tap to Play'}
				</p>
				{#if isMusicPlaying}
					<div class="flex items-end gap-0.5 h-3">
						<span class="w-0.5 bg-primary rounded-full h-3 animate-pulse"></span>
						<span class="w-0.5 bg-primary rounded-full h-2 animate-pulse" style="animation-delay: 150ms"></span>
						<span class="w-0.5 bg-primary rounded-full h-3.5 animate-pulse" style="animation-delay: 300ms"></span>
						<span class="w-0.5 bg-primary rounded-full h-1.5 animate-pulse" style="animation-delay: 450ms"></span>
					</div>
				{/if}
			</div>
		</div>

		<div class="flex items-center gap-1.5 flex-shrink-0">
			{#if onNextTrack}
				<button
					type="button"
					onclick={onNextTrack}
					aria-label="Ganti Lagu"
					title="Ganti Lagu"
					class="w-8 h-8 rounded-full bg-surface-container-high text-primary flex items-center justify-center hover:bg-surface-container-highest transition-colors cursor-pointer"
				>
					<span class="material-symbols-outlined text-[18px]">skip_next</span>
				</button>
			{/if}
			<button
				type="button"
				onclick={onToggleMusic}
				aria-label="Toggle Playback"
				class="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer"
			>
				<span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">
					{isMusicPlaying ? 'pause' : 'play_arrow'}
				</span>
			</button>
		</div>
	</div>
</div>

<style>
	@keyframes floatUpFade {
		0% {
			transform: translateY(0) scale(1);
			opacity: 1;
		}
		100% {
			transform: translateY(-75px) scale(1.45);
			opacity: 0;
		}
	}
</style>
