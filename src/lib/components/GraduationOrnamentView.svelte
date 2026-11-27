<script lang="ts">
	interface Props {
		recipientName: string;
		senderName?: string;
		formattedTag: string;
		gradYear?: number;
		isMusicPlaying?: boolean;
		currentTrackIndex?: number;
		tracks?: { title: string; artist: string }[];
		onToggleMusic?: () => void;
		onNextTrack?: () => void;
		onReplayIntro?: () => void;
	}

	let {
		recipientName = 'David',
		senderName = 'Mama, Papa & Keluarga 🌟',
		formattedTag = 'TK-3003',
		gradYear = 2026,
		isMusicPlaying = false,
		currentTrackIndex = 0,
		tracks = [
			{ title: 'Pomp & Triumph Chimes', artist: 'Commencement Orchestra' },
			{ title: 'Midnight Library Lo-Fi', artist: 'Late Night Thesis' },
			{ title: 'Golden Horizon', artist: 'New Chapter Waltz' }
		],
		onToggleMusic,
		onNextTrack,
		onReplayIntro
	}: Props = $props();

	const activeTrack = $derived(tracks[currentTrackIndex] ?? tracks[0]);

	// 1. Flying Caps & High-Five Tosses
	let prideCount = $state(64);
	let capTossCount = $state(12);
	let flyingCaps = $state<{ id: number; x: number; y: number; dx: number; rot: number; emoji: string }[]>([]);
	let nextCapId = 0;

	const GRAD_EMOJIS = ['🎓', '⭐', '👏', '📜', '🎉', '✨', '🏆'];

	function launchBurst(x: number, y: number, count = 5, onlyCaps = false) {
		const items = Array.from({ length: count }, () => ({
			id: nextCapId++,
			x: x + (Math.random() - 0.5) * 60,
			y,
			dx: (Math.random() - 0.5) * 140,
			rot: (Math.random() - 0.5) * 90,
			emoji: onlyCaps ? '🎓' : GRAD_EMOJIS[Math.floor(Math.random() * GRAD_EMOJIS.length)]
		}));
		flyingCaps = [...flyingCaps, ...items];
		const ids = new Set(items.map((c) => c.id));
		setTimeout(() => {
			flyingCaps = flyingCaps.filter((c) => !ids.has(c.id));
		}, 1200);
	}

	function handleTossCap(e: MouseEvent) {
		capTossCount++;
		prideCount++;
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		launchBurst(rect.left + rect.width / 2, rect.top, 6, true);
	}

	function handleSendPride(e: MouseEvent) {
		prideCount++;
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		launchBurst(rect.left + rect.width / 2, rect.top, 5, false);
	}

	// 2. Interactive Diploma Foil Stamp
	let isDiplomaStamped = $state(false);
	function handleStampDiploma(e: MouseEvent) {
		isDiplomaStamped = true;
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		launchBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 8, false);
	}

	// 3. Interactive Polaroid Yearbook Flip
	let flippedCards = $state<{ first: boolean; second: boolean }>({ first: false, second: false });
	let reactions = $state<{ first: string; second: string }>({ first: '🎓', second: '🏆' });
	const REACTION_POOL = ['🎓', '🏆', '👏', '🔥', '🥹', '⭐'];

	function cycleReaction(which: 'first' | 'second', e: MouseEvent) {
		e.stopPropagation();
		const idx = REACTION_POOL.indexOf(reactions[which]);
		reactions[which] = REACTION_POOL[(idx + 1) % REACTION_POOL.length];
		launchBurst(e.clientX, e.clientY, 3, false);
	}

	// 4. Fun Graduation Superlative Spinner
	const SUPERLATIVES = [
		{ badge: '☕ Caffeine Legend', title: 'Most Likely to Survive on Iced Coffee', desc: 'Skripsi lancar berkat 100+ gelas es kopi susu tengah malam.' },
		{ badge: '⚡ Clutch Master', title: 'CEO of Last-Minute Deadlines', desc: 'Tetap tenang walau revisi datang H-1 jam sebelum sidang.' },
		{ badge: '🚀 Future Mogul', title: 'Next Big Visionary Founder', desc: 'Siap menaklukkan industri dan bikin semua orang bangga.' },
		{ badge: '🤝 MVP Teman', title: 'Always Carried the Group Project', desc: 'Pahlawan tanpa tanda jasa di setiap tugas kelompok.' },
		{ badge: '🌟 Cum Laude Aura', title: 'Main Character of Commencement', desc: 'Berjalan di panggung wisuda dengan penuh kharisma.' }
	];
	let superlativeIdx = $state(0);
	let isSpinningAward = $state(false);

	function spinSuperlative(e: MouseEvent) {
		if (isSpinningAward) return;
		isSpinningAward = true;
		let ticks = 0;
		const timer = setInterval(() => {
			superlativeIdx = (superlativeIdx + 1) % SUPERLATIVES.length;
			ticks++;
			if (ticks > 9) {
				clearInterval(timer);
				superlativeIdx = Math.floor(Math.random() * SUPERLATIVES.length);
				isSpinningAward = false;
				launchBurst(e.clientX, e.clientY, 5, false);
			}
		}, 85);
	}

	// 5. Interactive Time Capsule (Next Chapter Goal Lock)
	const CHAPTER_PRESETS = [
		{ id: 'career', icon: 'work', label: 'Dream Career' },
		{ id: 'masters', icon: 'school', label: 'Lanjut S2 / Riset' },
		{ id: 'startup', icon: 'rocket_launch', label: 'Bangun Bisnis' },
		{ id: 'travel', icon: 'flight_takeoff', label: 'Jelajah Dunia' }
	];
	let selectedChapter = $state('career');
	let customDream = $state('');
	let isCapsuleLocked = $state(false);

	function lockTimeCapsule(e: MouseEvent) {
		isCapsuleLocked = true;
		launchBurst(e.clientX, e.clientY, 8, false);
	}

	// 6. Family Voice Note Simulator
	let isVoicePlaying = $state(false);
	let voiceProgress = $state(0);
	let voiceTimer: number | null = null;

	function toggleVoiceNote() {
		if (isVoicePlaying) {
			isVoicePlaying = false;
			if (voiceTimer) clearInterval(voiceTimer);
		} else {
			isVoicePlaying = true;
			if (voiceProgress >= 100) voiceProgress = 0;
			voiceTimer = window.setInterval(() => {
				voiceProgress += 2;
				if (voiceProgress >= 100) {
					voiceProgress = 100;
					isVoicePlaying = false;
					if (voiceTimer) clearInterval(voiceTimer);
				}
			}, 120);
		}
	}

	// 7. Interactive Yearbook Guestbook
	let guestName = $state('');
	let guestNote = $state('');
	let yearbookEntries = $state<{ name: string; note: string; badge: string }[]>([
		{ name: 'Mama & Papa', note: 'Bangga banget sama perjuanganmu sampai di titik ini, Nak!', badge: '💛' },
		{ name: 'Tim Skripsi', note: 'Akhirnya bebas revisi!! Sukses terus di dunia nyata ya!', badge: '🎓' }
	]);

	function signYearbook(e: SubmitEvent) {
		e.preventDefault();
		const noteTrim = guestNote.trim();
		if (!noteTrim) return;
		const nameTrim = guestName.trim() || 'Sahabat';
		yearbookEntries = [{ name: nameTrim, note: noteTrim, badge: '✨' }, ...yearbookEntries];
		guestName = '';
		guestNote = '';
		prideCount += 2;
	}

	// 8. Wallet Toast
	let walletToast = $state<string | null>(null);
	function handleWalletPass(platform: 'Apple' | 'Google') {
		walletToast = `${platform} Wallet Commencement Pass untuk ${recipientName} siap disimpan!`;
		setTimeout(() => {
			walletToast = null;
		}, 2800);
	}
</script>

<!-- Flying Caps / Emojis Overlay -->
{#each flyingCaps as cap (cap.id)}
	<span
		class="fixed pointer-events-none z-50 text-3xl animate-[tossFly_1.15s_cubic-bezier(0.22,1,0.36,1)_forwards]"
		style="left: {cap.x}px; top: {cap.y}px; --dx: {cap.dx}px; --rot: {cap.rot}deg;"
		aria-hidden="true"
	>
		{cap.emoji}
	</span>
{/each}

<!-- Wallet Toast -->
{#if walletToast}
	<div class="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-amber-300 text-slate-950 text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce">
		<span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">verified</span>
		<span>{walletToast}</span>
	</div>
{/if}

<div class="relative min-h-screen w-full bg-gradient-to-b from-[#081216] via-[#0c211c] to-[#060d10] text-slate-100 pb-28 overflow-x-hidden selection:bg-amber-400 selection:text-slate-950">
	<!-- Ambient Academic Emerald & Gold Glows -->
	<div class="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
		<div class="absolute -top-32 -left-24 w-[460px] h-[460px] rounded-full bg-emerald-500/15 blur-[130px]"></div>
		<div class="absolute top-1/3 -right-24 w-[420px] h-[420px] rounded-full bg-amber-400/10 blur-[120px]"></div>
		<div class="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full bg-teal-600/10 blur-[140px]"></div>
	</div>

	<div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
		<!-- Top NFC & Commencement Status Bar -->
		<div class="flex flex-wrap items-center justify-between gap-3 mb-6">
			<div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-emerald-400/25 text-xs font-semibold text-emerald-200">
				<span class="flex h-2 w-2 relative">
					<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
					<span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
				</span>
				<span>Verified NFC Keepsake • #{formattedTag}</span>
				<span class="opacity-40">•</span>
				<span class="text-amber-300 font-bold uppercase tracking-wider">Sealed</span>
			</div>

			<div class="flex items-center gap-2">
				<span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-400/15 border border-amber-300/30 text-amber-200 text-xs font-semibold">
					<span class="material-symbols-outlined text-[15px] text-amber-300" style="font-variation-settings: 'FILL' 1;">school</span>
					Class of {gradYear} • Honor Vault
				</span>
				{#if onReplayIntro}
					<button
						type="button"
						onclick={onReplayIntro}
						class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer border border-white/15"
						title="Lempar Toga Lagi"
					>
						<span class="material-symbols-outlined text-[14px]">replay</span>
						<span class="hidden sm:inline">Replay Toss</span>
					</button>
				{/if}
			</div>
		</div>

		<!-- Hero Commencement Banner + Interactive Cap Toss CTA -->
		<section class="relative mb-8 rounded-3xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
			<div class="relative h-52 sm:h-72 w-full overflow-hidden">
				<img
					src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1400&q=80"
					alt="University graduation celebration"
					class="w-full h-full object-cover object-center opacity-75"
				/>
				<div class="absolute inset-0 bg-gradient-to-t from-[#0b1b18] via-[#0b1b18]/60 to-transparent"></div>
			</div>

			<div class="relative -mt-16 px-6 pb-8 text-center flex flex-col items-center">
				<div class="flex flex-wrap items-center justify-center gap-2 mb-3">
					<span class="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider shadow-md">
						🎓 Class of {gradYear}
					</span>
					<span class="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-bold">
						⭐ Cum Laude Spirit
					</span>
					<span class="px-3 py-1 rounded-full bg-white/10 text-slate-200 border border-white/15 text-xs font-semibold">
						📜 Journey Sealed
					</span>
				</div>

				<h1 class="font-headline-lg text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight mb-2">
					Selamat Wisuda, <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-100">{recipientName}</span>! 🎓✨
				</h1>
				<p class="text-emerald-100/80 text-sm sm:text-lg max-w-2xl mb-5">
					Menghormati setiap malam tanpa tidur, kerja keras, dan awal babak baru yang luar biasa.
				</p>

				<!-- Interactive Cap Toss Bar -->
				<div class="flex flex-wrap items-center justify-center gap-3">
					<button
						type="button"
						onclick={handleTossCap}
						class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-300 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
					>
						<span>🎓</span>
						<span>Lempar Toga ke Langit! ({capTossCount})</span>
					</button>
					<button
						type="button"
						onclick={handleSendPride}
						class="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-400/35 font-bold text-sm active:scale-95 transition-all cursor-pointer"
					>
						<span>👏</span>
						<span>Kirim Tepuk Tangan ({prideCount})</span>
					</button>
				</div>
			</div>
		</section>

		<!-- Main 12-Col Asymmetric Grid -->
		<div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
			<!-- LEFT COLUMN (5 cols): Interactive Diploma, Polaroid Yearbook, Hardware Seal -->
			<div class="lg:col-span-5 flex flex-col gap-6">
				<!-- 1. Interactive Tactile Diploma Card -->
				<div class="relative rounded-3xl p-6 bg-gradient-to-br from-[#fdf8ee] to-[#f4ead5] text-slate-900 shadow-2xl border-4 border-amber-400/60 overflow-hidden">
					<div class="absolute inset-2 rounded-2xl border border-amber-700/20 pointer-events-none"></div>
					<div class="relative text-center space-y-2">
						<p class="text-[10px] font-extrabold uppercase tracking-[0.25em] text-amber-800">
							Certificate of Achievement • {gradYear}
						</p>
						<h2 class="font-headline-md text-2xl font-bold text-slate-900 italic">
							Official Graduate Honors
						</h2>
						<p class="text-xs text-slate-600">Dengan ini menyatakan bahwa</p>
						<p class="font-headline-lg text-2xl font-extrabold text-emerald-900 underline decoration-amber-400 decoration-2 underline-offset-4">
							{recipientName}
						</p>
						<p class="text-xs text-slate-700 leading-relaxed pt-1">
							Telah resmi menaklukkan segala rintangan tugas, revisi, dan begadang dengan penuh dedikasi.
						</p>

						<div class="pt-4 flex items-center justify-between gap-2">
							<div class="text-left">
								<p class="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Signed By</p>
								<p class="font-headline-sm text-sm italic font-bold text-slate-800">{senderName}</p>
							</div>

							<button
								type="button"
								onclick={handleStampDiploma}
								class="relative px-4 py-2 rounded-full font-extrabold text-xs transition-all cursor-pointer shadow-md {isDiplomaStamped
									? 'bg-emerald-700 text-white scale-105 ring-4 ring-emerald-400/30'
									: 'bg-amber-400 text-slate-950 hover:bg-amber-300 animate-pulse'}"
							>
								{#if isDiplomaStamped}
									✓ SAH &amp; LULUS!
								{:else}
									🔖 Ketuk untuk Cap Sah!
								{/if}
							</button>
						</div>
					</div>
				</div>

				<!-- 2. Interactive Flip Yearbook Polaroids -->
				<div class="rounded-3xl p-5 bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">
					<div class="flex items-center justify-between mb-4">
						<div class="flex items-center gap-2">
							<span class="material-symbols-outlined text-amber-300 text-[20px]" style="font-variation-settings: 'FILL' 1;">photo_library</span>
							<h3 class="font-headline-sm text-base font-bold text-white">Kenangan Kampus</h3>
						</div>
						<span class="text-[11px] font-semibold text-emerald-300">Ketuk foto untuk membalik</span>
					</div>

					<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
						<!-- Polaroid 1 -->
						<div
							role="button"
							tabindex="0"
							onclick={() => (flippedCards.first = !flippedCards.first)}
							onkeydown={(e) => e.key === 'Enter' && (flippedCards.first = !flippedCards.first)}
							class="bg-white text-slate-900 p-3 pb-4 rounded-2xl shadow-lg transform -rotate-1 hover:rotate-0 transition-all cursor-pointer"
						>
							{#if !flippedCards.first}
								<div class="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-200 mb-2.5">
									<img
										src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"
										alt="Graduation day celebration"
										class="w-full h-full object-cover"
									/>
									<button
										type="button"
										onclick={(e) => cycleReaction('first', e)}
										class="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white/95 shadow flex items-center justify-center text-base hover:scale-110 transition-transform cursor-pointer"
										title="Ganti Reaksi"
									>
										{reactions.first}
									</button>
								</div>
								<p class="font-headline-sm text-sm font-bold text-slate-800 text-center">Hari Kemenangan Kita! 🎓</p>
							{:else}
								<div class="aspect-[4/3] rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex flex-col items-center justify-center text-center">
									<span class="text-2xl mb-1.5">☕📚</span>
									<p class="font-bold text-xs text-emerald-950 mb-1">Behind the Degree</p>
									<p class="text-xs text-emerald-800 leading-relaxed">
										"Ingat malam-malam lembur ngerjain tugas akhir? Semua lelahmu terbayar lunas hari ini!"
									</p>
								</div>
							{/if}
						</div>

						<!-- Polaroid 2 -->
						<div
							role="button"
							tabindex="0"
							onclick={() => (flippedCards.second = !flippedCards.second)}
							onkeydown={(e) => e.key === 'Enter' && (flippedCards.second = !flippedCards.second)}
							class="bg-white text-slate-900 p-3 pb-4 rounded-2xl shadow-lg transform rotate-1 hover:rotate-0 transition-all cursor-pointer"
						>
							{#if !flippedCards.second}
								<div class="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-200 mb-2.5">
									<img
										src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=800&q=80"
										alt="Graduates celebrating together"
										class="w-full h-full object-cover"
									/>
									<button
										type="button"
										onclick={(e) => cycleReaction('second', e)}
										class="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white/95 shadow flex items-center justify-center text-base hover:scale-110 transition-transform cursor-pointer"
										title="Ganti Reaksi"
									>
										{reactions.second}
									</button>
								</div>
								<p class="font-headline-sm text-sm font-bold text-slate-800 text-center">Kebanggaan Keluarga 🌟</p>
							{:else}
								<div class="aspect-[4/3] rounded-xl bg-amber-50 border border-amber-200 p-4 flex flex-col items-center justify-center text-center">
									<span class="text-2xl mb-1.5">🌟💛</span>
									<p class="font-bold text-xs text-amber-950 mb-1">Catatan Hangat</p>
									<p class="text-xs text-amber-900 leading-relaxed">
										"Ke mana pun langkahmu melangkah setelah ini, doa kami selalu menyertaimu."
									</p>
								</div>
							{/if}
						</div>
					</div>
				</div>

				<!-- 3. Fun Graduation Superlative Spinner -->
				<div class="rounded-3xl p-5 bg-gradient-to-br from-emerald-950/80 to-slate-900/90 border border-emerald-400/25 shadow-xl">
					<div class="flex items-center justify-between mb-3">
						<div class="flex items-center gap-2">
							<span class="material-symbols-outlined text-amber-300 text-[20px]">military_tech</span>
							<h3 class="font-headline-sm text-base font-bold text-white">Penghargaan Spesial</h3>
						</div>
						<button
							type="button"
							onclick={spinSuperlative}
							class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-400 text-slate-950 text-xs font-extrabold hover:bg-amber-300 active:scale-95 transition-all cursor-pointer"
						>
							<span class="material-symbols-outlined text-[15px] {isSpinningAward ? 'animate-spin' : ''}">casino</span>
							<span>Acak Gelar</span>
						</button>
					</div>

					<div class="p-4 rounded-2xl bg-white/5 border border-white/10">
						<span class="inline-block px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-200 text-[11px] font-bold mb-2">
							{SUPERLATIVES[superlativeIdx].badge}
						</span>
						<p class="font-headline-sm text-lg font-bold text-white leading-snug">
							{SUPERLATIVES[superlativeIdx].title}
						</p>
						<p class="text-xs text-slate-300 mt-1 leading-relaxed">
							{SUPERLATIVES[superlativeIdx].desc}
						</p>
					</div>
				</div>
			</div>

			<!-- RIGHT COLUMN (7 cols): Letter + Voice Note, Time Capsule, Yearbook Guestbook, Wallet -->
			<div class="lg:col-span-7 flex flex-col gap-6">
				<!-- 1. Commencement Letter + Voice Note Mini-Widget -->
				<article class="relative rounded-3xl p-6 sm:p-8 bg-white text-slate-900 shadow-2xl overflow-hidden">
					<div class="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-amber-200/40 blur-2xl pointer-events-none"></div>

					<div class="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-100">
						<div class="flex items-center gap-2">
							<span class="px-3 py-1 rounded-full bg-emerald-900 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
								Commencement Letter
							</span>
							<span class="text-xs text-slate-500 font-semibold">Immutable NFC Seal</span>
						</div>
						<span class="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
							<span class="material-symbols-outlined text-[15px]">fingerprint</span>
							Verified
						</span>
					</div>

					<h2 class="font-headline-lg text-2xl sm:text-4xl font-bold text-slate-950 tracking-tight mb-4 leading-snug">
						Sangat Bangga Padamu, {recipientName}! 🎓
					</h2>

					<div class="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
						<p>
							Dari hari pertama kamu melangkah ke kampus dengan penuh rasa penasaran, sampai malam-malam panjang ditemani kopi dan revisi, kami menyaksikan langsung bagaimana kamu mengubah setiap tantangan menjadi tekad yang luar biasa.
						</p>
						<p class="font-headline-md text-lg sm:text-xl italic text-emerald-900 font-medium leading-snug border-l-4 border-amber-400 pl-4 py-1 bg-amber-50/50 rounded-r-xl">
							“Jangan pernah lupa betapa hebatnya dirimu saat melangkah dengan percaya diri dan tujuan. Dunia sudah menunggu karya terbaikmu.”
						</p>
						<p>
							Bawa tag fisik kecil ini ke kota barumu, tempat kerjamu nanti, dan ke mana pun mimpimu terbang tinggi. Ketukkan ponselmu kapan saja kamu butuh pengingat bahwa ada keluarga dan orang-orang tersayang yang selalu mendukungmu tanpa syarat.
						</p>
					</div>

					<!-- Sign-off + Interactive Family Voice Note -->
					<div class="mt-8 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div>
							<p class="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Dengan penuh rasa bangga &amp; cinta,</p>
							<p class="font-headline-md text-xl text-emerald-900 font-bold italic">{senderName}</p>
						</div>

						<div class="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-100 border border-slate-200/80 min-w-[230px]">
							<button
								type="button"
								onclick={toggleVoiceNote}
								class="w-10 h-10 rounded-full bg-emerald-800 hover:bg-emerald-700 text-amber-300 flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
								aria-label={isVoicePlaying ? 'Jeda Pesan Suara' : 'Putar Pesan Suara'}
							>
								<span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">
									{isVoicePlaying ? 'pause' : 'play_arrow'}
								</span>
							</button>
							<div class="flex-1 min-w-0">
								<div class="flex items-center justify-between text-xs font-bold text-slate-900">
									<span>Voice Note Keluarga</span>
									<span class="text-[10px] text-emerald-700">{voiceProgress}%</span>
								</div>
								<div class="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1.5">
									<div
										class="h-full bg-emerald-700 transition-all duration-150"
										style="width: {voiceProgress}%"
									></div>
								</div>
							</div>
						</div>
					</div>
				</article>

				<!-- 2. Interactive Future Time Capsule (Next Chapter Locker) -->
				<div class="rounded-3xl p-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">
					<div class="flex flex-wrap items-center justify-between gap-2 mb-4">
						<div>
							<p class="text-[11px] uppercase tracking-widest text-amber-300 font-bold">Future Time Capsule</p>
							<h3 class="font-headline-sm text-lg font-bold text-white">Kunci Target Babak Barumu 🚀</h3>
						</div>
						{#if isCapsuleLocked}
							<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
								<span class="material-symbols-outlined text-[14px]">lock</span>
								Terkunci di Vault
							</span>
						{/if}
					</div>

					<div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
						{#each CHAPTER_PRESETS as ch (ch.id)}
							<button
								type="button"
								onclick={() => {
									selectedChapter = ch.id;
									isCapsuleLocked = false;
								}}
								class="p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 {selectedChapter === ch.id
									? 'bg-amber-400/20 border-amber-300 text-amber-200 shadow-md'
									: 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'}"
							>
								<span class="material-symbols-outlined text-[20px]">{ch.icon}</span>
								<span class="text-xs font-bold leading-tight">{ch.label}</span>
							</button>
						{/each}
					</div>

					<div class="flex flex-col sm:flex-row gap-2.5">
						<input
							type="text"
							bind:value={customDream}
							placeholder="Tulis resolusi atau target impianmu setelah wisuda..."
							class="flex-1 px-4 py-2.5 rounded-full bg-white/10 border border-white/15 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-300"
						/>
						<button
							type="button"
							onclick={lockTimeCapsule}
							class="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg active:scale-95 transition-all cursor-pointer shrink-0"
						>
							{isCapsuleLocked ? 'Tersimpan ✓' : 'Kunci Target 🔒'}
						</button>
					</div>
				</div>

				<!-- 3. Interactive Yearbook Guestbook (Tanda Tangan Buku Tahunan) -->
				<div class="rounded-3xl p-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">
					<div class="flex items-center justify-between mb-3">
						<h3 class="font-headline-sm text-lg font-bold text-white flex items-center gap-2">
							<span class="material-symbols-outlined text-amber-300 text-[20px]">history_edu</span>
							Buku Tahunan &amp; Ucapan
						</h3>
						<span class="text-xs text-emerald-300 font-semibold">{yearbookEntries.length} Ucapan</span>
					</div>

					<form onsubmit={signYearbook} class="grid grid-cols-1 sm:grid-cols-12 gap-2.5 mb-4">
						<input
							type="text"
							bind:value={guestName}
							placeholder="Namamu"
							class="sm:col-span-4 px-4 py-2.5 rounded-full bg-white/10 border border-white/15 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-300"
						/>
						<input
							type="text"
							bind:value={guestNote}
							placeholder="Tulis ucapan selamat untuk {recipientName}..."
							class="sm:col-span-5 px-4 py-2.5 rounded-full bg-white/10 border border-white/15 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-300"
						/>
						<button
							type="submit"
							class="sm:col-span-3 px-4 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
						>
							Tanda Tangani ✍️
						</button>
					</form>

					<div class="space-y-2.5 max-h-56 overflow-y-auto pr-1">
						{#each yearbookEntries as entry}
							<div class="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start justify-between gap-3">
								<div>
									<p class="text-xs font-extrabold text-amber-300">{entry.name}</p>
									<p class="text-sm text-slate-200 mt-0.5">“{entry.note}”</p>
								</div>
								<span class="text-lg shrink-0">{entry.badge}</span>
							</div>
						{/each}
					</div>
				</div>

				<!-- 4. Digital Archive Wallet Cards -->
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div class="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
						<div class="flex items-center gap-3 min-w-0">
							<div class="w-10 h-10 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
								<span class="material-symbols-outlined text-[20px]">wallet</span>
							</div>
							<div class="min-w-0">
								<p class="text-sm font-bold text-white truncate">Simpan Pass Wisuda</p>
								<p class="text-xs text-slate-400 truncate">NTAG215 • Tamper-Locked</p>
							</div>
						</div>
						<div class="flex gap-1.5 shrink-0">
							<button
								type="button"
								onclick={() => handleWalletPass('Apple')}
								class="px-3 py-1.5 rounded-full bg-white text-slate-950 text-xs font-bold hover:bg-amber-100 cursor-pointer"
							>
								Apple
							</button>
							<button
								type="button"
								onclick={() => handleWalletPass('Google')}
								class="px-3 py-1.5 rounded-full bg-white/15 text-white text-xs font-bold hover:bg-white/25 cursor-pointer"
							>
								Google
							</button>
						</div>
					</div>

					<div class="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
						<div class="flex items-center gap-3 min-w-0">
							<div class="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
								<span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">verified</span>
							</div>
							<div class="min-w-0">
								<p class="text-sm font-bold text-white truncate">Tag #{formattedTag}</p>
								<p class="text-xs text-emerald-300 truncate">Tap &amp; Keep™ Verified</p>
							</div>
						</div>
						<span class="text-xs font-bold text-amber-300 shrink-0">100-Yr Seal</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Floating Docked Music Controller -->
<div class="fixed bottom-6 right-6 z-40 max-w-sm w-[calc(100vw-3rem)] sm:w-auto">
	<div class="bg-[#0d221d]/95 backdrop-blur-2xl px-4 py-3 rounded-full shadow-2xl flex items-center justify-between gap-3 border border-amber-400/30">
		<div class="relative flex-shrink-0">
			<div class="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 flex items-center justify-center shadow-md {isMusicPlaying ? 'animate-[spin_6s_linear_infinite]' : ''}">
				<span class="material-symbols-outlined text-slate-950 text-[18px]" style="font-variation-settings: 'FILL' 1;">school</span>
			</div>
			{#if isMusicPlaying}
				<div class="absolute inset-0 rounded-full ring-2 ring-amber-300 animate-ping opacity-30"></div>
			{/if}
		</div>

		<div class="flex flex-col min-w-0 pr-1">
			<div class="flex items-center gap-1.5">
				<p class="text-xs font-bold text-white truncate">{activeTrack.title}</p>
				<span class="text-[10px] text-amber-300 uppercase font-extrabold">Audio</span>
			</div>
			<p class="text-[11px] text-emerald-200/80 truncate">
				{isMusicPlaying ? `${activeTrack.artist} • Playing` : 'Paused • Tap to Play'}
			</p>
		</div>

		<div class="flex items-center gap-1.5 flex-shrink-0">
			{#if onNextTrack}
				<button
					type="button"
					onclick={onNextTrack}
					aria-label="Ganti Lagu"
					class="w-8 h-8 rounded-full bg-white/10 text-amber-300 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
				>
					<span class="material-symbols-outlined text-[18px]">skip_next</span>
				</button>
			{/if}
			<button
				type="button"
				onclick={onToggleMusic}
				aria-label="Toggle Playback"
				class="w-9 h-9 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer"
			>
				<span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">
					{isMusicPlaying ? 'pause' : 'play_arrow'}
				</span>
			</button>
		</div>
	</div>
</div>

<style>
	@keyframes tossFly {
		0% {
			transform: translate(-50%, 0) rotate(0deg) scale(0.9);
			opacity: 1;
		}
		60% {
			opacity: 1;
		}
		100% {
			transform: translate(calc(-50% + var(--dx)), -180px) rotate(var(--rot)) scale(1.4);
			opacity: 0;
		}
	}
</style>
