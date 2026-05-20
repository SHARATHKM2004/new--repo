import type { Locale, LinkField } from "@/lib/cms/types";

// ============================================================================
// TYPES
// ============================================================================

export type OptimizelyGraphResponse<T> = {
  data?: T;
  errors?: Array<{
    message: string;
  }>;
};

export type OptimizelyRichTextField = {
  html?: string;
  json?: unknown;
};

export type OptimizelyJsonMetadata = {
  displayName?: string;
  locale?: string;
  status?: string;
  key?: string;
  url?: {
    default?: string;
    hierarchical?: string;
  };
};

export type OptimizelyJsonBlock = {
  __typename?: string;
  title?: string;
  subtitle?: string;
  showDecoration?: boolean;
  decorationColorsPrimary?: string;
  decorationColorsSecondary?: string;
  description?: string;
  story?: string;
  highlights?: string[];
  content?: string;
  fullName?: string;
  position?: string;
  imageSrc?: string;
  name?: string;
  bio?: string;
  logos?: Array<{
    src?: string;
    alt?: string;
  }>;
  services?: Array<{
    title?: string;
    description?: string;
    icon?: string;
    href?: string;
  }>;
  testimonials?: Array<{
    fullName?: string;
    position?: string;
    content?: string;
    avatarSrc?: string;
  }>;
  items?: Array<{
    title?: string;
    description?: string;
    imageUrl?: string;
    link?: string;
  }>;
  imageUrl?: string;
  image?: {
    url?: string;
    alt?: string;
  };
  altText?: string;
  caption?: string;
  videoUrl?: string;
  embedUrl?: string;
  posterImageUrl?: string;
  paragraph_text?: {
    html?: string;
    json?: unknown;
  };
  html?: string;
  json?: unknown;
  _metadata?: OptimizelyJsonMetadata;
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function slugKey(slug: string[]) {
  return slug.join("/");
}

export function toSlugSegment(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isOptimizelyProviderEnabled() {
  return process.env.CMS_PROVIDER === "optimizely";
}

export function getOptimizelyBasicAuthHeader() {
  const appKey = process.env.OPTIMIZELY_GRAPH_APP_KEY?.trim();
  const secret = process.env.OPTIMIZELY_GRAPH_SECRET?.trim();

  if (!appKey || !secret) {
    return null;
  }

  return `Basic ${Buffer.from(`${appKey}:${secret}`).toString("base64")}`;
}

export function getOptimizelyTag(scope: string, locale?: Locale) {
  return locale ? `optimizely:${scope}:${locale}` : `optimizely:${scope}`;
}

export function normalizeLinkItems(items: Array<LinkField | null | undefined>) {
  return items.filter((item): item is LinkField => Boolean(item));
}

export function toArray<T>(value: T[] | null | undefined) {
  return Array.isArray(value) ? value : [];
}

export function stripHtmlTags(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function getRichTextValue(value: string | OptimizelyRichTextField | null | undefined) {
  if (typeof value === "string") {
    return value.trim();
  }

  if (!value || typeof value !== "object") {
    return "";
  }

  const html = value.html?.trim();
  return html ? stripHtmlTags(html) : "";
}

export function getImageSource(block: OptimizelyJsonBlock) {
  return block.imageUrl?.trim() || block.image?.url?.trim() || "";
}

export function getImageAlt(block: OptimizelyJsonBlock, fallbackTitle?: string) {
  return block.altText?.trim() || block.image?.alt?.trim() || fallbackTitle || "CMS image";
}

export function getVideoSource(block: OptimizelyJsonBlock) {
  return block.embedUrl?.trim() || block.videoUrl?.trim() || "";
}

export function inferVideoMode(source: string): "embed" | "file" {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(source) ? "file" : "embed";
}

export function pickStr(json: Record<string, unknown> | undefined, ...keys: string[]): string | undefined {
  if (!json) return undefined;
  for (const k of keys) {
    const v = json[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return undefined;
}

export function getPlaceholderCardHref(title: string, icon?: string) {
  const segment = toSlugSegment(title);
  const normalizedIcon = icon?.trim().toLowerCase() ?? "";

  if (normalizedIcon.startsWith("case")) {
    return `/case-studies/${segment}`;
  }

  if (normalizedIcon.startsWith("insight")) {
    return `/insights/${segment}`;
  }

  return `/services/${segment}`;
}

export function normalizeKeywords(value?: string | null) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function normalizeStringArray(values?: string[] | null) {
  return (values ?? []).map((value) => value.trim()).filter(Boolean);
}

export function preferCmsPagesBySlug<T extends { slug: string[] }>(pages: T[]) {
  const merged = new Map<string, T>();

  for (const page of pages) {
    const key = slugKey(page.slug);
    const existing = merged.get(key);

    if (!existing) {
      merged.set(key, page);
      continue;
    }

    if ("contentSource" in page && page.contentSource === "optimizely" && 
        "contentSource" in existing && existing.contentSource !== "optimizely") {
      merged.set(key, page);
    }
  }

  return Array.from(merged.values());
}

export function normalizeOptimizelySlug(pathname?: string) {
  if (!pathname) {
    return [];
  }

  return pathname
    .split("/")
    .filter(Boolean)
    .slice(1);
}
