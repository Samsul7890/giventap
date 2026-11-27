import type { PageLoad } from './$types';
import { getTagInfo } from '#lib/data/occasions';

export const load: PageLoad = async ({ url }) => {
	const rawTag = url.searchParams.get('tag');
	const { tagDetails, isExisting } = getTagInfo(rawTag);

	let initialRecipient = 'Mateo';
	if (rawTag && !rawTag.toUpperCase().startsWith('TK-') && rawTag.length < 24) {
		initialRecipient = rawTag.charAt(0).toUpperCase() + rawTag.slice(1);
	}

	return {
		slug: tagDetails.slug,
		tagDetails,
		isExisting,
		rawTag: rawTag || '',
		recipientName: initialRecipient
	};
};
