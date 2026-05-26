import type { LinkField, Page } from "@/lib/cms/types";
import type { OptimizelyJsonBlock, OptimizelyRichTextField } from "./optimizely-types";

export function slugKey(slug: string[]) {
  return slug.join("/");
}

export function preferCmsPagesBySlug<T extends Page>(pages: T[]) {
  const merged = new Map<string, T>();

  for (const page of pages) {
    const key = slugKey(page.slug);
    const existing = merged.get(key);

    if (!existing) {
      merged.set(key, page);
      continue;
    }

    if (page.contentSource === "optimizely" && existing.contentSource !== "optimizely") {
      merged.set(key, page);
    }
  }

  return Array.from(merged.values());
}

export function toSlugSegment(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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


export function normalizeLinkItems(items: Array<LinkField | null | undefined>) {
  return items.filter((item): item is LinkField => Boolean(item));
}

export function toArray<T>(value: T[] | null | undefined) {
  return Array.isArray(value) ? value : [];
}

export function decodeHtmlEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_m, n) => String.fromCharCode(Number(n)));
}

export function stripHtmlTags(value: string) {
  const withBreaks = value
    .replace(/<\s*br\s*\/?\s*>/gi, "\n")
    .replace(/<\/\s*(p|div|li|h[1-6]|tr)\s*>/gi, "\n")
    .replace(/<[^>]*>/g, " ");
  return decodeHtmlEntities(withBreaks)
    .split(/\r?\n+/)
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .filter(Boolean)
    .join("\n");
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

