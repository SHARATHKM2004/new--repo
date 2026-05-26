import type { Locale, Page } from "@/lib/cms/types";
import { fetchOptimizelyGraph } from "./optimizely-graph";
import { getOptimizelyTag } from "./optimizely-config";
import { slugKey } from "./text-helpers";
import { mapOptimizelyCmsPage } from "./page-mapper-cms";
import { mapOptimizelyStartPage } from "./page-mapper-start";
import type { OptimizelyCmsPageItem, OptimizelyCmsPageListItem, OptimizelyStartPageItem } from "./optimizely-types";

export async function getOptimizelyPageBySlug(options: {
  locale: Locale;
  slug: string[];
  draft?: boolean;
}) {
  const startPage = await getOptimizelyStartPage(options.locale, options.draft);

  if (startPage) {
    if (!options.slug.length || slugKey(options.slug) === slugKey(startPage.slug)) {
      return startPage;
    }
  }

  const pages = await getOptimizelyCmsPages(options.locale, options.draft);

  if (!pages.length) {
    return null;
  }

  if (!options.slug.length) {
    return pages[0] ?? null;
  }

  return pages.find((page) => slugKey(page.slug) === slugKey(options.slug)) ?? null;
}

export async function getOptimizelyStartPage(locale: Locale, draft = false) {
  const data = await fetchOptimizelyGraph<{
    StartPage: {
      item: OptimizelyStartPageItem | null;
    };
  }>(
    `query {
      StartPage(limit: 1, locale: ${locale}) {
        item {
          title
          shortDescription
          keywords
          _json
          _metadata {
            key
            locale
            displayName
            types
          }
        }
      }
    }`,
    {
      draft,
      tags: [getOptimizelyTag("page", locale), getOptimizelyTag("start-page", locale)],
    },
  );

  const item = data?.StartPage?.item;

  if (!item) {
    return null;
  }

  if (process.env.OPTIMIZELY_DEBUG_STARTPAGE === "1") {
    console.log(
      "[StartPage._json keys]",
      Object.keys(item._json ?? {}),
      "headerVideoUrl=", item._json?.headerVideoUrl ?? item._json?.HeaderVideoUrl,
      "headerVideoPoster=", item._json?.headerVideoPoster ?? item._json?.HeaderVideoPoster,
    );
  }

  return mapOptimizelyStartPage(item);
}

export async function getOptimizelyCmsPages(locale: Locale, draft = false) {
  const data = await fetchOptimizelyGraph<{
    CMSPage: {
      items: OptimizelyCmsPageListItem[];
    };
  }>(
    `query {
      CMSPage(limit: 100, locale: ${locale}) {
        items {
          title
          shortDescription
          _metadata {
            key
            locale
            displayName
            types
          }
        }
      }
    }`,
    {
      draft,
      tags: [getOptimizelyTag("page", locale), getOptimizelyTag("cms-page", locale)],
    },
  );

  const keys = Array.from(
    new Set(
      (data?.CMSPage?.items ?? [])
        .map((item) => item._metadata?.key)
        .filter((key): key is string => Boolean(key)),
    ),
  );

  if (!keys.length) {
    return [];
  }

  const pages = await Promise.all(
    keys.map(async (key) => {
      const pageData = await fetchOptimizelyGraph<{
        CMSPage: {
          item: OptimizelyCmsPageItem | null;
        };
      }>(
        `query {
          CMSPage(limit: 1, locale: ${locale}, ids: ["${key}"]) {
            item {
              title
              shortDescription
              keywords
              _json
              _metadata {
                key
                locale
                displayName
                types
              }
            }
          }
        }`,
        {
          draft,
          tags: [getOptimizelyTag("page", locale), getOptimizelyTag("cms-page", locale)],
        },
      );

      const page = pageData?.CMSPage?.item ? mapOptimizelyCmsPage(pageData.CMSPage.item) : null;
      return page;
    }),
  );

  return pages.filter((page): page is Page => Boolean(page));
}

export async function getLivePages(locale: Locale, draft = false) {
  const pages: Page[] = [];
  const startPage = await getOptimizelyStartPage(locale, draft);

  if (startPage) {
    pages.push(startPage);
  }

  const cmsPages = await getOptimizelyCmsPages(locale, draft);

  for (const page of cmsPages) {
    if (!pages.some((candidate) => candidate.translationKey === page.translationKey)) {
      pages.push(page);
    }
  }

  return pages;
}

