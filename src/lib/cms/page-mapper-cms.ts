import type { Block, InsightPage, Locale, Page, PublishStatus, AuthorPage, IndustryPage, ServicePage, ResourceCenterPage, ContactPage } from "@/lib/cms/types";
import { mapOptimizelyBlocks } from "./block-mapper";
import { decodeHtmlEntities, slugKey, stripHtmlTags } from "./text-helpers";
import { inferCmsPageType, normalizeKeywords, normalizeOptimizelySlug, normalizeStringArray, parseCmsKeywordMetadata } from "./keyword-metadata";
import type { OptimizelyCmsPageItem } from "./optimizely-types";

export function mapOptimizelyCmsPage(item: OptimizelyCmsPageItem): Page | null {
  const jsonMetadata = item._json?._metadata;
  const metadata = item._metadata;
  const locale: Locale = (jsonMetadata?.locale ?? metadata?.locale) === "es" ? "es" : "en";
  const status: PublishStatus = jsonMetadata?.status === "Published" ? "published" : "draft";
  const title = item.title ?? item._json?.title ?? jsonMetadata?.displayName ?? metadata?.displayName ?? "Untitled page";
  const summary = item.shortDescription ?? item._json?.shortDescription ?? "Published from Optimizely SaaS CMS.";
  const slug = normalizeOptimizelySlug(
    jsonMetadata?.url?.default ?? jsonMetadata?.url?.hierarchical,
  );
  const translationKey = jsonMetadata?.key ?? metadata?.key ?? slugKey(slug) ?? "optimizely-cms-page";
  const sections = mapOptimizelyBlocks(item._json?.blocks, title);
  const pageType = inferCmsPageType(slug, item._json?.pageType);
  const eyebrow = item._json?.eyebrow?.trim() || "Optimizely CMS";
  const keywordMetadata = parseCmsKeywordMetadata(item.keywords ?? item._json?.keywords);
  const basePage = {
    id: jsonMetadata?.key ?? metadata?.key ?? translationKey,
    translationKey,
    locale,
    status,
    contentSource: "optimizely" as const,
    slug,
    title,
    eyebrow,
    summary,
    seo: {
      title,
      description: summary,
      keywords: normalizeKeywords(item.keywords ?? item._json?.keywords),
      noIndex: status !== "published",
    },
    sections:
      sections.length > 0
        ? sections
        : slug[0] === "article"
          ? []
          : [
              {
                type: "richText" as const,
                body: [
                  "This page is being loaded from the live Optimizely SaaS CMS Graph endpoint.",
                  `Display name: ${jsonMetadata?.displayName ?? metadata?.displayName ?? title}`,
                  `Content key: ${jsonMetadata?.key ?? metadata?.key ?? "Unavailable"}`,
                  `Keywords: ${item.keywords ?? item._json?.keywords ?? "None"}`,
                ],
              },
            ],
  };

  switch (pageType) {
    case "service":
      return {
        ...basePage,
        type: "service",
        outcomes: normalizeStringArray(item._json?.outcomes),
      } satisfies ServicePage;
    case "industry":
      return {
        ...basePage,
        type: "industry",
        audience: normalizeStringArray(item._json?.audience),
      } satisfies IndustryPage;
    case "resourceCenter":
      return {
        ...basePage,
        type: "resourceCenter",
        featuredTopics: normalizeStringArray(item._json?.featuredTopics),
      } satisfies ResourceCenterPage;
    case "insight":
      const uiLabels = keywordMetadata.uiLabels;
      const relatedInsightIds = keywordMetadata.relatedInsightIds;

      return {
        ...basePage,
        type: "insight",
        authorId: item._json?.authorId?.trim() || keywordMetadata.authorId || "",
        authorName: keywordMetadata.authorName,
        publishedAt: item._json?.publishedAt?.trim() || keywordMetadata.publishedAt || "1970-01-01",
        readTime: item._json?.readTime?.trim() || keywordMetadata.readTime || "5 min read",
        topics: normalizeStringArray(item._json?.topics).length
          ? normalizeStringArray(item._json?.topics)
          : keywordMetadata.topics,
        relatedServiceIds: normalizeStringArray(item._json?.relatedServiceIds).length
          ? normalizeStringArray(item._json?.relatedServiceIds)
          : keywordMetadata.relatedServiceIds,
        relatedIndustryIds: normalizeStringArray(item._json?.relatedIndustryIds).length
          ? normalizeStringArray(item._json?.relatedIndustryIds)
          : keywordMetadata.relatedIndustryIds,
        relatedInsightIds:
          relatedInsightIds.topPicks.length || relatedInsightIds.readMore.length
            ? relatedInsightIds
            : undefined,
        uiLabels: Object.values(uiLabels).some(Boolean) ? uiLabels : undefined,
        cardImage: (item._json?.cardImageUrl?.trim() || item._json?.CardImageUrl?.trim())
          ? {
              src: (item._json?.cardImageUrl?.trim() || item._json?.CardImageUrl?.trim()) as string,
              alt:
                item._json?.cardImageAlt?.trim() ||
                item._json?.CardImageAlt?.trim() ||
                title,
            }
          : undefined,
      } satisfies InsightPage;
    case "author":
      return {
        ...basePage,
        type: "author",
        role: item._json?.role?.trim() || "Author",
        expertise: normalizeStringArray(item._json?.expertise),
        avatarSrc: item._json?.avatarSrc?.trim() || undefined,
      } satisfies AuthorPage;
    case "contact":
      return {
        ...basePage,
        type: "contact",
        offices: (item._json?.offices ?? [])
          .map((office) => ({
            city: office.city?.trim(),
            phone: office.phone?.trim(),
            focus: office.focus?.trim(),
          }))
          .filter(
            (office): office is ContactPage["offices"][number] =>
              Boolean(office.city && office.phone && office.focus),
          ),
      } satisfies ContactPage;
    default:
      return {
        ...basePage,
        type: "standard",
      };
  }
}

