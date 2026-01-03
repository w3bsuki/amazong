export const PLACEHOLDER_IMAGE_PATH = "/placeholder.jpg";

const KNOWN_BAD_REMOTE_IMAGE_SUBSTRINGS = [
	"images.unsplash.com/photo-1558584673-90d3e2c6f626",
	"images.unsplash.com/photo-1472851294608-062f824d29cc",
	"images.unsplash.com/photo-1493711662062-fa541f7f3d24",
	"images.unsplash.com/photo-1565108966740-99699699f32c",
	"images.unsplash.com/photo-1558171013-50be2d0e6b94",
	"images.unsplash.com/photo-1543512214-318c77a07298",
	"images.unsplash.com/photo-1585837146751-f8e5d8b43d5d",
	"images.unsplash.com/photo-1594835898222-0d191dd9e8c2",
	"images.unsplash.com/photo-1461896836934-28e9b70b7d32",
] as const;

export function normalizeImageUrl(url?: string | null): string {
	if (!url) return PLACEHOLDER_IMAGE_PATH;
	const trimmed = url.trim();
	if (!trimmed) return PLACEHOLDER_IMAGE_PATH;
	if (trimmed === PLACEHOLDER_IMAGE_PATH) return trimmed;
	if (trimmed.startsWith("https://placehold.co/")) return PLACEHOLDER_IMAGE_PATH;

	for (const badSubstring of KNOWN_BAD_REMOTE_IMAGE_SUBSTRINGS) {
		if (trimmed.includes(badSubstring)) return PLACEHOLDER_IMAGE_PATH;
	}

	// Keep special schemes as-is (e.g. client-generated previews)
	if (trimmed.startsWith("data:") || trimmed.startsWith("blob:")) return trimmed;

	// Normalize protocol-relative URLs
	if (trimmed.startsWith("//")) return `https:${trimmed}`;

	// Keep absolute http(s) URLs
	if (/^https?:\/\//i.test(trimmed)) return trimmed;

	// Keep root-relative paths
	if (trimmed.startsWith("/")) return trimmed;

	// Fix common mistake: relative public asset paths like "placeholder.jpg"
	return `/${trimmed}`;
}

/**
 * Category-safe variant: keep `null` as `null`.
 *
 * Category UIs usually have better fallbacks (emoji/icon) than a generic
 * placeholder image, so returning a placeholder here degrades the UI.
 */
export function normalizeOptionalImageUrl(url?: string | null): string | null {
	if (!url) return null;
	const trimmed = url.trim();
	if (!trimmed) return null;
	if (trimmed === PLACEHOLDER_IMAGE_PATH) return null;
	if (trimmed.startsWith("https://placehold.co/")) return null;

	for (const badSubstring of KNOWN_BAD_REMOTE_IMAGE_SUBSTRINGS) {
		if (trimmed.includes(badSubstring)) return null;
	}

	if (trimmed.startsWith("data:") || trimmed.startsWith("blob:")) return trimmed;
	if (trimmed.startsWith("//")) return `https:${trimmed}`;
	if (/^https?:\/\//i.test(trimmed)) return trimmed;
	if (trimmed.startsWith("/")) return trimmed;

	const normalizedLocalPath = `/${trimmed}`;
	return normalizedLocalPath === PLACEHOLDER_IMAGE_PATH ? null : normalizedLocalPath;
}

export function normalizeImageUrls(urls: Array<string | null | undefined>): string[] {
	return urls.map(normalizeImageUrl).filter(Boolean);
}