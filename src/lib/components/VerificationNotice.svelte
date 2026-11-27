<script lang="ts">
	interface Props {
		chipModel?: string;
		rewritesLeft?: number;
		totalRewrites?: number;
		revision?: string;
	}

	let {
		chipModel = 'NTAG213',
		rewritesLeft = 1,
		totalRewrites = 3,
		revision = 'Rev. 2025.2'
	}: Props = $props();
</script>

<div class="w-full">
	<!-- Quick Physical Verification Pill Callout -->
	<div class="mt-8 rounded-2xl p-4 bg-surface-container-high/60 flex items-start gap-space-sm text-on-surface-variant border border-outline-variant/20">
		<span class="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5" style="font-variation-settings: 'FILL' 1;">
			lightbulb
		</span>
		<div class="flex-1">
			<p class="font-body-sm text-body-sm leading-relaxed">
				<strong class="font-semibold text-on-surface">Physical Reassurance:</strong> You can test tap this NFC tag with any iOS or Android device at any point while composing. The permanent lock happens only when you seal it.
			</p>
		</div>
	</div>

	<!-- Tag Security & Cryptographic Micro-Strip -->
	<div class="mt-6 pt-5 flex flex-wrap items-center justify-between gap-2 text-on-surface-variant font-label-sm text-label-sm border-t border-outline-variant/20">
		<div class="flex items-center gap-1.5">
			<span class="w-2 h-2 rounded-full bg-tertiary"></span>
			<span>{chipModel} Micro-Chip Ready</span>
		</div>
		<div class="flex items-center gap-1">
			<span class="material-symbols-outlined text-[14px]">lock_open</span>
			<span>Writable ({rewritesLeft} of {totalRewrites} safe rewrites)</span>
		</div>
		<div class="text-on-surface-variant opacity-75">
			{revision}
		</div>
	</div>
</div>

