import type { PageLoad } from './$types';
import { OCCASIONS, getTagInfo } from '#lib/data/occasions';

export const load: PageLoad = async ({ url }) => {
	const rawTag = url.searchParams.get('tag');
	const selectedParam = url.searchParams.get('selected');
	const { tagDetails, selectedTemplateId, isExisting } = getTagInfo(rawTag);

	// Explicit ?selected= overrides the tag's template selection if provided
	const initialOccasionId = selectedParam || selectedTemplateId;

	return {
		slug: tagDetails.slug,
		tagDetails,
		occasions: OCCASIONS,
		initialOccasionId,
		isExisting,
		hasTagParam: rawTag !== null && rawTag.trim() !== ''
	};
};
