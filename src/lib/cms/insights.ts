import type { InsightFilters, InsightPage, Locale, Page } from "@/lib/cms/types";
import { getPagesForLocale } from "./page-resolver";
import { preferCmsPagesBySlug } from "./text-helpers";

export async function getInsights(filters: InsightFilters) {
  const pages = preferCmsPagesBySlug(await getPagesForLocale(filters.locale, filters.draft));

  return pages
    .filter((page): page is InsightPage => page.type === "insight")
    .filter((page) => {
      const query = filters.query?.trim().toLowerCase();
      if (!query) {
        return true;
      }

      return [page.title, page.summary, page.topics.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(query);
    })
    .filter((page) => {
      if (!filters.topic) {
        return true;
      }

      return page.topics.includes(filters.topic);
    })
    .filter((page) => {
      if (!filters.service) {
        return true;
      }

      return page.relatedServiceIds.includes(filters.service);
    })
    .filter((page) => {
      if (!filters.industry) {
        return true;
      }

      return page.relatedIndustryIds.includes(filters.industry);
    })
    .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));
}

export async function getRelatedPages(options: {
  locale: Locale;
  ids: string[];
  draft?: boolean;
}) {
  const pages = preferCmsPagesBySlug(await getPagesForLocale(options.locale, options.draft));
  return options.ids
    .map((id) => pages.find((page) => page.translationKey === id) ?? null)
    .filter((page): page is Page => Boolean(page));
}

export async function getFeaturedContent(options: {
  locale: Locale;
  contentTypes: Array<"insight" | "caseStudy">;
  topic?: string;
  service?: string;
  industry?: string;
  ids?: string[];
  limit: number;
  draft?: boolean;
}) {
  const pages = preferCmsPagesBySlug(await getPagesForLocale(options.locale, options.draft)).filter((page) =>
    options.contentTypes.includes(page.type as "insight" | "caseStudy"),
  );

  if (options.ids?.length) {
    return options.ids
      .map((id) => pages.find((page) => page.translationKey === id) ?? null)
      .filter((page): page is Page => Boolean(page))
      .slice(0, options.limit);
  }

  return pages
    .filter((page) => {
      if (page.type === "insight") {
        if (options.topic && !page.topics.includes(options.topic)) {
          return false;
        }

        if (options.service && !page.relatedServiceIds.includes(options.service)) {
          return false;
        }

        if (options.industry && !page.relatedIndustryIds.includes(options.industry)) {
          return false;
        }
      }

      if (page.type === "caseStudy") {
        if (options.service && !page.relatedServiceIds.includes(options.service)) {
          return false;
        }

        if (options.industry && !page.relatedIndustryIds.includes(options.industry)) {
          return false;
        }
      }

      return true;
    })
    .slice(0, options.limit);
}

export async function getAuthorForInsight(options: {
  locale: Locale;
  authorId: string;
  draft?: boolean;
}) {
  const pages = preferCmsPagesBySlug(await getPagesForLocale(options.locale, options.draft));
  const author = pages.find(
    (page) => page.type === "author" && page.translationKey === options.authorId,
  );

  return author?.type === "author" ? author : null;
}

export async function getInsightsByAuthor(options: {
  locale: Locale;
  authorId: string;
  draft?: boolean;
}) {
  const pages = preferCmsPagesBySlug(await getPagesForLocale(options.locale, options.draft));
  return pages.filter(
    (page): page is InsightPage =>
      page.type === "insight" && page.authorId === options.authorId,
  );
}

export function countMatches(left: string[], right: string[]) {
  if (!left.length || !right.length) {
    return 0;
  }

  const rightSet = new Set(right);
  return left.filter((item) => rightSet.has(item)).length;
}

export async function getRelatedInsights(options: {
  locale: Locale;
  page: InsightPage;
  draft?: boolean;
  limit: number;
}) {
  const pages = preferCmsPagesBySlug(await getPagesForLocale(options.locale, options.draft));
  const allInsights = pages.filter(
    (page): page is InsightPage =>
      page.type === "insight" && page.translationKey !== options.page.translationKey,
  );

  const ranked = allInsights
    .map((page) => {
      const topicMatches = countMatches(page.topics, options.page.topics);
      const serviceMatches = countMatches(page.relatedServiceIds, options.page.relatedServiceIds);
      const industryMatches = countMatches(page.relatedIndustryIds, options.page.relatedIndustryIds);
      const authorMatch = page.authorId && page.authorId === options.page.authorId ? 1 : 0;

      return {
        page,
        score: topicMatches * 4 + serviceMatches * 3 + industryMatches * 3 + authorMatch * 2,
      };
    })
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return right.page.publishedAt.localeCompare(left.page.publishedAt);
    });

  const related = ranked.filter((item) => item.score > 0).map((item) => item.page);

  if (related.length >= options.limit) {
    return related.slice(0, options.limit);
  }

  const seen = new Set(related.map((page) => page.translationKey));
  const fallback = ranked
    .map((item) => item.page)
    .filter((page) => !seen.has(page.translationKey));

  return [...related, ...fallback].slice(0, options.limit);
}
