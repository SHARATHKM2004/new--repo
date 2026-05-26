import { mockPages } from "@/lib/cms/mock-content";
import type { Locale, Page } from "@/lib/cms/types";
import { isOptimizelyProviderEnabled } from "./optimizely-config";
import { getLivePages, getOptimizelyPageBySlug } from "./optimizely-fetchers";
import { slugKey } from "./text-helpers";

export function resolvePages(locale: Locale, draft = false) {
  const byTranslation = new Map<string, Page[]>();

  for (const page of mockPages) {
    const bucket = byTranslation.get(page.translationKey) ?? [];
    bucket.push(page);
    byTranslation.set(page.translationKey, bucket);
  }

  return Array.from(byTranslation.values())
    .map((variants) => {
      const localeDraft = variants.find(
        (page) => page.locale === locale && page.status === "draft",
      );
      const localePublished = variants.find(
        (page) => page.locale === locale && page.status === "published",
      );
      const defaultDraft = variants.find(
        (page) => page.locale === "en" && page.status === "draft",
      );
      const defaultPublished = variants.find(
        (page) => page.locale === "en" && page.status === "published",
      );

      if (draft && localeDraft) {
        return localeDraft;
      }

      return localePublished ?? (draft ? defaultDraft : undefined) ?? defaultPublished;
    })
    .filter((page): page is Page => Boolean(page));
}

export async function getPagesForLocale(locale: Locale, draft = false) {
  const mockPagesForLocale = resolvePages(locale, draft);

  if (!isOptimizelyProviderEnabled()) {
    return mockPagesForLocale;
  }

  const livePages = await getLivePages(locale, draft);

  if (!livePages.length) {
    return mockPagesForLocale;
  }

  const merged = new Map<string, Page>();

  for (const page of livePages) {
    merged.set(page.translationKey, page);
  }

  for (const page of mockPagesForLocale) {
    if (!merged.has(page.translationKey)) {
      merged.set(page.translationKey, page);
    }
  }

  return Array.from(merged.values());
}

export async function getPageBySlug(options: {
  locale: Locale;
  slug: string[];
  draft?: boolean;
}) {
  if (isOptimizelyProviderEnabled()) {
    const page = await getOptimizelyPageBySlug({
      locale: options.locale,
      slug: options.slug,
      draft: options.draft,
    });

    if (page) {
      return page;
    }
  }

  const pages = await getPagesForLocale(options.locale, options.draft);
  return pages.find((page) => slugKey(page.slug) === slugKey(options.slug)) ?? null;
}

export function officeSlug(office: { slug?: string; city: string }): string {
  return (
    office.slug?.trim().toLowerCase() ||
    office.city
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  );
}

export async function getLocationOffices(locale: Locale, draft = false) {
  const page = await getPageBySlug({ locale, slug: ["locations"], draft });
  if (!page) return { heading: undefined, heroImageUrl: undefined, offices: [] };
  const block = page.sections.find(
    (b): b is Extract<typeof page.sections[number], { type: "locationsDirectory" }> =>
      b.type === "locationsDirectory",
  );
  if (!block) return { heading: undefined, heroImageUrl: undefined, offices: [] };
  return {
    heading: block.heading,
    heroImageUrl: block.heroImageUrl,
    offices: block.offices,
  };
}

export function getOfficeSlug(office: { slug?: string; city: string }): string {
  return officeSlug(office);
}

