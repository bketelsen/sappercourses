// Converts the raw resources data into an expanded form.
// This is expected to be run client-side or by build scripts,
// so the raw untransformed data is what's sent over the wire.
// This keeps the definition concise, the transferred data small,
// and the programming usage simple and consistent. (for example, it sorts tags)
export const transformResourceData = data => {
	const resources = data.resources.map(transformResource);
	return {
		...data,
		resources,
		tags: extractTags(resources),
	};
};

const transformResource = resource => {
	const { name } = resource;
	// A resource name in `backticks` signals it's the NPM package name.
	const isNpmPackage = name[0] === '`' && name[name.length - 1] === '`';
	const finalName = isNpmPackage ? name.slice(1, -1) : name;
	const result = {
		...resource,
		name: finalName,
		isGitHubRepo: isGitHubRepo(resource),
		isNpmPackage,
		tags: transformTags(resource),
	};
	return result;
};

const OFFICIAL_TAG = 'official';

const transformTags = resource => {
	const tags = new Set(resource.tags);
	if (isOfficial(resource)) { // infer if the 'official' tag should be added
		tags.add(OFFICIAL_TAG);
	}
	return Array.from(tags).sort((a, b) =>
		a === OFFICIAL_TAG ? -1 : b === OFFICIAL_TAG ? 1 : a > b ? 1 : -1,
	);
};

const OFFICIAL_URL_MATCHER = /^(https?:\/\/github.com\/sveltejs\/|https?:\/\/(.+\.)*svelte.dev)/;
const isOfficial = resource => OFFICIAL_URL_MATCHER.test(resource.url);

const GITHUB_URL_MATCHER = /^https?:\/\/github.com\//
const isGitHubRepo = resource => GITHUB_URL_MATCHER.test(resource.url);

const extractTags = resources => {
	const tags = new Set();
	resources.forEach(r => r.tags && r.tags.forEach(t => tags.add(t)));
	return Array.from(tags);
};
