function stripQuotes(value: string) {
  return value.replace(/^["']+|["']+$/g, "").trim();
}

/** Normalize stored image paths from DB, JSON, or admin paste. */
export function resolveImageUrl(raw?: string | null): string | null {
  if (!raw) return null;

  let value = String(raw).trim();
  if (!value) return null;

  // Sometimes JSON-stringified twice in older records.
  for (let i = 0; i < 2; i++) {
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      try {
        const parsed = JSON.parse(value);
        if (typeof parsed === "string") {
          value = parsed.trim();
          continue;
        }
      } catch {
        value = stripQuotes(value);
      }
    }
    break;
  }

  value = stripQuotes(value);
  if (!value) return null;

  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("/")) return value;
  if (value.startsWith("uploads/")) return `/${value}`;
  if (value.startsWith("images/")) return `/${value}`;

  return `/${value}`;
}

export function getLocalProductImage(slug: string): string {
  return `/images/products/${slug}.jpg`;
}

export function getLocalCategoryImage(slug: string): string {
  return `/images/categories/${slug}.jpg`;
}

function parseStoredImages(storedImages?: string): string[] {
  if (!storedImages) return [];

  const trimmed = storedImages.trim();
  if (!trimmed) return [];

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => resolveImageUrl(typeof item === "string" ? item : null))
        .filter((item): item is string => Boolean(item));
    }
    if (typeof parsed === "string") {
      const single = resolveImageUrl(parsed);
      return single ? [single] : [];
    }
  } catch {
    const single = resolveImageUrl(trimmed);
    return single ? [single] : [];
  }

  return [];
}

export function getProductImageCandidates(slug: string, storedImages?: string): string[] {
  const stored = parseStoredImages(storedImages);
  const local = getLocalProductImage(slug);
  const remote = `https://picsum.photos/seed/paki-${slug}/500/500`;
  return [...new Set([...stored, local, remote])];
}

export function getProductImage(slug: string, storedImages?: string): string {
  return getProductImageCandidates(slug, storedImages)[0] || getLocalProductImage(slug);
}

export function getCategoryImageCandidates(slug: string, storedImage?: string | null): string[] {
  const stored = resolveImageUrl(storedImage);
  const local = getLocalCategoryImage(slug);
  const remote = `https://picsum.photos/seed/paki-cat-${slug}/400/400`;
  const candidates = stored ? [stored, local, remote] : [local, remote];
  return [...new Set(candidates)];
}

export function getCategoryImage(slug: string, storedImage?: string | null): string {
  return getCategoryImageCandidates(slug, storedImage)[0] || getLocalCategoryImage(slug);
}

export function getBannerImageCandidates(path: string | null | undefined, index: number): string[] {
  const stored = resolveImageUrl(path);
  const fallback = `/images/banners/banner-${index + 1}.jpg`;
  const remote = `https://picsum.photos/seed/paki-banner-${index + 1}/1200/400`;
  const candidates = stored ? [stored, fallback, remote] : [fallback, remote];
  return [...new Set(candidates)];
}

export function getBannerImage(path: string | null | undefined, index: number): string {
  return getBannerImageCandidates(path, index)[0];
}
