export type FilterGroup = 'all' | 'romance' | 'milestones' | 'celebrations' | 'spontaneous';

export type ViewMode = 'grid' | 'agenda';

export type SortMode = 'curated' | 'popular' | 'title';

export interface OccasionBadge {
	label: string;
	variant?: 'popular' | 'sotd' | 'timeless' | 'honor' | 'keepsake' | 'new-era' | 'milestone' | 'everlasting' | 'vows' | 'anytime' | 'spontaneous';
	icon?: string;
}

export interface OccasionCategory {
	id: string;
	number: string;
	title: string;
	emoji: string;
	edition: string;
	studio: string;
	theme: string;
	filterGroup: 'romance' | 'milestones' | 'celebrations' | 'spontaneous';
	description: string;
	image: string;
	badges: OccasionBadge[];
	chipType: string;
	likes: string;
	isVerified?: boolean;
}

export interface TagDetails {
	slug: string;
	chipModel: string;
	status: string;
	rewritesLeft: number;
	totalRewrites: number;
	revision: string;
	isLocked: boolean;
	isExisting?: boolean;
	templateId?: string;
	templateTitle?: string;
}

