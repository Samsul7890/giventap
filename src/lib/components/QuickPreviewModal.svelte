<script lang="ts">
	import type { OccasionCategory } from '../types/tag';

	interface Props {
		occasion: OccasionCategory | null;
		isOpen: boolean;
		onClose: () => void;
		onSelectAndClose: (occasion: OccasionCategory) => void;
	}

	let { occasion, isOpen, onClose, onSelectAndClose }: Props = $props();

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && isOpen) {
			onClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen && occasion}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
	>
		<!-- Backdrop click -->
		<button
			type="button"
			class="absolute inset-0 w-full h-full cursor-default"
			onclick={onClose}
			aria-label="Close dialog"
		></button>

		<div
			class="relative w-full max-w-lg bg-surface-container-lowest rounded-3xl overflow-hidden shadow-[0_24px_50px_-12px_rgba(152,67,76,0.3)] border border-outline-variant/30 z-10 flex flex-col"
		>
			<!-- Image Preview -->
			<div class="relative w-full aspect-[16/10] overflow-hidden bg-surface-container">
				<img
					src={occasion.image}
					alt={occasion.title}
					class="w-full h-full object-cover"
				/>
				<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

				<!-- Close Button -->
				<button
					type="button"
					onclick={onClose}
					class="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer"
					aria-label="Close"
				>
					<span class="material-symbols-outlined text-[18px]">close</span>
				</button>

				<!-- Badge info -->
				<div class="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
					<div class="flex items-center gap-2">
						<span class="px-2.5 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-[11px] font-bold">
							Occasion #{occasion.number}
						</span>
						<span class="px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-[11px] font-medium">
							{occasion.chipType} Chip Ready
						</span>
					</div>
					<div class="flex items-center gap-1 font-label-sm text-[12px]">
						<span class="material-symbols-outlined text-[16px] text-primary-fixed" style="font-variation-settings: 'FILL' 1;">favorite</span>
						<span>{occasion.likes} taps</span>
					</div>
				</div>
			</div>

			<!-- Modal Body -->
			<div class="p-6 flex flex-col gap-4">
				<div>
					<div class="flex items-center justify-between">
						<h3 id="modal-title" class="font-headline-sm text-headline-sm text-primary font-bold">
							{occasion.title} {occasion.emoji}
						</h3>
						<span class="px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-semibold">
							{occasion.filterGroup}
						</span>
					</div>
					<p class="font-body-sm text-body-sm text-on-surface-variant mt-1">
						By {occasion.studio} • {occasion.edition}
					</p>
				</div>

				<p class="font-body-md text-body-md text-on-surface leading-relaxed">
					{occasion.description}
				</p>

				<!-- Feature Highlights -->
				<div class="p-3.5 rounded-2xl bg-surface-container-low/70 border border-outline-variant/20 flex flex-col gap-2">
					<div class="flex items-center gap-2 text-on-surface text-label-md font-semibold">
						<span class="material-symbols-outlined text-primary text-[18px]">verified</span>
						<span>Keepsake Vault Inclusions</span>
					</div>
					<ul class="text-body-sm text-on-surface-variant space-y-1 list-disc list-inside">
						<li>Embedded NFC tap-to-play responsive recipient view</li>
						<li>High-fidelity dual photos and floating audio keepsake</li>
						<li>Permanent cryptographic physical write protection</li>
					</ul>
				</div>

				<!-- Action Buttons -->
				<div class="flex items-center justify-end gap-3 pt-2">
					<button
						type="button"
						onclick={onClose}
						class="px-4 py-2.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors cursor-pointer"
					>
						Close
					</button>
					<button
						type="button"
						onclick={() => onSelectAndClose(occasion)}
						class="px-5 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold shadow-md hover:bg-primary/95 transition-all cursor-pointer flex items-center gap-1.5"
					>
						<span class="material-symbols-outlined text-[16px]">check</span>
						<span>Select {occasion.title}</span>
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

