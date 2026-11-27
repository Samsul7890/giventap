import type { OccasionCategory, TagDetails } from '../types/tag';

export const OCCASIONS: OccasionCategory[] = [
	{
		id: 'birthday',
		number: '01',
		title: 'Birthday Celebration',
		emoji: '🎉',
		edition: 'Joyful Confetti Edition',
		studio: 'Tap & Keep Studio',
		theme: 'honey',
		filterGroup: 'celebrations',
		description: 'Celebrate another wonderful year of life, personal growth, and vibrant cheer.',
		image: 'https://lh3.googleusercontent.com/aida/AEtjO1W6b6ZtqbIl7993756QX2A9WHnfK_VVQNONK4S6sOkvz76MeA9onT167uoco_ftBQlrd1oV92pTtGgeLZURVbk-cZQJXtn0Uzc2o5GL2B20ZLJsruQN70tzm7dcwZuJjZSdfsvfjYXTdQSDCj_X3RXH1ke68duU64nmbz0gBHtoh08pi1UA0IuH9TqDI2u6h8kkj3grAJnBBQouKlmR6OrmELrBsvXVAa1tIj_TbixOyA',
		badges: [
			{ label: 'Popular', variant: 'popular' },
			{ label: 'SOTD', variant: 'sotd', icon: 'star' }
		],
		chipType: 'NTAG215',
		likes: '2.4k'
	},
	{
		id: 'anniversary',
		number: '02',
		title: 'Romantic Anniversary',
		emoji: '🥂',
		edition: 'Golden Toast Edition',
		studio: 'Tap & Keep Studio',
		theme: 'champagne',
		filterGroup: 'romance',
		description: 'Milestones, cherished dates, and enduring affection poured into one eternal toast.',
		image: 'https://lh3.googleusercontent.com/aida/AEtjO1UYa57Re3RjO08YNm9__gpnSA603sI-tVd_TsuJpj_aETOsztkcjglK3aAv7UKuHOMm5MvT-Xi4xB5eu7Nwuv31dPFUp5rk9K7zZUnXWUbLwpkeRbW6aI2Woa3r_FrZalHUaYmHKDR7oGe8fA9_LwaXfb2vjCuwdZ2YaZgCwDyS-GM5KjMxFPK4f8FitaZE8x2EBLi5HA7-fAp62WAdEG8YVPLzfAAvG18PzrTZTnRuUw',
		badges: [
			{ label: 'Timeless', variant: 'timeless' },
			{ label: 'Honor', variant: 'honor' }
		],
		chipType: 'NTAG215',
		likes: '1.9k'
	},
	{
		id: 'valentine',
		number: '03',
		title: 'Be My Valentine',
		emoji: '❤️',
		edition: 'Heartfelt Rose Edition',
		studio: 'Tap & Keep Studio',
		theme: 'rose',
		filterGroup: 'romance',
		description: 'For the one who holds your heart and secret smiles, wrapped in luminous botanicals.',
		image: 'https://lh3.googleusercontent.com/aida/AEtjO1WaWEgnwCrnCrXE8lanO-IU6ZSgqIYaQ8-wMneMfO8T9iLbt-5HM21q5_FiGAUo_CmDBQqC8NjGU6qermGujvs5wOvX90hqw_jrQmtxDgkYgI_1jz0JxuF0h3JLEw4gOPYBtwlZnzrY-CA2bIZfidSns0Nphp-zotoMTDu5UEUsKg8U7JLaiOba_HFfyMiYK4Aqp-QMXx9vl3gg-70nbZ4U5GnQl8oVNRiAZq__AjclQA',
		badges: [
			{ label: 'Keepsake Pick', variant: 'keepsake' }
		],
		chipType: 'NTAG215',
		likes: '3.8k',
		isVerified: true
	},
	{
		id: 'graduation',
		number: '04',
		title: 'Graduation & Honors',
		emoji: '🎓',
		edition: 'Golden Tassel Edition',
		studio: 'Tap & Keep Studio',
		theme: 'emerald',
		filterGroup: 'milestones',
		description: 'New chapters, hard-earned dreams, and boundless parental and personal pride.',
		image: 'https://lh3.googleusercontent.com/aida/AEtjO1XQhii0QauFEYm1_YakmoIWqeIQCK_Ml4HQdF3lUcwPPAEqQQqwBIukLdu923RsuQN2OlG8rx5XRc_AsuC7emu1oatN-h4Uj1L7aDSIZ4MbZC58N3Fvjb0vUs_Mwqzfr1xjYvTD03VtWPzNgDuWWDm-EFNrasbshoQ17OROGpRXNSgEKBZHnlkE9c1AAp0Cd_9Yw3rN2yA_JPMLzf5ti4F_M7DBeSf3_SlmGX5YbtxLeA',
		badges: [
			{ label: 'New Era', variant: 'new-era' },
			{ label: 'Milestone', variant: 'milestone' }
		],
		chipType: 'NTAG215',
		likes: '1.4k'
	},
	{
		id: 'wedding',
		number: '05',
		title: 'Wedding & Engagement',
		emoji: '💍',
		edition: 'Gardenia Gold Edition',
		studio: 'Tap & Keep Studio',
		theme: 'gold',
		filterGroup: 'milestones',
		description: 'Two souls intertwining into one lifelong journey, sealed in gold and ethereal tulle.',
		image: 'https://lh3.googleusercontent.com/aida/AEtjO1Xkjq3CCGlsrWGwWCslstvxLTQAU3wryXCA1VFkiM7q9MtIl9b8ZM4QPI8GDGU33p2_Qzo_3Z4YCDPLaB9bXwL7lmO61qvXxsc6_8Y0HxwV48v6-jYebqQfj71rrz1XY-sZNYEBWOHHNeH-qaVhhwnXFnpnbXxmO3CqZU2mRm_-CR3QctVe20CeI4rzdhHy6eB9YileHBHHgR1BdLw06_pLqETSov2UriOeHeZMH71ziA',
		badges: [
			{ label: 'Everlasting', variant: 'everlasting' },
			{ label: 'Vows', variant: 'vows' }
		],
		chipType: 'NTAG215',
		likes: '3.1k'
	},
	{
		id: 'just-because',
		number: '06',
		title: 'Just Because',
		emoji: '💌',
		edition: 'Wildflower Gratitude Edition',
		studio: 'Tap & Keep Studio',
		theme: 'lavender',
		filterGroup: 'spontaneous',
		description: 'The quiet, unscripted moments that mean the most. No calendar excuse needed.',
		image: 'https://lh3.googleusercontent.com/aida/AEtjO1WEfugv8FSsNp75YcdOS8lEQ_WbB-OiIRw1s8WjLZu-lfY1JI0O2NWd0pB5jLs1EwcXrVlGbEOXaRX1pMa-J4Get-jjKtKrvL2Dfc04qeoGNetMFFw_y4i5jCfmeRXXYG0sUamBS05XiXv3ybAL1He2rKBhfjfY_vgWpGgLg47ensUfw23mfCD_dVopp3LHZ0zGZGONnbdLrSlHVmh0CiFOgDx2YG2TA2ylR-ZhSA-YiA',
		badges: [
			{ label: 'Anytime', variant: 'anytime' },
			{ label: 'Spontaneous', variant: 'spontaneous' }
		],
		chipType: 'NTAG215',
		likes: '2.1k'
	}
];

export function getDefaultTagDetails(slug: string): TagDetails {
	const formattedSlug = slug ? slug.toUpperCase() : 'TK-8492';
	return {
		slug: formattedSlug.startsWith('TK-') ? formattedSlug : `TK-${formattedSlug}`,
		chipModel: 'NTAG213',
		status: 'First Tap Detected',
		rewritesLeft: 1,
		totalRewrites: 3,
		revision: 'Rev. 2025.2',
		isLocked: false
	};
}

