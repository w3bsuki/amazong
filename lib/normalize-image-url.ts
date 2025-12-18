export const PLACEHOLDER_IMAGE_PATH = "/placeholder.jpg";

const KNOWN_BAD_REMOTE_IMAGE_SUBSTRINGS = [
	"images.unsplash.com/photo-1558584673-90d3e2c6f626",
	"images.unsplash.com/photo-1472851294608-062f824d29cc",
] as const;

export function normalizeImageUrl(url: string | null | undefined): string {
	if (!url) return PLACEHOLDER_IMAGE_PATH;
	if (url === PLACEHOLDER_IMAGE_PATH) return url;

	for (const badSubstring of KNOWN_BAD_REMOTE_IMAGE_SUBSTRINGS) {
		if (url.includes(badSubstring)) return PLACEHOLDER_IMAGE_PATH;
	}

	return url;
}

export function normalizeImageUrls(urls: Array<string | null | undefined>): string[] {
	return urls.map(normalizeImageUrl).filter(Boolean);
}