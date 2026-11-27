<script lang="ts">
	interface Props {
		size?: number;
		animated?: boolean;
	}

	let { size = 240, animated = true }: Props = $props();
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 240 240"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	class={animated ? 'gift-box-svg' : ''}
	aria-label="Gift box illustration"
>
	<!-- Shadow -->
	<ellipse cx="120" cy="228" rx="80" ry="8" fill="#00000018" />

	<!-- Box body -->
	<rect x="40" y="110" width="160" height="110" rx="8" fill="#98434c" />
	<rect x="40" y="110" width="160" height="110" rx="8" fill="url(#boxGrad)" />

	<!-- Box body highlight edge -->
	<rect x="40" y="110" width="160" height="4" rx="2" fill="#b85560" opacity="0.6" />

	<!-- Vertical ribbon on body -->
	<rect x="108" y="110" width="24" height="110" fill="#f5c563" />
	<rect x="108" y="110" width="24" height="110" fill="url(#ribbonGrad)" />

	<!-- Horizontal ribbon on body -->
	<rect x="40" y="152" width="160" height="20" fill="#f5c563" />
	<rect x="40" y="152" width="160" height="20" fill="url(#ribbonGrad2)" />

	<!-- Ribbon cross center knot -->
	<rect x="106" y="150" width="28" height="24" rx="3" fill="#e8b540" />

	<!-- Lid -->
	<rect x="34" y="88" width="172" height="28" rx="8" fill="#b8505a" />
	<rect x="34" y="88" width="172" height="28" rx="8" fill="url(#lidGrad)" />

	<!-- Lid bottom edge -->
	<rect x="34" y="112" width="172" height="4" rx="2" fill="#8a3540" opacity="0.4" />

	<!-- Ribbon on lid (vertical) -->
	<rect x="108" y="88" width="24" height="28" fill="#f5c563" />

	<!-- Bow – left loop -->
	<ellipse cx="100" cy="78" rx="26" ry="22" fill="#f5c563" transform="rotate(-15 100 78)" />
	<ellipse cx="102" cy="78" rx="18" ry="14" fill="#98434c" transform="rotate(-15 102 78)" opacity="0.15" />

	<!-- Bow – right loop -->
	<ellipse cx="140" cy="78" rx="26" ry="22" fill="#f5c563" transform="rotate(15 140 78)" />
	<ellipse cx="138" cy="78" rx="18" ry="14" fill="#98434c" transform="rotate(15 138 78)" opacity="0.15" />

	<!-- Bow – center knot -->
	<ellipse cx="120" cy="84" rx="14" ry="10" fill="#e8b540" />
	<ellipse cx="120" cy="82" rx="10" ry="7" fill="#f5c563" />

	<!-- Bow – tail left -->
	<path d="M106 88 Q90 100 78 108 Q84 98 96 86Z" fill="#daa030" opacity="0.7" />

	<!-- Bow – tail right -->
	<path d="M134 88 Q150 100 162 108 Q156 98 144 86Z" fill="#daa030" opacity="0.7" />

	<!-- Subtle specular highlight on lid -->
	<rect x="44" y="90" width="60" height="6" rx="3" fill="white" opacity="0.15" />

	<!-- Subtle specular highlight on box -->
	<rect x="44" y="118" width="30" height="4" rx="2" fill="white" opacity="0.08" />

	<!-- Decorative tiny stars -->
	{#if animated}
		<circle cx="52" cy="48" r="2" fill="#f5c563" class="star star-1" />
		<circle cx="188" cy="52" r="1.5" fill="#ffdadb" class="star star-2" />
		<circle cx="170" cy="38" r="2.5" fill="#f5c563" class="star star-3" />
		<circle cx="68" cy="36" r="1.5" fill="#d9c2fd" class="star star-4" />
		<circle cx="210" cy="80" r="1.5" fill="#f5c563" class="star star-5" />
		<circle cx="30" cy="74" r="2" fill="#ffdadb" class="star star-6" />
	{/if}

	<defs>
		<linearGradient id="boxGrad" x1="40" y1="110" x2="40" y2="220" gradientUnits="userSpaceOnUse">
			<stop stop-color="white" stop-opacity="0.08" />
			<stop offset="1" stop-color="black" stop-opacity="0.1" />
		</linearGradient>
		<linearGradient id="lidGrad" x1="34" y1="88" x2="34" y2="116" gradientUnits="userSpaceOnUse">
			<stop stop-color="white" stop-opacity="0.1" />
			<stop offset="1" stop-color="black" stop-opacity="0.08" />
		</linearGradient>
		<linearGradient id="ribbonGrad" x1="108" y1="110" x2="132" y2="110" gradientUnits="userSpaceOnUse">
			<stop stop-color="white" stop-opacity="0.12" />
			<stop offset="0.5" stop-color="white" stop-opacity="0" />
			<stop offset="1" stop-color="black" stop-opacity="0.08" />
		</linearGradient>
		<linearGradient id="ribbonGrad2" x1="40" y1="152" x2="40" y2="172" gradientUnits="userSpaceOnUse">
			<stop stop-color="white" stop-opacity="0.12" />
			<stop offset="1" stop-color="black" stop-opacity="0.08" />
		</linearGradient>
	</defs>
</svg>

<style>
	.gift-box-svg {
		filter: drop-shadow(0 12px 24px rgba(152, 67, 76, 0.25));
	}

	@keyframes twinkle {
		0%, 100% { opacity: 1; transform: scale(1); }
		50% { opacity: 0.3; transform: scale(0.5); }
	}

	.star { transform-origin: center; }
	.star-1 { animation: twinkle 2s ease-in-out infinite; }
	.star-2 { animation: twinkle 2.4s ease-in-out 0.3s infinite; }
	.star-3 { animation: twinkle 1.8s ease-in-out 0.6s infinite; }
	.star-4 { animation: twinkle 2.6s ease-in-out 0.9s infinite; }
	.star-5 { animation: twinkle 2.2s ease-in-out 1.2s infinite; }
	.star-6 { animation: twinkle 2s ease-in-out 1.5s infinite; }
</style>
