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
		onReplayIntro?: () => void;
	}

	let {
		recipientName = 'Chloe',
		senderName = 'Maya',
		formattedTag = 'TK-5005',
		isMusicPlaying = false,
		currentTrackIndex = 0,
		tracks = [
			{ title: 'Sunday Morning Coffee', artist: 'Lo-Fi Wildflower' },
			{ title: 'Wildflower Breeze', artist: 'Acoustic Kalimba' },
			{ title: 'Rainy Window Notes', artist: 'Cozy Piano' }
		],
		onToggleMusic,
		onNextTrack,
		onReplayIntro
	}: Props = $props();

	const activeTrack = $derived(tracks[currentTrackIndex] ?? tracks[0]);

	// 1. Floating Hugs & Wildflowers
	let hugCount = $state(47);
	let isHugAnimating = $state(false);
	let floatingItems = $state<{ id: number; x: number; y: number; dx: number; emoji: string }[]>([]);
	let nextFloatId = 0;

	const COZY_EMOJIS = ['🌿', '💌', '☕', '🌻', '🪻', '💛', '✨'];

	function spawnBurst(x: number, y: number, count = 5, customEmoji?: string) {
		const items = Array.from({ length: count }, () => ({
			id: nextFloatId++,
			x: x + (Math.random() - 0.5) * 70,
			y,
			dx: (Math.random() - 0.5) * 110,
			emoji: customEmoji || COZY_EMOJIS[Math.floor(Math.random() * COZY_EMOJIS.length)]
		}));
		floatingItems = [...floatingItems, ...items];
		const ids = new Set(items.map((i) => i.id));
		setTimeout(() => {
			floatingItems = floatingItems.filter((i) => !ids.has(i.id));
		}, 1150);
	}

	function handleSendHug(e: MouseEvent) {
		hugCount++;
		isHugAnimating = true;
		setTimeout(() => (isHugAnimating = false), 300);
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		spawnBurst(rect.left + rect.width / 2, rect.top, 6);
	}

	// 2. Interactive Mood Check-In + Comfort Treat
	const MOODS = [
		{ id: 'happy', emoji: '🌻', label: 'Lagi Happy', reply: 'Senangnya denger itu! Semoga senyummu awet seharian ini ya!' },
		{ id: 'tired', emoji: '☕', label: 'Capek Dikit', reply: 'Tarik napas dulu yuk. Jangan lupa minum air & istirahat sebentar!' },
		{ id: 'hug', emoji: '🫂', label: 'Butuh Peluk', reply: 'Peluk virtual paling hangat meluncur buat kamu sekarang juga! 💛' },
		{ id: 'miss', emoji: '💌', label: 'Kangen Ngobrol', reply: 'Ayo ketemuan minggu ini, aku traktir kopi favoritmu!' }
	];
	let selectedMood = $state<string | null>(null);
	const activeMoodObj = $derived(MOODS.find((m) => m.id === selectedMood) ?? null);

	// 3. Jar of Little Reasons (Stoples Alasan Kecil)
	const LITTLE_REASONS = [
		'Caramu tertawa selalu berhasil bikin hari yang berat terasa jauh lebih ringan.',
		'Terima kasih sudah selalu menjadi pendengar terbaik tanpa pernah menghakimi.',
		'Energi positifmu itu menular—berada di dekatmu selalu terasa seperti pulang.',
		'Hal-hal kecil yang kamu lakukan diam-diam sangat berarti buat orang di sekitarmu.',
		'Kamu tidak butuh hari spesial untuk dirayakan—kehadiranmu sendiri sudah jadi hadiah.'
	];
	let reasonIndex = $state(0);
	let jarPullCount = $state(1);

	function pullReasonFromJar(e: MouseEvent) {
		reasonIndex = (reasonIndex + 1) % LITTLE_REASONS.length;
		jarPullCount++;
		spawnBurst(e.clientX, e.clientY, 5, '🪻');
	}

	// 4. Interactive Polaroid Flip & Reactions
	let flippedCards = $state<{ first: boolean; second: boolean }>({ first: false, second: false });
	let cardReactions = $state<{ first: string; second: string }>({ first: '🌻', second: '☕' });
	const REACTION_POOL = ['🌻', '☕', '💛', '🥹', '🌿', '✨'];

	function cycleReaction(which: 'first' | 'second', e: MouseEvent) {
		e.stopPropagation();
		const idx = REACTION_POOL.indexOf(cardReactions[which]);
		cardReactions[which] = REACTION_POOL[(idx + 1) % REACTION_POOL.length];
		spawnBurst(e.clientX, e.clientY, 3, cardReactions[which]);
	}

	// 5. Interactive 14-Second Voice Memo Simulator
	let isVoicePlaying = $state(false);
	let voiceSeconds = $state(0);
	let voiceTimer: number | null = null;

	const VOICE_CAPTIONS = [
		'“Hai! Lagi ngapain nih?”',
		'“Cuma mau bilang makasih udah jadi teman terbaik…”',
		'“Jangan lupa senyum hari ini ya! 💛”'
	];
	const activeCaption = $derived(
		voiceSeconds < 5 ? VOICE_CAPTIONS[0] : voiceSeconds < 10 ? VOICE_CAPTIONS[1] : VOICE_CAPTIONS[2]
	);

	function toggleVoiceMemo() {
		if (isVoicePlaying) {
			isVoicePlaying = false;
			if (voiceTimer) clearInterval(voiceTimer);
		} else {
			isVoicePlaying = true;
			if (voiceSeconds >= 14) voiceSeconds = 0;
			voiceTimer = window.setInterval(() => {
				voiceSeconds++;
				if (voiceSeconds >= 14) {
					isVoicePlaying = false;
					if (voiceTimer) clearInterval(voiceTimer);
				}
			}, 1000);
		}
	}

	// 6. Scratch-Off Spontaneous Treat
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
		grad.addColorStop(0, '#7e69ab');
		grad.addColorStop(0.5, '#a795d1');
		grad.addColorStop(1, '#685588');
		ctx.globalCompositeOperation = 'source-over';
		ctx.fillStyle = grad;
		ctx.fillRect(0, 0, w, h);

		ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
		for (let i = 0; i < 24; i++) {
			ctx.beginPath();
			ctx.arc((i * 37) % w, (i * 23) % h, 2, 0, Math.PI * 2);
			ctx.fill();
		}

		ctx.fillStyle = '#ffffff';
		ctx.font = '700 14px "Plus Jakarta Sans", sans-serif';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText('✨ Gosok untuk Kupon Kopi Spontan ✨', w / 2, h / 2);
	}

	onMount(() => {
		initScratchCard();
		return () => {
			if (voiceTimer) clearInterval(voiceTimer);
		};
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
			spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 10, '☕');
		}
	}

	function resetScratchCard() {
		scratchRevealed = false;
		scratchProgress = 0;
		initScratchCard();
	}

	// 7. Spontaneous Reply Note
	let replyNote = $state('');
	let savedReplies = $state<string[]>([]);

	function submitReply(e: SubmitEvent) {
		e.preventDefault();
		const trimmed = replyNote.trim();
		if (!trimmed) return;
		savedReplies = [trimmed, ...savedReplies];
		replyNote = '';
		hugCount += 2;
	}

	// 8. Wallet Toast
	let walletToast = $state<string | null>(null);
	function handleWalletPass(platform: 'Apple' | 'Google') {
		walletToast = `${platform} Wallet Pass untuk ${recipientName} siap disimpan!`;
		setTimeout(() => (walletToast = null), 2800);
	}
</script>

<!-- Floating Cozy Emojis -->
{#each floatingItems as item (item.id)}
	<span
		class="fixed pointer-events-none z-50 text-2xl animate-[cozyFloat_1.15s_ease-out_forwards]"
		style="left: {item.x}px; top: {item.y}px; --dx: {item.dx}px;"
		aria-hidden="true"
	>
		{item.emoji}
	</span>
{/each}

<!-- Wallet Toast -->
{#if walletToast}
	<div class="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-[#2e2442] text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-bounce">
		<span class="material-symbols-outlined text-[16px] text-[#a7f3d0]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
		<span>{walletToast}</span>
	</div>
{/if}

<!-- Wildflower & Lavender Pastel Theme -->
<div class="relative min-h-screen w-full bg-gradient-to-b from-[#faf7ff] via-[#f6f2fb] to-[#f2f7f4] text-[#282135] pb-28 overflow-x-hidden selection:bg-[#d9c2fd] selection:text-[#231141]">
	<!-- Ambient Lavender & Sage Glows -->
	<div class="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
		<div class="absolute -top-32 -left-24 w-[460px] h-[460px] rounded-full bg-[#d9c2fd]/40 blur-[120px]"></div>
		<div class="absolute top-1/3 -right-24 w-[440px] h-[440px] rounded-full bg-[#bbf7d0]/35 blur-[120px]"></div>
		<div class="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full bg-[#fde68a]/30 blur-[130px]"></div>
	</div>

	<div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
		<!-- Top NFC Status Bar -->
		<div class="flex flex-wrap items-center justify-between gap-3 mb-6">
			<div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-[#e3d9f5] text-xs font-semibold text-[#4e4266] shadow-sm">
				<span class="flex h-2 w-2 relative">
					<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#685588] opacity-75"></span>
					<span class="relative inline-flex rounded-full h-2 w-2 bg-[#685588]"></span>
				</span>
				<span>Verified NFC Keepsake • #{formattedTag}</span>
				<span class="opacity-40">•</span>
				<span class="text-[#1f6b53] font-bold uppercase tracking-wider">Spontaneous Seal</span>
			</div>

			<div class="flex items-center gap-2">
				<span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#ecdcff] text-[#453166] text-xs font-semibold">
					<span class="material-symbols-outlined text-[15px] text-[#685588]" style="font-variation-settings: 'FILL' 1;">local_florist</span>
					Just Because Edition • Dari {senderName}
				</span>
				{#if onReplayIntro}
					<button
						type="button"
						onclick={onReplayIntro}
						class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/85 hover:bg-white text-[#685588] text-xs font-semibold transition-colors cursor-pointer border border-[#e3d9f5] shadow-sm"
						title="Buka Amplop Lagi"
					>
						<span class="material-symbols-outlined text-[14px]">replay</span>
						<span class="hidden sm:inline">Replay</span>
					</button>
				{/if}
			</div>
		</div>

		<!-- Hero Banner -->
		<section class="relative mb-8 rounded-3xl overflow-hidden bg-white/90 backdrop-blur-xl border border-[#e6def5] shadow-[0_20px_50px_-12px_rgba(104,85,136,0.16)]">
			<div class="relative h-52 sm:h-68 w-full overflow-hidden">
				<img
					src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1400&q=80"
					alt="Warm wildflower meadow sunshine"
					class="w-full h-full object-cover object-center"
				/>
				<div class="absolute inset-0 bg-gradient-to-t from-white via-white/35 to-transparent"></div>
			</div>

			<div class="relative -mt-16 px-6 pb-8 text-center flex flex-col items-center">
				<div class="flex flex-wrap items-center justify-center gap-2 mb-3">
					<span class="px-3 py-1 rounded-full bg-[#e6f7ef] text-[#145c43] text-xs font-bold shadow-sm">
						🌿 Just Because
					</span>
					<span class="px-3 py-1 rounded-full bg-[#ecdcff] text-[#4c3770] text-xs font-bold shadow-sm">
						💌 Tanpa Alasan Khusus
					</span>
					<span class="px-3 py-1 rounded-full bg-[#fef3c7] text-[#854d0e] text-xs font-bold shadow-sm">
						☕ Everyday Magic
					</span>
				</div>

				<h1 class="font-headline-lg text-3xl sm:text-5xl font-normal text-[#282135] tracking-tight leading-tight mb-2">
					Just Because You're Amazing, <span class="italic text-[#685588]">{recipientName}</span>! 🌿💌
				</h1>
				<p class="text-[#5f5570] text-sm sm:text-lg max-w-2xl mb-5">
					Tidak perlu menunggu hari spesial—ini pengingat hangat dari <strong class="text-[#685588]">{senderName}</strong> bahwa kamu selalu berarti setiap hari.
				</p>

				<button
					type="button"
					onclick={handleSendHug}
					class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#685588] to-[#836ba8] text-white font-bold text-sm shadow-lg shadow-[#685588]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer {isHugAnimating ? 'scale-105' : ''}"
				>
					<span>🫂</span>
					<span>Kirim Peluk Hangat ke {senderName} ({hugCount})</span>
				</button>
			</div>
		</section>

		<!-- Main 12-Col Grid -->
		<div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
			<!-- LEFT COLUMN (5 cols): Polaroids, Voice Memo, Scratch Coupon -->
			<div class="lg:col-span-5 flex flex-col gap-6">
				<!-- 1. Interactive Flip Polaroids -->
				<div class="relative pt-2 pb-6 flex flex-col items-center">
					<p class="text-[11px] uppercase tracking-widest text-[#685588] font-bold mb-4 flex items-center gap-1.5">
						<span class="material-symbols-outlined text-[15px]">touch_app</span>
						Ketuk Foto untuk Membalik Kenangan
					</p>

					<div class="relative w-full flex items-center justify-center min-h-[365px]">
						<div class="absolute inset-4 bg-gradient-to-tr from-[#d9c2fd]/40 via-[#fde68a]/30 to-[#bbf7d0]/40 rounded-3xl blur-2xl -z-10"></div>

						<!-- Bottom Polaroid -->
						<button
							type="button"
							onclick={() => (flippedCards.first = !flippedCards.first)}
							class="text-left absolute w-[86%] sm:w-[320px] aspect-[4/5] bg-white p-3.5 pb-6 rounded-2xl shadow-xl border border-[#e8e1f5] transform rotate-3 translate-x-3 translate-y-6 transition-all duration-500 hover:rotate-1 hover:translate-y-4 cursor-pointer"
						>
							{#if !flippedCards.first}
								<div class="relative w-full aspect-square rounded-lg overflow-hidden bg-[#f4effa] mb-3">
									<img
										src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
										alt="Spontaneous road trip sunshine"
										class="w-full h-full object-cover"
									/>
									<span class="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-white/90 text-[10px] font-bold text-[#4e4266]">
										Memory 02
									</span>
								</div>
								<p class="font-headline-md text-base italic text-center text-[#282135]">
									Spontaneous Road Trip Sunshine 🌻
								</p>
							{:else}
								<div class="w-full h-full rounded-xl bg-[#faf7ff] border border-[#e3d9f5] p-5 flex flex-col items-center justify-center text-center">
									<span class="text-3xl mb-3">🌻🚗</span>
									<p class="font-headline-sm text-sm font-bold text-[#685588] mb-2">Momen Mendadak</p>
									<p class="text-xs text-[#5f5570] leading-relaxed">
										“Rencana yang tidak pernah direncanakan selalu jadi kenangan yang paling seru!”
									</p>
									<span class="mt-4 text-[11px] font-bold text-[#685588] uppercase">Ketuk untuk kembali</span>
								</div>
							{/if}
						</button>

						<!-- Top Polaroid -->
						<div
							role="button"
							tabindex="0"
							onclick={() => (flippedCards.second = !flippedCards.second)}
							onkeydown={(e) => e.key === 'Enter' && (flippedCards.second = !flippedCards.second)}
							class="relative w-[92%] sm:w-[340px] aspect-[4/5] bg-white p-4 pb-7 rounded-2xl shadow-2xl border border-[#e8e1f5] transform -rotate-2 hover:rotate-0 transition-all duration-500 z-10 cursor-pointer"
						>
							{#if !flippedCards.second}
								<div class="relative w-full aspect-square rounded-xl overflow-hidden bg-[#f4effa] mb-3.5 shadow-inner">
									<img
										src="https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80"
										alt="Cozy coffee laughs"
										class="w-full h-full object-cover"
									/>
									<div class="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md flex items-center gap-1 shadow-sm">
										<span class="material-symbols-outlined text-[#685588] text-[14px]" style="font-variation-settings: 'FILL' 1;">favorite</span>
										<span class="text-[10px] font-bold text-[#282135]">Primary Keepsake</span>
									</div>
									<button
										type="button"
										onclick={(e) => cycleReaction('second', e)}
										class="absolute bottom-2.5 right-2.5 w-9 h-9 rounded-full bg-white/95 shadow-md flex items-center justify-center text-lg hover:scale-110 active:scale-90 transition-transform cursor-pointer"
										title="Ganti Reaksi"
									>
										{cardReactions.second}
									</button>
								</div>
								<div class="text-center">
									<p class="font-headline-md text-lg italic text-[#282135] leading-tight">
										Coffee Laughs &amp; Rainy Window ☕💛
									</p>
									<p class="text-[11px] font-semibold text-[#7b708f] mt-1">
										Ketuk foto untuk baca catatan di baliknya
									</p>
								</div>
							{:else}
								<div class="w-full h-full rounded-xl bg-gradient-to-br from-[#faf7ff] to-[#f2f7f4] border border-[#d9c2fd] p-6 flex flex-col items-center justify-center text-center">
									<span class="text-4xl mb-3">☕💌</span>
									<p class="font-headline-md text-lg font-bold text-[#685588] mb-2">Catatan Kecil untuk {recipientName}</p>
									<p class="text-sm text-[#4e4266] leading-relaxed">
										Ngobrol ngalor-ngidul sambil minum kopi sama kamu itu terapi paling ampuh!
									</p>
									<span class="mt-5 text-[11px] font-bold text-[#685588] uppercase">Ketuk untuk melihat foto</span>
								</div>
							{/if}
						</div>
					</div>
				</div>

				<!-- 2. Interactive 14-Sec Voice Memo Capsule -->
				<div class="bg-white/90 backdrop-blur-xl p-5 rounded-3xl shadow-md border border-[#e6def5]">
					<div class="flex items-center gap-3.5">
						<button
							type="button"
							onclick={toggleVoiceMemo}
							class="w-12 h-12 rounded-full bg-[#685588] hover:bg-[#564573] flex items-center justify-center text-white shadow-lg active:scale-95 transition-all shrink-0 cursor-pointer"
							aria-label={isVoicePlaying ? 'Jeda Voice Memo' : 'Putar Voice Memo'}
						>
							<span class="material-symbols-outlined text-[24px]" style="font-variation-settings: 'FILL' 1;">
								{isVoicePlaying ? 'pause' : 'play_arrow'}
							</span>
						</button>
						<div class="flex-1 min-w-0">
							<div class="flex items-center justify-between">
								<p class="text-sm font-bold text-[#282135] truncate">Voice Memo dari {senderName}</p>
								<span class="text-xs font-mono font-semibold text-[#685588]">0:{voiceSeconds.toString().padStart(2, '0')} / 0:14</span>
							</div>
							<div class="flex items-center gap-1 h-5 mt-1.5">
								{#each [12, 20, 10, 22, 16, 20, 12, 24, 16, 10, 18, 14, 20, 10, 16] as h, idx}
									<span
										class="w-1 rounded-full transition-all duration-200 {isVoicePlaying && idx % 2 === voiceSeconds % 2 ? 'bg-[#1f6b53]' : 'bg-[#a795d1]'}"
										style="height: {isVoicePlaying ? Math.max(6, ((h + voiceSeconds * 3) % 22) + 4) : h}px;"
									></span>
								{/each}
							</div>
						</div>
					</div>
					<p class="mt-3 px-3.5 py-2 rounded-2xl bg-[#faf7ff] border border-[#e8e1f5] text-xs italic text-[#4e4266] text-center">
						{activeCaption}
					</p>
				</div>

				<!-- 3. Scratch-Off Spontaneous Coupon -->
				<div class="bg-white/90 backdrop-blur-xl p-5 rounded-3xl shadow-md border border-[#e6def5]">
					<div class="flex items-center justify-between mb-3">
						<div class="flex items-center gap-2">
							<span class="material-symbols-outlined text-[#685588] text-[20px]" style="font-variation-settings: 'FILL' 1;">local_cafe</span>
							<h3 class="font-headline-sm text-base font-bold text-[#282135]">Kupon Traktir Spontan</h3>
						</div>
						{#if scratchRevealed}
							<button
								type="button"
								onclick={resetScratchCard}
								class="text-xs font-semibold text-[#685588] hover:underline cursor-pointer"
							>
								Reset
							</button>
						{:else}
							<span class="text-[11px] font-semibold text-[#7b708f]">{scratchProgress}%</span>
						{/if}
					</div>

					<div class="relative w-full h-28 rounded-2xl overflow-hidden border border-[#d9c2fd] bg-gradient-to-r from-[#faf7ff] via-white to-[#f2f7f4] flex flex-col items-center justify-center text-center p-4 select-none">
						<p class="text-[10px] uppercase tracking-widest text-[#685588] font-bold mb-1">
							🥐 Spontaneous Treat Pass
						</p>
						<p class="font-headline-sm text-base font-bold text-[#282135]">
							1x Kopi + Pastry Pilihanmu Gratis! ☕🥐
						</p>
						<p class="text-[11px] text-[#5f5570] mt-0.5">Klaim kapan pun kamu mau ke {senderName}</p>

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
			</div>

			<!-- RIGHT COLUMN (7 cols): Letter, Jar of Little Reasons, Mood Check-in, Reply -->
			<div class="lg:col-span-7 flex flex-col gap-6">
				<!-- 1. Spontaneous Appreciation Letter -->
				<article class="relative bg-white/95 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-xl border border-[#e6def5] overflow-hidden">
					<div class="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-[#f0ebf8]">
						<span class="px-3 py-1 rounded-full bg-[#ecdcff] text-[#4c3770] text-xs font-bold">
							Spontaneous Note • Dari {senderName}
						</span>
						<span class="text-xs font-semibold text-[#1f6b53] flex items-center gap-1">
							<span class="material-symbols-outlined text-[15px]" style="font-variation-settings: 'FILL' 1;">verified</span>
							Tag #{formattedTag}
						</span>
					</div>

					<h2 class="font-headline-lg text-2xl sm:text-4xl text-[#282135] font-normal leading-tight mb-4">
						Hai {recipientName}, Cuma Mau Bilang Makasih! 🌿
					</h2>

					<div class="space-y-4 text-[#524863] text-sm sm:text-base leading-relaxed">
						<p>
							Tidak ada ulang tahun, tidak ada perayaan besar di kalender—aku cuma kepikiran kamu hari ini dan merasa dunia perlu tahu betapa bersyukurnya aku mengenalmu.
						</p>
						<p class="font-headline-md text-lg sm:text-xl italic text-[#685588] leading-snug bg-[#faf7ff] p-4 rounded-2xl border-l-4 border-[#a795d1]">
							“Kamu punya cara ajaib bikin hari yang biasa-biasa saja terasa jauh lebih hangat dan penuh warna.”
						</p>
						<p>
							Simpan tag kecil ini di tas atau meja kerjamu. Kapan pun harimu terasa berat, tempelkan ponselmu dan ingat bahwa ada seseorang di sini yang selalu mendukungmu.
						</p>
					</div>

					<div class="mt-6 pt-4 border-t border-[#f0ebf8] flex flex-wrap items-center justify-between gap-3">
						<div>
							<p class="text-[11px] uppercase tracking-wider text-[#7b708f] font-bold">Selalu ada untukmu,</p>
							<p class="font-headline-md text-xl italic text-[#685588] font-medium">{senderName} 🪻</p>
						</div>
						<div class="flex gap-2">
							<button
								type="button"
								onclick={() => handleWalletPass('Apple')}
								class="px-3.5 py-2 rounded-full bg-[#282135] text-white text-xs font-bold hover:opacity-90 cursor-pointer"
							>
								Apple Wallet
							</button>
							<button
								type="button"
								onclick={() => handleWalletPass('Google')}
								class="px-3.5 py-2 rounded-full bg-[#ecdcff] text-[#4c3770] text-xs font-bold hover:bg-[#dfc8ff] cursor-pointer"
							>
								Google Wallet
							</button>
						</div>
					</div>
				</article>

				<!-- 2. Interactive Jar of Little Reasons (Stoples Alasan Kecil) -->
				<div class="bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-md border border-[#e6def5]">
					<div class="flex flex-wrap items-center justify-between gap-3 mb-4">
						<div>
							<p class="text-[11px] uppercase tracking-widest text-[#685588] font-bold">Jar of Little Reasons</p>
							<h3 class="font-headline-sm text-lg font-bold text-[#282135]">Stoples Apresiasi Kecil 🪻</h3>
						</div>
						<button
							type="button"
							onclick={pullReasonFromJar}
							class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#685588] hover:bg-[#564573] text-white text-xs font-bold shadow-md active:scale-95 transition-all cursor-pointer"
						>
							<span class="material-symbols-outlined text-[16px]">auto_awesome</span>
							<span>Ambil Catatan ({jarPullCount}/{LITTLE_REASONS.length})</span>
						</button>
					</div>

					<div class="p-5 rounded-2xl bg-gradient-to-br from-[#faf7ff] to-[#f2f7f4] border border-[#d9c2fd] text-center">
						<p class="font-headline-md text-lg italic text-[#282135] leading-relaxed">
							“{LITTLE_REASONS[reasonIndex]}”
						</p>
					</div>
				</div>

				<!-- 3. Interactive Mood Check-In -->
				<div class="bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-md border border-[#e6def5]">
					<h3 class="font-headline-sm text-lg font-bold text-[#282135] mb-1">Gimana Perasaanmu Hari Ini, {recipientName}?</h3>
					<p class="text-xs text-[#5f5570] mb-4">Ketuk suasana hatimu sekarang untuk mendapat balasan instan dari {senderName}:</p>

					<div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
						{#each MOODS as mood (mood.id)}
							<button
								type="button"
								onclick={(e) => {
									selectedMood = mood.id;
									spawnBurst(e.clientX, e.clientY, 4, mood.emoji);
								}}
								class="p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 {selectedMood === mood.id
									? 'bg-[#ecdcff]/70 border-[#685588] shadow-sm scale-[1.02]'
									: 'bg-[#faf7ff] border-[#e8e1f5] hover:bg-[#f2ebfc]'}"
							>
								<span class="text-2xl">{mood.emoji}</span>
								<span class="text-xs font-bold text-[#282135]">{mood.label}</span>
							</button>
						{/each}
					</div>

					{#if activeMoodObj}
						<div class="mt-4 p-3.5 rounded-2xl bg-[#e6f7ef] border border-[#b6e6cf] text-xs font-semibold text-[#145c43] flex items-center gap-2">
							<span class="text-lg">{activeMoodObj.emoji}</span>
							<span>{activeMoodObj.reply}</span>
						</div>
					{/if}
				</div>

				<!-- 4. Spontaneous Reply Box -->
				<div class="bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-md border border-[#e6def5]">
					<h3 class="font-headline-sm text-lg font-bold text-[#282135] mb-1 flex items-center gap-2">
						<span class="material-symbols-outlined text-[#685588] text-[20px]">edit_note</span>
						Balas Catatan ke {senderName}
					</h3>
					<p class="text-xs text-[#5f5570] mb-3">Tulis balasan singkat untuk disimpan di kapsul kenangan ini (+2 🫂):</p>

					<form onsubmit={submitReply} class="flex flex-col sm:flex-row gap-2.5">
						<input
							type="text"
							bind:value={replyNote}
							placeholder="Contoh: Makasih banyak!! Kamu bikin hariku jauh lebih baik 💛"
							class="flex-1 px-4 py-2.5 rounded-full bg-[#faf7ff] border border-[#e3d9f5] text-sm text-[#282135] focus:outline-none focus:border-[#685588]"
						/>
						<button
							type="submit"
							class="px-5 py-2.5 rounded-full bg-[#685588] hover:bg-[#564573] text-white font-bold text-xs shadow-sm active:scale-95 transition-all cursor-pointer shrink-0"
						>
							Kirim Balasan 💌
						</button>
					</form>

					{#if savedReplies.length > 0}
						<div class="mt-4 space-y-2">
							{#each savedReplies as msg}
								<div class="px-4 py-2.5 rounded-2xl bg-[#faf7ff] border border-[#d9c2fd] text-sm text-[#282135] flex items-center justify-between gap-2">
									<span>“{msg}”</span>
									<span class="text-[11px] font-bold text-[#685588] shrink-0">— {recipientName} 🌿</span>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Floating Docked Music Controller -->
<div class="fixed bottom-6 right-6 z-40 max-w-sm w-[calc(100vw-3rem)] sm:w-auto">
	<div class="bg-white/95 backdrop-blur-2xl px-4 py-3 rounded-full shadow-[0_16px_40px_-8px_rgba(104,85,136,0.28)] flex items-center justify-between gap-3 border border-[#e3d9f5]">
		<div class="relative flex-shrink-0">
			<div class="w-10 h-10 rounded-full bg-gradient-to-tr from-[#685588] to-[#a795d1] flex items-center justify-center shadow-md {isMusicPlaying ? 'animate-[spin_6s_linear_infinite]' : ''}">
				<span class="material-symbols-outlined text-white text-[18px]" style="font-variation-settings: 'FILL' 1;">music_note</span>
			</div>
			{#if isMusicPlaying}
				<div class="absolute inset-0 rounded-full ring-2 ring-[#d9c2fd] animate-ping opacity-40"></div>
			{/if}
		</div>

		<div class="flex flex-col min-w-0 pr-1">
			<div class="flex items-center gap-1.5">
				<p class="text-xs font-bold text-[#282135] truncate">{activeTrack.title}</p>
				<span class="text-[10px] text-[#685588] uppercase font-bold">Lo-Fi</span>
			</div>
			<p class="text-[11px] text-[#5f5570] truncate">
				{isMusicPlaying ? `${activeTrack.artist} • Playing` : 'Paused • Tap to Play'}
			</p>
		</div>

		<div class="flex items-center gap-1.5 flex-shrink-0">
			{#if onNextTrack}
				<button
					type="button"
					onclick={onNextTrack}
					aria-label="Ganti Lagu"
					class="w-8 h-8 rounded-full bg-[#faf7ff] text-[#685588] flex items-center justify-center hover:bg-[#ecdcff] transition-colors cursor-pointer"
				>
					<span class="material-symbols-outlined text-[18px]">skip_next</span>
				</button>
			{/if}
			<button
				type="button"
				onclick={onToggleMusic}
				aria-label="Toggle Playback"
				class="w-9 h-9 rounded-full bg-[#685588] text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer"
			>
				<span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">
					{isMusicPlaying ? 'pause' : 'play_arrow'}
				</span>
			</button>
		</div>
	</div>
</div>

<style>
	@keyframes cozyFloat {
		0% {
			transform: translate(-50%, 0) scale(0.9);
			opacity: 1;
		}
		100% {
			transform: translate(calc(-50% + var(--dx)), -140px) scale(1.4);
			opacity: 0;
		}
	}
</style>
