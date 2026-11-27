import type { PageLoad } from './$types';
import { OCCASIONS, getDefaultTagDetails } from '#lib/data/occasions';

export const load: PageLoad = async ({ params, url }) => {
	const slug = params.slug;
	const tagDetails = getDefaultTagDetails(slug);
	const initialOccasionId = url.searchParams.get('selected') || 'valentine';

	return {
		slug,
		tagDetails,
		occasions: OCCASIONS,
		initialOccasionId
	};
};
