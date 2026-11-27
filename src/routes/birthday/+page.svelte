<script lang="ts">
	import type { PageProps } from './$types';
	import GiftBoxSvg from '#lib/components/GiftBoxSvg.svelte';

	let { data }: PageProps = $props();

	// svelte-ignore state_referenced_locally
	let recipientName = $state(data.recipientName || 'Alisa');
	let senderName = $state('Orang-orang yang menyayangimu 💛');
	let birthdayMessage = $state(
		'Selamat ulang tahun! Setiap detik bersamamu adalah berkah yang tak ternilai. Semoga di usia yang baru ini, langkahmu selalu dipeluk bahagia, impianmu mekar satu per satu, dan senyum manismu tak pernah pudar.'
	);

	$effect(() => {
		if (data.recipientName) recipientName = data.recipientName;
	});

	const formattedTag = $derived(
		data.slug.toUpperCase().startsWith('TK-') ? data.slug.toUpperCase() : `TK-${data.slug.toUpperCase()}`
	);

	// Interactive states
	let isOpened = $state(false);
	let isBoxOpening = $state(false);
	let isCandleBlown = $state(false);
	let cheerCount = $state(24);
	let isCheerTapped = $state(false);

	// Music player state
	let audioEl: HTMLAudioElement | null = $state(null);
	let isMusicPlaying = $state(false);
	let synthCtx: AudioContext | null = null;
	let synthTimer: number | null = null;

	// Happy Birthday melody notes (frequency, duration in seconds)
	const MELODY: [number, number][] = [
		[261.63, 0.4], [261.63, 0.2], [293.66, 0.6], [261.63, 0.6], [349.23, 0.6], [329.63, 1.0],
		[261.63, 0.4], [261.63, 0.2], [293.66, 0.6], [261.63, 0.6], [392.00, 0.6], [349.23, 1.0],
		[261.63, 0.4], [261.63, 0.2], [523.25, 0.6], [440.00, 0.6], [349.23, 0.6], [329.63, 0.6], [293.66, 0.8],
		[466.16, 0.4], [466.16, 0.2], [440.00, 0.6], [349.23, 0.6], [392.00, 0.6], [349.23, 1.2]
	];

	function playSynthMelody() {
		try {
			if (!synthCtx || synthCtx.state === 'closed') {
				const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
				synthCtx = new AudioContextClass();
			}
			if (synthCtx.state === 'suspended') {
				synthCtx.resume();
			}

			let startTime = synthCtx.currentTime + 0.1;
			MELODY.forEach(([freq, dur]) => {
				if (!synthCtx) return;
				const osc = synthCtx.createOscillator();
				const gain = synthCtx.createGain();

				// Celesta/music box timbre (sine with gentle harmonics)
				osc.type = 'sine';
				osc.frequency.setValueAtTime(freq, startTime);

				gain.gain.setValueAtTime(0, startTime);
				gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
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
					playSynthMelody();
				}
			}, totalDur * 1000);
		} catch {
			// Ignore audio context errors if browser strictly blocks
		}
	}

	function stopSynthMelody() {
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

	function startMusic() {
		isMusicPlaying = true;
		if (audioEl) {
			audioEl.play().catch(() => {
				// If external mp3 cannot be loaded (sandbox / offline), synthesize the melody!
				playSynthMelody();
			});
		} else {
			playSynthMelody();
		}
	}

	function pauseMusic() {
		isMusicPlaying = false;
		if (audioEl) {
			audioEl.pause();
		}
		stopSynthMelody();
	}

	function toggleMusic() {
		if (isMusicPlaying) {
			pauseMusic();
		} else {
			startMusic();
		}
	}

	// Confetti
	let confettiCanvas: HTMLCanvasElement | null = $state(null);

	function triggerConfetti() {
		if (!confettiCanvas) return;
		const ctx = confettiCanvas.getContext('2d');
		if (!ctx) return;
		const W = (confettiCanvas.width = window.innerWidth);
		const H = (confettiCanvas.height = window.innerHeight);
		const colors = ['#f59e0b', '#ec4899', '#f43f5e', '#8b5cf6', '#10b981', '#ffffff', '#fbbf24'];
		const P: { x: number; y: number; s: number; c: string; vx: number; vy: number; t: number; ti: number }[] = [];
		for (let i = 0; i < 90; i++) {
			P.push({
				x: W / 2, y: H * 0.45,
				s: Math.random() * 8 + 4,
				c: colors[Math.floor(Math.random() * colors.length)],
				vx: (Math.random() - 0.5) * 16,
				vy: (Math.random() - 0.8) * 18,
				t: 0, ti: Math.random() * 0.08 + 0.04
			});
		}
		let alpha = 1;
		(function draw() {
			if (!ctx) return;
			ctx.clearRect(0, 0, W, H);
			alpha -= 0.007;
			if (alpha <= 0) { ctx.clearRect(0, 0, W, H); return; }
			ctx.globalAlpha = Math.max(0, alpha);
			for (const p of P) {
				p.x += p.vx; p.y += p.vy; p.vy += 0.35; p.vx *= 0.98;
				p.t += p.ti;
				ctx.fillStyle = p.c;
				ctx.beginPath();
				ctx.ellipse(p.x, p.y, p.s, p.s / 2, Math.sin(p.t) * 0.8, 0, Math.PI * 2);
				ctx.fill();
			}
			requestAnimationFrame(draw);
		})();
	}

	function handleOpenGift() {
		if (isOpened || isBoxOpening) return;
		isBoxOpening = true;
		triggerConfetti();

		// Start birthday music immediately on user gesture
		if (!isMusicPlaying) {
			startMusic();
		}

		setTimeout(() => {
			isOpened = true;
			isBoxOpening = false;
			triggerConfetti();
		}, 650);
	}

	function handleBlowCandle() {
		if (isCandleBlown) return;
		isCandleBlown = true;
		triggerConfetti();
	}

	function handleCheer() {
		cheerCount++;
		isCheerTapped = true;
		setTimeout(() => { isCheerTapped = false; }, 800);
	}
</script>

<svelte:head>
	<title>Kado Spesial untuk {recipientName} 🎁 — Tap &amp; Keep</title>
	<meta name="description" content="Kado ucapan ulang tahun digital interaktif untuk {recipientName}." />
</svelte:head>

<!-- Audio element (royalty-free birthday melody) -->
<audio
	bind:this={audioEl}
	src="https://cdn.pixabay.com/download/audio/2022/02/22/audio_d1718ab41b.mp3?filename=happy-birthday-110058.mp3"
	loop
	preload="auto"
	onerror={() => {
		// Fallback to Web Audio synthesis if network fails
		if (isMusicPlaying) playSynthMelody();
	}}
></audio>

<!-- Confetti overlay -->
<canvas bind:this={confettiCanvas} class="fixed inset-0 pointer-events-none z-50 w-full h-full"></canvas>

<!-- Outer Container with guaranteed high-contrast dark gradient background -->
<div class="relative min-h-screen w-full bg-gradient-to-b from-[#180b0e] via-[#241115] to-[#0d0709] text-white flex flex-col justify-between overflow-x-hidden selection:bg-amber-400 selection:text-black">

	<!-- Subtle ambient lights for warm aesthetic depth -->
	<div class="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
		<div class="absolute -top-32 -left-20 w-[420px] h-[420px] rounded-full bg-rose-600/15 blur-[120px]"></div>
		<div class="absolute top-1/3 -right-24 w-[380px] h-[380px] rounded-full bg-amber-500/10 blur-[110px]"></div>
		<div class="absolute bottom-20 left-1/4 w-[360px] h-[360px] rounded-full bg-purple-600/10 blur-[100px]"></div>
	</div>

	<!-- Floating Music Pill -->
	<div class="fixed bottom-6 right-6 z-40">
		<button
			type="button"
			onclick={toggleMusic}
			class="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full backdrop-blur-xl text-sm font-semibold shadow-2xl transition-all cursor-pointer border {isMusicPlaying ? 'bg-amber-500/20 text-amber-200 border-amber-400/40 shadow-amber-500/20' : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/15 hover:text-white'}"
			aria-label={isMusicPlaying ? 'Matikan musik' : 'Putar musik'}
		>
			<span class="material-symbols-outlined text-[20px] {isMusicPlaying ? 'text-amber-300' : 'text-white/70'}" style="font-variation-settings: 'FILL' 1;">
				{isMusicPlaying ? 'music_note' : 'music_off'}
			</span>
			<span class="text-xs tracking-wide">
				{isMusicPlaying ? 'Musik Berputar' : 'Putar Musik'}
			</span>
			{#if isMusicPlaying}
				<span class="flex items-end gap-[3px] h-3.5 pl-0.5" aria-hidden="true">
					<span class="w-[3px] bg-amber-300 rounded-full animate-[equalizer1_0.6s_ease-in-out_infinite]"></span>
					<span class="w-[3px] bg-amber-300 rounded-full animate-[equalizer2_0.5s_ease-in-out_0.1s_infinite]"></span>
					<span class="w-[3px] bg-amber-300 rounded-full animate-[equalizer3_0.7s_ease-in-out_0.2s_infinite]"></span>
				</span>
			{/if}
		</button>
	</div>

	<!-- Main Content Area -->
	<div class="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12 flex-1 flex flex-col justify-center">

		<!-- ───── STATE 1: GIFT CLOSED ───── -->
		{#if !isOpened}
			<div class="flex-1 flex flex-col items-center justify-center text-center gap-6 py-6 sm:py-10">

				<!-- Edition Badge -->
				<div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-amber-200 text-xs sm:text-sm font-semibold border border-amber-300/30 shadow-sm">
					<span class="material-symbols-outlined text-[16px] text-amber-300" style="font-variation-settings: 'FILL' 1;">cake</span>
					<span>Spesial Hari Ulang Tahun</span>
				</div>

				<!-- High-Contrast Titles -->
				<div class="max-w-lg space-y-3">
					<h1 class="font-headline-lg text-3xl sm:text-5xl font-bold leading-tight text-white tracking-tight drop-shadow-sm">
						Kado Spesial untuk <br />
						<span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-100 font-extrabold">
							{recipientName}
						</span> 🎁
					</h1>
					<p class="text-rose-100/90 text-sm sm:text-base leading-relaxed max-w-md mx-auto font-normal">
						Ada kejutan hangat dan kenangan istimewa yang tersimpan khusus untukmu. Ketuk kado di bawah ini untuk membukanya!
					</p>
				</div>

				<!-- Interactive SVG Gift Box -->
				<button
					type="button"
					onclick={handleOpenGift}
					class="relative group cursor-pointer mt-3 focus:outline-none focus:ring-4 focus:ring-amber-300/40 rounded-3xl p-3 transition-transform"
					aria-label="Buka Kado Ulang Tahun"
				>
					<!-- Dynamic Warm Glow -->
					<div class="absolute inset-0 -m-8 rounded-full bg-rose-600/25 blur-3xl group-hover:bg-rose-500/40 transition-all duration-500"></div>

					<!-- Floating Gift Animation -->
					<div class="relative transform group-hover:scale-105 group-active:scale-95 transition-transform duration-300 {isBoxOpening ? 'animate-bounce' : 'animate-[float_3s_ease-in-out_infinite]'}">
						<GiftBoxSvg size={230} />
					</div>

					<!-- Prominent CTA Pill -->
					<div class="mt-6 inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-gray-950 font-bold text-sm shadow-xl shadow-amber-500/25 group-hover:from-amber-300 group-hover:to-amber-400 group-hover:shadow-amber-500/40 transition-all">
						<span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">touch_app</span>
						<span>Ketuk untuk Membuka</span>
					</div>
				</button>

				<!-- NFC Tag Verification -->
				<p class="mt-4 text-xs text-rose-200/60 flex items-center gap-1.5 font-medium">
					<span class="material-symbols-outlined text-[15px] text-emerald-400" style="font-variation-settings: 'FILL' 1;">verified</span>
					NFC Tag #{formattedTag} · Tap &amp; Keep™ Verified
				</p>
			</div>

		<!-- ───── STATE 2: GIFT OPENED ───── -->
		{:else}
			<div class="flex flex-col gap-8 sm:gap-10 pb-16 pt-2">

				<!-- Celebration Header -->
				<section class="text-center pt-2 space-y-3">
					<div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-400/30">
						<span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
						Kado Berhasil Dibuka 🎉
					</div>
					<h1 class="font-headline-lg text-3xl sm:text-5xl leading-tight font-bold text-white tracking-tight drop-shadow-md">
						Selamat Ulang Tahun,{' '}
						<span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-100">
							{recipientName}
						</span>! ✨
					</h1>
					<p class="text-rose-100/90 text-sm sm:text-lg italic max-w-xl mx-auto font-medium">
						"Semoga di setiap langkah barumu selalu dipeluk berkah, kebahagiaan, dan cinta yang tulus."
					</p>
				</section>

				<!-- Virtual Cake & Candle Section -->
				<section class="w-full max-w-md mx-auto rounded-3xl p-6 sm:p-8 bg-white text-gray-900 shadow-2xl border border-rose-100 text-center">
					<span class="inline-block px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-[11px] font-bold uppercase tracking-widest mb-5 border border-rose-200/60">
						Tiup Lilin Ulang Tahun
					</span>

					<!-- Candle + Cake Animation -->
					<div class="flex flex-col items-center mb-5">
						<!-- Flame -->
						<div class="relative h-8 flex items-center justify-center mb-0.5">
							{#if !isCandleBlown}
								<div class="w-4 h-6 bg-gradient-to-t from-orange-500 via-yellow-400 to-yellow-100 rounded-full blur-[0.5px] animate-[flicker_0.8s_ease-in-out_infinite] shadow-[0_0_14px_#f59e0b,0_0_28px_#f59e0b60]"></div>
							{:else}
								<span class="material-symbols-outlined text-gray-400 text-[20px]">air</span>
							{/if}
						</div>
						<!-- Candle Wick -->
						<div class="w-[3px] h-6 bg-gradient-to-b from-amber-100 to-amber-200 rounded-t border border-amber-300"></div>
						<!-- Cake -->
						<div class="w-36 h-14 sm:w-44 sm:h-16 rounded-2xl bg-gradient-to-b from-pink-200 to-pink-300 shadow-md border-2 border-white flex items-center justify-center relative overflow-hidden">
							<span class="text-3xl select-none">🎂</span>
							<div class="absolute top-0 inset-x-0 h-3 bg-white/60 rounded-b-lg"></div>
						</div>
					</div>

					{#if !isCandleBlown}
						<button
							type="button"
							onclick={handleBlowCandle}
							class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#98434c] text-white text-sm font-bold shadow-lg shadow-[#98434c]/30 hover:bg-[#83353e] hover:scale-105 active:scale-95 transition-all cursor-pointer"
						>
							<span class="material-symbols-outlined text-[18px]">mode_fan</span>
							Tiup Lilin &amp; Make a Wish 🕯️
						</button>
						<p class="mt-3 text-xs text-gray-500">Pikirkan permohonan tulusmu sebelum meniup!</p>
					{:else}
						<div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm leading-relaxed">
							<p class="font-bold mb-1 text-emerald-950">🎉 Wish You All The Best, {recipientName}!</p>
							<p class="text-xs text-emerald-800">Lilin berhasil ditiup! Semoga semua impian dan doamu dikabulkan semesta.</p>
						</div>
					{/if}
				</section>

				<!-- Content Grid: Photo Gallery & Birthday Letter -->
				<div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

					<!-- Left: Polaroid Memories -->
					<div class="lg:col-span-5">
						<div class="bg-white p-5 sm:p-6 rounded-3xl shadow-2xl border border-rose-100 text-gray-900">
							<div class="flex items-center justify-between mb-4">
								<div class="flex items-center gap-2">
									<span class="material-symbols-outlined text-[#98434c] text-[20px]" style="font-variation-settings: 'FILL' 1;">photo_library</span>
									<span class="text-sm font-bold text-gray-900">Galeri Kenangan</span>
								</div>
								<span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-[#98434c] border border-rose-200/50">2 Foto</span>
							</div>

							<!-- Polaroid 1 -->
							<div class="relative bg-gray-50 p-3 rounded-2xl shadow-md transform -rotate-2 hover:rotate-0 transition-transform duration-300 z-10 border border-gray-200/60">
								<div class="aspect-[4/3] w-full rounded-xl overflow-hidden bg-gray-200">
									<img
										src="https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80"
										alt="Momen Bahagia"
										class="w-full h-full object-cover"
									/>
								</div>
								<p class="pt-2.5 pb-0.5 px-1 text-xs text-gray-700 italic font-medium">Senyum Terbaik Hari Ini 🎂</p>
							</div>

							<!-- Polaroid 2 -->
							<div class="relative -mt-6 ml-4 sm:ml-6 bg-gray-50 p-3 rounded-2xl shadow-lg transform rotate-2 hover:rotate-0 transition-transform duration-300 z-20 border border-gray-200/60">
								<div class="aspect-[4/3] w-full rounded-xl overflow-hidden bg-gray-200">
									<img
										src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80"
										alt="Tawa dan Kebersamaan"
										class="w-full h-full object-cover"
									/>
								</div>
								<p class="pt-2.5 pb-0.5 px-1 text-xs text-gray-700 italic font-medium">Tawa &amp; Kebahagiaan 🎉</p>
							</div>

							<div class="mt-5 pt-3.5 flex items-center justify-between text-xs text-gray-500 border-t border-gray-100">
								<span class="flex items-center gap-1.5 text-emerald-700 font-semibold">
									<span class="material-symbols-outlined text-[15px]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
									Archival Keepsake
								</span>
								<button
									type="button"
									onclick={() => (isOpened = false)}
									class="text-[#98434c] hover:text-[#7d2f37] hover:underline font-bold cursor-pointer"
								>
									Tutup Kado ↩
								</button>
							</div>
						</div>
					</div>

					<!-- Right: Birthday Letter -->
					<div class="lg:col-span-7">
						<div class="bg-white p-6 sm:p-8 lg:p-10 rounded-3xl shadow-2xl border border-rose-100 text-gray-900">
							<!-- Card Header Ribbon -->
							<div class="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
								<div class="flex items-center gap-2">
									<span class="px-3 py-1 rounded-full bg-[#98434c] text-white text-[11px] font-bold tracking-wide">
										Birthday Letter
									</span>
									<span class="text-xs text-gray-500 font-medium">untuk {recipientName}</span>
								</div>
								<span class="material-symbols-outlined text-[#98434c] text-[22px]" style="font-variation-settings: 'FILL' 1;">
									favorite
								</span>
							</div>

							<h2 class="font-headline-lg text-2xl sm:text-3xl text-gray-950 font-bold tracking-tight mb-4 leading-snug">
								Untuk Orang Tersayang, {recipientName}! 🎈
							</h2>

							<div class="text-sm sm:text-base text-gray-700 leading-relaxed space-y-4">
								<p>{birthdayMessage}</p>
								<p>Semoga hari-harimu selalu diwarnai dengan kehadiran orang-orang yang tulus menyayangimu, tawa yang tak ada habisnya, dan ketenangan serta keberkahan di setiap hela nafasmu.</p>
							</div>

							<!-- Sign-Off & Cheer Button -->
							<div class="mt-8 pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
								<div>
									<p class="text-[11px] uppercase tracking-wider text-gray-400 font-semibold mb-0.5">Dari yang selalu mendoakanmu,</p>
									<p class="font-headline-md text-xl text-[#98434c] font-bold italic">{senderName}</p>
								</div>
								<button
									type="button"
									onclick={handleCheer}
									class="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer {isCheerTapped ? 'bg-[#98434c] text-white scale-95 shadow-md' : 'bg-rose-50 text-[#98434c] border border-rose-200 hover:bg-[#98434c] hover:text-white'}"
								>
									<span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">celebration</span>
									Kirim Doa ({cheerCount})
								</button>
							</div>
						</div>
					</div>
				</div>

				<!-- Tag Verification Footer -->
				<p class="text-center text-xs text-rose-200/60 flex items-center justify-center gap-1.5 mt-4 font-medium">
					<span class="material-symbols-outlined text-[14px] text-emerald-400" style="font-variation-settings: 'FILL' 1;">verified</span>
					NFC Tag #{formattedTag} · Sealed Keepsake · Tap &amp; Keep™
				</p>
			</div>
		{/if}
	</div>
</div>

<style>
	@keyframes float {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-12px); }
	}
	@keyframes flicker {
		0%, 100% { transform: scaleY(1) scaleX(1); opacity: 1; }
		25% { transform: scaleY(1.1) scaleX(0.9); opacity: 0.9; }
		50% { transform: scaleY(0.95) scaleX(1.05); opacity: 1; }
		75% { transform: scaleY(1.05) scaleX(0.95); opacity: 0.85; }
	}
	@keyframes equalizer1 {
		0%, 100% { height: 5px; }
		50% { height: 14px; }
	}
	@keyframes equalizer2 {
		0%, 100% { height: 14px; }
		50% { height: 6px; }
	}
	@keyframes equalizer3 {
		0%, 100% { height: 7px; }
		50% { height: 15px; }
	}
</style>
