<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		recipientName: string;
		senderName?: string;
		formattedTag: string;
		weddingDateLabel?: string;
		isMusicPlaying?: boolean;
		currentTrackIndex?: number;
		tracks?: { title: string; artist: string }[];
		onToggleMusic?: () => void;
		onNextTrack?: () => void;
		onReplayIntro?: () => void;
	}

	let {
		recipientName = 'Clara & Lucas',
		senderName = 'Elena',
		formattedTag = 'TK-4004',
		weddingDateLabel = '12 September 2026',
		isMusicPlaying = false,
		currentTrackIndex = 0,
		tracks = [
			{ title: 'Canon in D (Celesta Harp)', artist: 'Altar Strings' },
			{ title: 'A Thousand Years', artist: 'Gardenia Quartet' },
			{ title: 'Golden Vows Waltz', artist: 'Champagne Orchestra' }
		],
		onToggleMusic,
		onNextTrack,
		onReplayIntro
	}: Props = $props();

	const activeTrack = $derived(tracks[currentTrackIndex] ?? tracks[0]);

	// 1. Floating Wedding Petals & Blessings Burst
	let blessingCount = $state(128);
	let isBlessingAnimating = $state(false);
	let floatingItems = $state<{ id: number; x: number; y: number; dx: number; emoji: string }[]>([]);
	let nextFloatId = 0;

	const WEDDING_EMOJIS = ['💍', '🕊️', '🤍', '💐', '🥂', '✨', '🌸'];

	function spawnBurst(x: number, y: number, count = 6, customEmoji?: string) {
		const items = Array.from({ length: count }, () => ({
			id: nextFloatId++,
			x: x + (Math.random() - 0.5) * 70,
			y,
			dx: (Math.random() - 0.5) * 110,
			emoji: customEmoji || WEDDING_EMOJIS[Math.floor(Math.random() * WEDDING_EMOJIS.length)]
		}));
		floatingItems = [...floatingItems, ...items];
		const ids = new Set(items.map((i) => i.id));
		setTimeout(() => {
			floatingItems = floatingItems.filter((i) => !ids.has(i.id));
		}, 1150);
	}

	function handleSendBlessing(e: MouseEvent) {
		blessingCount++;
		isBlessingAnimating = true;
		setTimeout(() => (isBlessingAnimating = false), 300);
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		spawnBurst(rect.left + rect.width / 2, rect.top, 6);
	}

	// 2. Interactive Polaroid Flip & Reactions
	let flippedPolaroids = $state<{ first: boolean; second: boolean }>({ first: false, second: false });
	let polaroidReactions = $state<{ first: string; second: string }>({ first: '🤍', second: '💍' });
	const REACTION_POOL = ['🤍', '💍', '🕊️', '🥹', '🥂', '✨'];

	function cycleReaction(which: 'first' | 'second', e: MouseEvent) {
		e.stopPropagation();
		const idx = REACTION_POOL.indexOf(polaroidReactions[which]);
		polaroidReactions[which] = REACTION_POOL[(idx + 1) % REACTION_POOL.length];
		spawnBurst(e.clientX, e.clientY, 3, polaroidReactions[which]);
	}

	// 3. Interactive Prayer & Blessing Clauses from Gift Giver (Tap to say "Amiin")
	let sealedVows = $state<Record<number, boolean>>({});
	const VOW_CLAUSES = [
		'Semoga rumah tangga kalian selalu dipenuhi tawa hangat, kesabaran, dan kasih sayang yang tak pernah pudar.',
		'Semoga setiap langkah bersama menjadi berkah, dan selalu menemukan jalan pulang satu sama lain.',
		'Semoga langgeng, rukun, dan bahagia bersama hingga menua nanti.'
	];

	function toggleVowSeal(idx: number, e: MouseEvent) {
		sealedVows = { ...sealedVows, [idx]: !sealedVows[idx] };
		if (sealedVows[idx]) {
			blessingCount++;
			spawnBurst(e.clientX, e.clientY, 4, '🕊️');
		}
	}

	// 4. Interactive Bouquet Toss Mini-Game
	const BOUQUET_OUTCOMES = [
		{ title: 'Kamu Menangkap Buketnya! 💐', desc: 'Pertanda kebahagiaan besar dan cinta tulus segera menghampirimu!' },
		{ title: 'Kelopak Mawar Emas! 🌸', desc: 'Restu dan keberuntungan menyertai setiap langkahmu tahun ini.' },
		{ title: 'Siap Menyusul ke Pelaminan! 💍', desc: 'Aura romantis sedang berpihak padamu—siap-siap terima kabar baik!' },
		{ title: 'Persahabatan Abadi! 🥂', desc: 'Ikatan hangat dengan orang-orang tersayang makin erat selamanya.' }
	];
	let bouquetResult = $state<{ title: string; desc: string } | null>(null);
	let isTossingBouquet = $state(false);
	let bouquetTossCount = $state(0);

	function tossBouquet(e: MouseEvent) {
		if (isTossingBouquet) return;
		isTossingBouquet = true;
		bouquetTossCount++;
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		spawnBurst(rect.left + rect.width / 2, rect.top, 9, '💐');
		setTimeout(() => {
			bouquetResult = BOUQUET_OUTCOMES[Math.floor(Math.random() * BOUQUET_OUTCOMES.length)];
			isTossingBouquet = false;
		}, 550);
	}

	// 5. Interactive Virtual Toast & First Dance Song Voter
	const TOAST_DRINKS = [
		{ id: 'champagne', emoji: '🥂', name: 'Golden Champagne' },
		{ id: 'rose', emoji: '🍷', name: 'Sparkling Rosé' },
		{ id: 'tea', emoji: '🍵', name: 'White Gardenia Tea' }
	];
	let selectedDrink = $state('champagne');
	let toastCheersCount = $state(36);

	function raiseToast(e: MouseEvent) {
		toastCheersCount++;
		const drink = TOAST_DRINKS.find((d) => d.id === selectedDrink);
		spawnBurst(e.clientX, e.clientY, 5, drink?.emoji || '🥂');
	}

	const GIFT_TREATS = [
		{ id: 'dinner', title: 'Traktir Makan Malam Berdua 🍽️', votes: 1 },
		{ id: 'brunch', title: 'Voucher Kopi & Brunch Akhir Pekan ☕', votes: 0 },
		{ id: 'photo', title: 'Cetak Album Foto Post-Wedding 📸', votes: 0 }
	];
	let songVotes = $state<Record<string, number>>({ dinner: 1, brunch: 0, photo: 0 });
	let userVotedSong = $state<string | null>('dinner');

	function voteSong(id: string, e: MouseEvent) {
		if (userVotedSong === id) return;
		if (userVotedSong) {
			songVotes[userVotedSong] = Math.max(0, songVotes[userVotedSong] - 1);
		}
		songVotes[id] = (songVotes[id] ?? 0) + 1;
		userVotedSong = id;
		spawnBurst(e.clientX, e.clientY, 4, '🎁');
	}

	// 6. Scratch-Off Honeymoon Surprise
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
		grad.addColorStop(0, '#c29b61');
		grad.addColorStop(0.5, '#e5cc99');
		grad.addColorStop(1, '#b68b4c');
		ctx.globalCompositeOperation = 'source-over';
		ctx.fillStyle = grad;
		ctx.fillRect(0, 0, w, h);

		ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
		for (let i = 0; i < 28; i++) {
			ctx.beginPath();
			ctx.arc((i * 39) % w, (i * 25) % h, 2, 0, Math.PI * 2);
			ctx.fill();
		}

		ctx.fillStyle = '#3b2d18';
		ctx.font = '700 14px "Plus Jakarta Sans", sans-serif';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText('✨ Gosok untuk Kejutan Bulan Madu ✨', w / 2, h / 2);
	}

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
			spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 10, '✈️');
		}
	}

	function resetScratchCard() {
		scratchRevealed = false;
		scratchProgress = 0;
		initScratchCard();
	}

	// 7. Interactive Newlyweds Thank-You Reply to Gift Giver
	let replyFrom = $state<'berdua' | 'bride' | 'groom'>('berdua');
	let guestMessage = $state('');
	let guestBadge = $state('🤍');
	let blessingsWall = $state<{ name: string; message: string; badge: string }[]>([
		{
			name: 'Clara & Lucas',
			message: 'Makasih banyak ya sudah datang dan kasih kado digital yang manis banget ini!',
			badge: '💍'
		}
	]);

	function submitBlessing(e: SubmitEvent) {
		e.preventDefault();
		const msg = guestMessage.trim();
		if (!msg) return;
		const senderLabel =
			replyFrom === 'bride'
				? 'Mempelai Wanita 👰'
				: replyFrom === 'groom'
					? 'Mempelai Pria 🤵'
					: `${recipientName} 💍`;
		blessingsWall = [{ name: senderLabel, message: msg, badge: guestBadge }, ...blessingsWall];
		guestMessage = '';
		blessingCount += 3;
	}

	// 8. Live Paper Anniversary Countdown
	let countdown = $state({ days: 0, hours: 0, mins: 0, secs: 0 });
	let countdownTimer: number | null = null;

	function updateCountdown() {
		const now = new Date();
		const target = new Date(now.getFullYear(), 8, 12); // Sept 12
		if (target <= now) target.setFullYear(target.getFullYear() + 1);
		const diff = target.getTime() - now.getTime();
		countdown = {
			days: Math.floor(diff / (1000 * 60 * 60 * 24)),
			hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
			mins: Math.floor((diff / (1000 * 60)) % 60),
			secs: Math.floor((diff / 1000) % 60)
		};
	}

	onMount(() => {
		initScratchCard();
		updateCountdown();
		countdownTimer = window.setInterval(updateCountdown, 1000);
		return () => {
			if (countdownTimer) clearInterval(countdownTimer);
		};
	});

	// 9. Wallet Toast
	let walletToast = $state<string | null>(null);
	function handleWalletPass(platform: 'Apple' | 'Google') {
		walletToast = `${platform} Wallet Wedding Keepsake untuk ${recipientName} siap disimpan!`;
		setTimeout(() => (walletToast = null), 2800);
	}
</script>

<!-- Floating Wedding Petals & Blessings -->
{#each floatingItems as item (item.id)}
	<span
		class="fixed pointer-events-none z-50 text-2xl animate-[weddingFloat_1.15s_ease-out_forwards]"
		style="left: {item.x}px; top: {item.y}px; --dx: {item.dx}px;"
		aria-hidden="true"
	>
		{item.emoji}
	</span>
{/each}

<!-- Wallet Toast -->
{#if walletToast}
	<div class="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-[#3b2d18] text-[#fdf8f0] text-xs font-semibold shadow-2xl flex items-center gap-2 animate-bounce">
		<span class="material-symbols-outlined text-[16px] text-amber-300" style="font-variation-settings: 'FILL' 1;">verified</span>
		<span>{walletToast}</span>
	</div>
{/if}

<!-- Gardenia Pearl & Champagne Gold Theme -->
<div class="relative min-h-screen w-full bg-gradient-to-b from-[#fdfaf4] via-[#f9f3e8] to-[#f4ecde] text-[#2b241d] pb-28 overflow-x-hidden selection:bg-[#d8b878] selection:text-[#2b241d]">
	<!-- Soft Pearl & Gold Ambient Glows -->
	<div class="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
		<div class="absolute -top-32 -left-24 w-[480px] h-[480px] rounded-full bg-[#e9d5b0]/40 blur-[120px]"></div>
		<div class="absolute top-1/3 -right-24 w-[440px] h-[440px] rounded-full bg-[#ebd5d2]/45 blur-[120px]"></div>
		<div class="absolute bottom-0 left-1/3 w-[520px] h-[520px] rounded-full bg-[#d8e3d9]/40 blur-[130px]"></div>
	</div>

	<div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
		<!-- Top NFC & Wedding Status Bar -->
		<div class="flex flex-wrap items-center justify-between gap-3 mb-6">
			<div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-[#e6d7be] text-xs font-semibold text-[#5c4d3c] shadow-sm">
				<span class="flex h-2 w-2 relative">
					<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#b68b4c] opacity-75"></span>
					<span class="relative inline-flex rounded-full h-2 w-2 bg-[#b68b4c]"></span>
				</span>
				<span>Verified NFC Keepsake • #{formattedTag}</span>
				<span class="opacity-40">•</span>
				<span class="text-[#3e6b58] font-bold uppercase tracking-wider">Eternal Lock</span>
			</div>

			<div class="flex items-center gap-2">
				<span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f3e7d3] border border-[#e2cfa9] text-[#6d5228] text-xs font-semibold">
					<span class="material-symbols-outlined text-[15px] text-[#b68b4c]" style="font-variation-settings: 'FILL' 1;">favorite</span>
					Gardenia Gold Edition • {weddingDateLabel}
				</span>
				{#if onReplayIntro}
					<button
						type="button"
						onclick={onReplayIntro}
						class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/85 hover:bg-white text-[#6d5228] text-xs font-semibold transition-colors cursor-pointer border border-[#e6d7be] shadow-sm"
						title="Ulangi Prosesi Cincin"
					>
						<span class="material-symbols-outlined text-[14px]">replay</span>
						<span class="hidden sm:inline">Replay</span>
					</button>
				{/if}
			</div>
		</div>

		<!-- Hero Wedding Banner -->
		<section class="relative mb-8 rounded-3xl overflow-hidden bg-white/90 backdrop-blur-xl border border-[#e8dcc6] shadow-[0_20px_50px_-12px_rgba(140,108,62,0.18)]">
			<div class="relative h-56 sm:h-72 w-full overflow-hidden">
				<img
					src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80"
					alt="Elegant wedding ceremony floral arch and rings"
					class="w-full h-full object-cover object-center"
				/>
				<div class="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent"></div>
			</div>

			<div class="relative -mt-16 px-6 pb-8 text-center flex flex-col items-center">
				<div class="flex flex-wrap items-center justify-center gap-2 mb-3">
					<span class="px-3 py-1 rounded-full bg-[#fbf5e9] border border-[#e5d0a8] text-[#8a6328] text-xs font-bold shadow-sm">
						💍 The Nuptial Covenant
					</span>
					<span class="px-3 py-1 rounded-full bg-[#f0f5f1] border border-[#c7dccb] text-[#2f5e48] text-xs font-bold shadow-sm">
						🕊️ Two Souls, One Promise
					</span>
					<span class="px-3 py-1 rounded-full bg-[#fdf1f0] border border-[#ecc9c5] text-[#8e4a47] text-xs font-bold shadow-sm">
						✨ Eternal Union
					</span>
				</div>

				<h1 class="font-headline-lg text-3xl sm:text-5xl font-normal text-[#2b241d] tracking-tight leading-tight mb-2">
					Happy Wedding, <span class="italic text-[#9c7232]">{recipientName}</span>! 💍✨
				</h1>
				<p class="text-[#665949] text-sm sm:text-lg max-w-2xl mb-5">
					Kado ucapan pernikahan spesial dari <strong class="text-[#7c5922]">{senderName}</strong> untuk merayakan hari paling bahagia kalian berdua.
				</p>

				<div class="flex flex-wrap items-center justify-center gap-3">
					<button
						type="button"
						onclick={handleSendBlessing}
						class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#b68b4c] to-[#9c7232] text-white font-bold text-sm shadow-lg shadow-[#b68b4c]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer {isBlessingAnimating ? 'scale-105' : ''}"
					>
						<span>🤍</span>
						<span>Kirim Peluk ke {senderName} ({blessingCount})</span>
					</button>
					<button
						type="button"
						onclick={tossBouquet}
						class="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#fdf5e8] hover:bg-[#f7ebd4] text-[#7c5922] border border-[#dfc494] font-bold text-sm active:scale-95 transition-all cursor-pointer"
					>
						<span class={isTossingBouquet ? 'animate-bounce' : ''}>💐</span>
						<span>Lempar Buket Keberuntungan! ({bouquetTossCount})</span>
					</button>
				</div>

				{#if bouquetResult}
					<div class="mt-4 max-w-md w-full px-4 py-3 rounded-2xl bg-[#fbf5e9] border border-[#e2cfa9] text-center shadow-sm animate-pulse">
						<p class="text-sm font-bold text-[#7c5922]">{bouquetResult.title}</p>
						<p class="text-xs text-[#665949] mt-0.5">{bouquetResult.desc}</p>
					</div>
				{/if}
			</div>
		</section>

		<!-- Main 12-Col Asymmetric Layout -->
		<div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
			<!-- LEFT COLUMN (5 cols): Polaroid Stack, Scratch Honeymoon, Countdown, Hardware -->
			<div class="lg:col-span-5 flex flex-col gap-6">
				<!-- 1. Interactive Flip Wedding Polaroids -->
				<div class="relative pt-2 pb-6 flex flex-col items-center">
					<p class="text-[11px] uppercase tracking-widest text-[#9c7232] font-bold mb-4 flex items-center gap-1.5">
						<span class="material-symbols-outlined text-[15px]">touch_app</span>
						Ketuk Foto untuk Membalik Kenangan
					</p>

					<div class="relative w-full flex items-center justify-center min-h-[370px]">
						<div class="absolute inset-4 bg-gradient-to-tr from-[#ebd8b7]/50 via-[#edd7d4]/40 to-[#d5e3d8]/40 rounded-3xl blur-2xl -z-10"></div>

						<!-- Bottom Polaroid -->
						<button
							type="button"
							onclick={() => (flippedPolaroids.first = !flippedPolaroids.first)}
							class="text-left absolute w-[86%] sm:w-[320px] aspect-[4/5] bg-white p-3.5 pb-6 rounded-2xl shadow-xl border border-[#ece2d0] transform rotate-3 translate-x-3 translate-y-6 transition-all duration-500 hover:rotate-1 hover:translate-y-4 cursor-pointer"
						>
							{#if !flippedPolaroids.first}
								<div class="relative w-full aspect-square rounded-lg overflow-hidden bg-[#f4ecde] mb-3">
									<img
										src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80"
										alt="First dance under warm lights"
										class="w-full h-full object-cover"
									/>
									<span class="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-white/90 text-[10px] font-bold text-[#665949]">
										First Dance
									</span>
								</div>
								<p class="font-headline-md text-base italic text-center text-[#2b241d]">
									First Dance Under Fairy Lights
								</p>
							{:else}
								<div class="w-full h-full rounded-xl bg-[#fbf6ec] border border-[#e5d5b7] p-5 flex flex-col items-center justify-center text-center">
									<span class="text-3xl mb-3">💃🕺</span>
									<p class="font-headline-sm text-sm font-bold text-[#7c5922] mb-2">Di Balik Dansa Pertama</p>
									<p class="text-xs text-[#665949] leading-relaxed">
										“Saat musik mulai berputar dan lampu temaram menyala, seluruh ruangan terasa hanya milik kita berdua.”
									</p>
									<span class="mt-4 text-[11px] font-bold text-[#9c7232] uppercase">Ketuk untuk kembali</span>
								</div>
							{/if}
						</button>

						<!-- Top Hero Polaroid -->
						<div
							role="button"
							tabindex="0"
							onclick={() => (flippedPolaroids.second = !flippedPolaroids.second)}
							onkeydown={(e) => e.key === 'Enter' && (flippedPolaroids.second = !flippedPolaroids.second)}
							class="relative w-[92%] sm:w-[340px] aspect-[4/5] bg-white p-4 pb-7 rounded-2xl shadow-2xl border border-[#ece2d0] transform -rotate-2 hover:rotate-0 transition-all duration-500 z-10 cursor-pointer"
						>
							<div class="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-[#ebd8b7]/80 backdrop-blur-sm rounded-sm shadow-sm flex items-center justify-center">
								<span class="text-[9px] font-bold tracking-widest text-[#6d5228]">ETERNAL BOND</span>
							</div>

							{#if !flippedPolaroids.second}
								<div class="relative w-full aspect-square rounded-xl overflow-hidden bg-[#f4ecde] mb-3.5 shadow-inner">
									<img
										src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80"
										alt="Bride and groom holding hands with wedding rings"
										class="w-full h-full object-cover"
									/>
									<div class="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md flex items-center gap-1 shadow-sm">
										<span class="material-symbols-outlined text-[#b68b4c] text-[14px]" style="font-variation-settings: 'FILL' 1;">favorite</span>
										<span class="text-[10px] font-bold text-[#2b241d]">Physical Tag Linked</span>
									</div>
									<button
										type="button"
										onclick={(e) => cycleReaction('second', e)}
										class="absolute bottom-2.5 right-2.5 w-9 h-9 rounded-full bg-white/95 shadow-md flex items-center justify-center text-lg hover:scale-110 active:scale-90 transition-transform cursor-pointer"
										title="Ganti Reaksi"
									>
										{polaroidReactions.second}
									</button>
								</div>
								<div class="text-center">
									<p class="font-headline-md text-xl italic text-[#2b241d] leading-tight">
										{recipientName} • Our Forever Day
									</p>
									<p class="text-[11px] font-semibold text-[#8c7b67] uppercase tracking-widest mt-1">
										{weddingDateLabel} 💍🌿
									</p>
								</div>
							{:else}
								<div class="w-full h-full rounded-xl bg-gradient-to-br from-[#fbf6ec] to-[#f4ecde] border border-[#dfc494] p-6 flex flex-col items-center justify-center text-center">
									<span class="text-4xl mb-3">💍🕊️</span>
									<p class="font-headline-md text-lg font-bold text-[#7c5922] mb-2">Kapsul Janji Suci</p>
									<p class="text-sm text-[#5c4d3c] leading-relaxed">
										Setiap kali cincin dan tag ini disentuh, ingatlah hari di mana kita memilih satu sama lain untuk selamanya.
									</p>
									<span class="mt-5 text-[11px] font-bold text-[#9c7232] uppercase">Ketuk untuk melihat foto</span>
								</div>
							{/if}
						</div>
					</div>
				</div>

				<!-- 2. Scratch-Off Secret Gift Voucher from Sender -->
				<div class="bg-white/90 backdrop-blur-xl p-5 rounded-3xl shadow-md border border-[#e8dcc6]">
					<div class="flex items-center justify-between mb-3">
						<div class="flex items-center gap-2">
							<span class="material-symbols-outlined text-[#b68b4c] text-[20px]" style="font-variation-settings: 'FILL' 1;">redeem</span>
							<h3 class="font-headline-sm text-base font-bold text-[#2b241d]">Kado Rahasia dari {senderName}</h3>
						</div>
						{#if scratchRevealed}
							<button
								type="button"
								onclick={resetScratchCard}
								class="text-xs font-semibold text-[#9c7232] hover:underline cursor-pointer"
							>
								Reset
							</button>
						{:else}
							<span class="text-[11px] font-semibold text-[#8c7b67]">{scratchProgress}%</span>
						{/if}
					</div>

					<div class="relative w-full h-28 rounded-2xl overflow-hidden border border-[#dfc494] bg-gradient-to-r from-[#fbf5e9] via-white to-[#f0f5f1] flex flex-col items-center justify-center text-center p-4 select-none">
						<p class="text-[10px] uppercase tracking-widest text-[#9c7232] font-bold mb-1">
							🎁 Golden Wedding Treat
						</p>
						<p class="font-headline-sm text-base font-bold text-[#2b241d]">
							1x Traktiran Dinner Romantis dari {senderName}! 🍽️🥂
						</p>
						<p class="text-[11px] text-[#665949] mt-0.5">Klaim kapan saja khusus untuk {recipientName}</p>

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

				<!-- 3. First Paper Anniversary Live Countdown -->
				<div class="bg-white/90 backdrop-blur-xl p-5 rounded-3xl shadow-md border border-[#e8dcc6]">
					<div class="flex items-center justify-between mb-3">
						<div class="flex items-center gap-2">
							<span class="material-symbols-outlined text-[#b68b4c] text-[18px]">calendar_today</span>
							<span class="text-xs font-bold uppercase tracking-wider text-[#9c7232]">Milestone Watch</span>
						</div>
						<span class="px-2.5 py-0.5 rounded-full bg-[#fbf5e9] border border-[#e5d0a8] text-[#7c5922] text-[11px] font-bold">
							Paper Anniversary
						</span>
					</div>
					<div class="grid grid-cols-4 gap-2 text-center">
						<div class="p-2.5 rounded-2xl bg-[#faf6ee] border border-[#ece2d0]">
							<span class="text-xl font-bold text-[#9c7232] block tabular-nums">{countdown.days}</span>
							<span class="text-[10px] uppercase text-[#8c7b67] font-semibold">Hari</span>
						</div>
						<div class="p-2.5 rounded-2xl bg-[#faf6ee] border border-[#ece2d0]">
							<span class="text-xl font-bold text-[#2b241d] block tabular-nums">{countdown.hours}</span>
							<span class="text-[10px] uppercase text-[#8c7b67] font-semibold">Jam</span>
						</div>
						<div class="p-2.5 rounded-2xl bg-[#faf6ee] border border-[#ece2d0]">
							<span class="text-xl font-bold text-[#2b241d] block tabular-nums">{countdown.mins}</span>
							<span class="text-[10px] uppercase text-[#8c7b67] font-semibold">Menit</span>
						</div>
						<div class="p-2.5 rounded-2xl bg-[#faf6ee] border border-[#ece2d0]">
							<span class="text-xl font-bold text-[#3e6b58] block tabular-nums animate-pulse">{countdown.secs}</span>
							<span class="text-[10px] uppercase text-[#8c7b67] font-semibold">Detik</span>
						</div>
					</div>
				</div>
			</div>

			<!-- RIGHT COLUMN (7 cols): Interactive Vows, Toast & Song Voter, RSVP Blessings Wall -->
			<div class="lg:col-span-7 flex flex-col gap-6">
				<!-- 1. Wedding Gift Letter & Interactive Blessings from Sender -->
				<article class="relative bg-white/95 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-xl border border-[#e8dcc6] overflow-hidden">
					<div class="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-[#f0e7d8]">
						<span class="px-3 py-1 rounded-full bg-[#fbf5e9] border border-[#e2cfa9] text-[#7c5922] text-xs font-bold">
							Wedding Gift Letter • Dari {senderName}
						</span>
						<span class="inline-flex items-center gap-1 text-xs font-semibold text-[#3e6b58]">
							<span class="material-symbols-outlined text-[15px]" style="font-variation-settings: 'FILL' 1;">verified</span>
							Permanent Keepsake Seal
						</span>
					</div>

					<h2 class="font-headline-lg text-2xl sm:text-4xl text-[#2b241d] font-normal leading-tight mb-4">
						Selamat Menempuh Hidup Baru, {recipientName}! 🕊️
					</h2>

					<p class="text-[#5c4d3c] text-sm sm:text-base leading-relaxed mb-5">
						Melihat kalian berdua berdiri bersanding hari ini adalah momen yang paling membahagiakan. Terima kasih sudah mengizinkanku menjadi bagian dari perjalanan cinta kalian. Ketuk setiap doa di bawah ini untuk mengaminkannya bersama:
					</p>

					<!-- Interactive Blessing Clauses -->
					<div class="space-y-3 mb-6">
						{#each VOW_CLAUSES as clause, idx}
							<button
								type="button"
								onclick={(e) => toggleVowSeal(idx, e)}
								class="w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 {sealedVows[idx]
									? 'bg-[#fbf5e9] border-[#c29b61] shadow-sm'
									: 'bg-[#faf7f2] border-[#ece2d0] hover:border-[#d5bfa0]'}"
							>
								<p class="font-headline-md text-base sm:text-lg italic text-[#2b241d] leading-snug">
									“{clause}”
								</p>
								<span class="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold {sealedVows[idx] ? 'bg-[#b68b4c] text-white' : 'bg-white text-[#8c7b67] border border-[#e6d7be]'}">
									{sealedVows[idx] ? '✓ Amiin' : 'Amiinkan 🤍'}
								</span>
							</button>
						{/each}
					</div>

					<div class="pt-4 border-t border-[#f0e7d8] flex flex-wrap items-center justify-between gap-3">
						<div>
							<p class="text-[11px] uppercase tracking-wider text-[#8c7b67] font-bold">Dengan penuh cinta &amp; doa terbaik,</p>
							<p class="font-headline-md text-xl italic text-[#9c7232] font-medium">{senderName} 💐</p>
						</div>
						<div class="flex gap-2">
							<button
								type="button"
								onclick={() => handleWalletPass('Apple')}
								class="px-3.5 py-2 rounded-full bg-[#2b241d] text-white text-xs font-bold hover:opacity-90 cursor-pointer"
							>
								Apple Wallet
							</button>
							<button
								type="button"
								onclick={() => handleWalletPass('Google')}
								class="px-3.5 py-2 rounded-full bg-[#f3e7d3] text-[#6d5228] text-xs font-bold hover:bg-[#ebd9ba] cursor-pointer"
							>
								Google Wallet
							</button>
						</div>
					</div>
				</article>

				<!-- 2. Interactive Reception Lounge: Virtual Toast & First Dance Song Voter -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-5">
					<!-- Virtual Champagne Toast -->
					<div class="bg-white/90 backdrop-blur-xl p-5 rounded-3xl shadow-md border border-[#e8dcc6] flex flex-col justify-between">
						<div>
							<div class="flex items-center justify-between mb-2">
								<span class="text-xs font-bold uppercase tracking-wider text-[#9c7232]">Virtual Toast</span>
								<span class="px-2.5 py-0.5 rounded-full bg-[#fbf5e9] text-[#7c5922] text-xs font-bold">
									{toastCheersCount} 🥂
								</span>
							</div>
							<h3 class="font-headline-sm text-lg font-bold text-[#2b241d] mb-3">Bersulang Bersama {senderName}</h3>

							<div class="grid grid-cols-3 gap-2 mb-4">
								{#each TOAST_DRINKS as drink (drink.id)}
									<button
										type="button"
										onclick={() => (selectedDrink = drink.id)}
										class="p-2.5 rounded-2xl border text-center transition-all cursor-pointer {selectedDrink === drink.id
											? 'bg-[#fbf5e9] border-[#b68b4c] shadow-sm'
											: 'bg-[#faf7f2] border-transparent hover:bg-[#f5efe4]'}"
									>
										<span class="text-2xl block mb-1">{drink.emoji}</span>
										<span class="text-[10px] font-bold text-[#5c4d3c] leading-tight block">{drink.name}</span>
									</button>
								{/each}
							</div>
						</div>

						<button
							type="button"
							onclick={raiseToast}
							class="w-full py-2.5 rounded-full bg-[#b68b4c] hover:bg-[#9c7232] text-white text-xs font-bold shadow-md active:scale-95 transition-all cursor-pointer"
						>
							Cheers! Dentingkan Gelas 🥂
						</button>
					</div>

					<!-- Pick Bonus Treat from Gift Giver -->
					<div class="bg-white/90 backdrop-blur-xl p-5 rounded-3xl shadow-md border border-[#e8dcc6] flex flex-col justify-between">
						<div>
							<div class="flex items-center justify-between mb-2">
								<span class="text-xs font-bold uppercase tracking-wider text-[#3e6b58]">Bonus Kado</span>
								<span class="text-[11px] font-semibold text-[#8c7b67]">Pilih 1 Hadiah</span>
							</div>
							<h3 class="font-headline-sm text-lg font-bold text-[#2b241d] mb-3">Pilih Traktiran dari {senderName} 🎁</h3>

							<div class="space-y-2">
								{#each GIFT_TREATS as treat (treat.id)}
									<button
										type="button"
										onclick={(e) => voteSong(treat.id, e)}
										class="w-full p-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer {userVotedSong === treat.id
											? 'bg-[#f0f5f1] border-[#3e6b58] shadow-sm'
											: 'bg-[#faf7f2] border-[#ece2d0] hover:bg-[#f4ecde]'}"
									>
										<span class="text-xs font-semibold text-[#2b241d] truncate">{treat.title}</span>
										<span class="px-2 py-0.5 rounded-full text-[11px] font-bold shrink-0 {userVotedSong === treat.id ? 'bg-[#3e6b58] text-white' : 'bg-white text-[#665949]'}">
											{userVotedSong === treat.id ? '✓ Dipilih' : 'Pilih'}
										</span>
									</button>
								{/each}
							</div>
						</div>
					</div>
				</div>

				<!-- 3. Interactive Newlyweds Thank-You Reply Box -->
				<div class="bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-md border border-[#e8dcc6]">
					<div class="flex flex-wrap items-center justify-between gap-2 mb-4">
						<div>
							<h3 class="font-headline-sm text-lg font-bold text-[#2b241d] flex items-center gap-2">
								<span class="material-symbols-outlined text-[#b68b4c] text-[20px]">edit_note</span>
								Kartu Balasan Pengantin untuk {senderName}
							</h3>
							<p class="text-xs text-[#665949]">Tulis pesan terima kasih dari kalian berdua untuk disimpan di kapsul ini (+3 🤍)</p>
						</div>
						<span class="px-3 py-1 rounded-full bg-[#fbf5e9] text-[#7c5922] text-xs font-bold">
							{blessingsWall.length} Balasan
						</span>
					</div>

					<form onsubmit={submitBlessing} class="space-y-3 mb-5">
						<div class="flex flex-wrap items-center gap-2">
							<button
								type="button"
								onclick={() => (replyFrom = 'berdua')}
								class="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border {replyFrom === 'berdua'
									? 'bg-[#b68b4c] text-white border-[#b68b4c]'
									: 'bg-[#faf7f2] text-[#5c4d3c] border-[#e6d7be]'}"
							>
								💍 Dari Berdua
							</button>
							<button
								type="button"
								onclick={() => (replyFrom = 'bride')}
								class="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border {replyFrom === 'bride'
									? 'bg-[#3e6b58] text-white border-[#3e6b58]'
									: 'bg-[#faf7f2] text-[#5c4d3c] border-[#e6d7be]'}"
							>
								👰 Mempelai Wanita
							</button>
							<button
								type="button"
								onclick={() => (replyFrom = 'groom')}
								class="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border {replyFrom === 'groom'
									? 'bg-[#2b241d] text-white border-[#2b241d]'
									: 'bg-[#faf7f2] text-[#5c4d3c] border-[#e6d7be]'}"
							>
								🤵 Mempelai Pria
							</button>
							<div class="flex items-center gap-1 ml-auto">
								{#each ['🤍', '💍', '🥂', '💐'] as st}
									<button
										type="button"
										onclick={() => (guestBadge = st)}
										class="w-8 h-8 rounded-full flex items-center justify-center text-sm cursor-pointer transition-transform {guestBadge === st ? 'bg-[#fbf5e9] ring-2 ring-[#b68b4c] scale-110' : 'bg-[#faf7f2] opacity-70'}"
									>
										{st}
									</button>
								{/each}
							</div>
						</div>

						<div class="flex flex-col sm:flex-row gap-2.5">
							<input
								type="text"
								bind:value={guestMessage}
								placeholder="Tulis balasan manis untuk {senderName}..."
								class="flex-1 px-4 py-2.5 rounded-full bg-[#faf7f2] border border-[#e6d7be] text-sm text-[#2b241d] focus:outline-none focus:border-[#b68b4c]"
							/>
							<button
								type="submit"
								class="px-5 py-2.5 rounded-full bg-[#b68b4c] hover:bg-[#9c7232] text-white font-bold text-xs shadow-sm active:scale-95 transition-all cursor-pointer shrink-0"
							>
								Kirim Balasan 💌
							</button>
						</div>
					</form>

					<div class="space-y-2.5 max-h-60 overflow-y-auto pr-1">
						{#each blessingsWall as item}
							<div class="p-3.5 rounded-2xl bg-[#faf7f2] border border-[#ece2d0] flex items-start justify-between gap-3">
								<div>
									<p class="text-xs font-bold text-[#7c5922]">{item.name}</p>
									<p class="text-sm text-[#43382c] mt-1">“{item.message}”</p>
								</div>
								<span class="text-lg shrink-0">{item.badge}</span>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Floating Docked Music Controller -->
<div class="fixed bottom-6 right-6 z-40 max-w-sm w-[calc(100vw-3rem)] sm:w-auto">
	<div class="bg-white/95 backdrop-blur-2xl px-4 py-3 rounded-full shadow-[0_16px_40px_-8px_rgba(140,108,62,0.28)] flex items-center justify-between gap-3 border border-[#e6d7be]">
		<div class="relative flex-shrink-0">
			<div class="w-10 h-10 rounded-full bg-gradient-to-tr from-[#b68b4c] to-[#e5cc99] flex items-center justify-center shadow-md {isMusicPlaying ? 'animate-[spin_6s_linear_infinite]' : ''}">
				<span class="material-symbols-outlined text-white text-[18px]" style="font-variation-settings: 'FILL' 1;">favorite</span>
			</div>
			{#if isMusicPlaying}
				<div class="absolute inset-0 rounded-full ring-2 ring-[#dfc494] animate-ping opacity-40"></div>
			{/if}
		</div>

		<div class="flex flex-col min-w-0 pr-1">
			<div class="flex items-center gap-1.5">
				<p class="text-xs font-bold text-[#2b241d] truncate">{activeTrack.title}</p>
				<span class="text-[10px] text-[#9c7232] uppercase font-bold">Harp</span>
			</div>
			<p class="text-[11px] text-[#665949] truncate">
				{isMusicPlaying ? `${activeTrack.artist} • Playing` : 'Paused • Tap to Play'}
			</p>
		</div>

		<div class="flex items-center gap-1.5 flex-shrink-0">
			{#if onNextTrack}
				<button
					type="button"
					onclick={onNextTrack}
					aria-label="Ganti Lagu"
					class="w-8 h-8 rounded-full bg-[#fbf5e9] text-[#9c7232] flex items-center justify-center hover:bg-[#f3e7d3] transition-colors cursor-pointer"
				>
					<span class="material-symbols-outlined text-[18px]">skip_next</span>
				</button>
			{/if}
			<button
				type="button"
				onclick={onToggleMusic}
				aria-label="Toggle Playback"
				class="w-9 h-9 rounded-full bg-[#b68b4c] text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer"
			>
				<span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">
					{isMusicPlaying ? 'pause' : 'play_arrow'}
				</span>
			</button>
		</div>
	</div>
</div>

<style>
	@keyframes weddingFloat {
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
