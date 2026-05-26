import type { Page } from "@/lib/cms/types";
import { mapOptimizelyBlocks } from "./block-mapper";
import { slugKey } from "./text-helpers";
import { normalizeKeywords, normalizeOptimizelySlug } from "./keyword-metadata";
import type { OptimizelyStartPageItem } from "./optimizely-types";

export function mapOptimizelyStartPage(item: OptimizelyStartPageItem): Page | null {
  const jsonMetadata = item._json?._metadata;
  const metadata = item._metadata;
  const locale = (jsonMetadata?.locale ?? metadata?.locale) === "es" ? "es" : "en";
  const title = item.title ?? item._json?.title ?? jsonMetadata?.displayName ?? metadata?.displayName ?? "Start Page";
  const summary = item.shortDescription ?? item._json?.shortDescription ?? "Published from Optimizely SaaS CMS.";
  const slug = normalizeOptimizelySlug(
    jsonMetadata?.url?.default ?? jsonMetadata?.url?.hierarchical,
  );
  const sections = mapOptimizelyBlocks(item._json?.blocks, title);

  return {
    id: jsonMetadata?.key ?? metadata?.key ?? "optimizely-start-page",
    translationKey: jsonMetadata?.key ?? metadata?.key ?? slugKey(slug) ?? "optimizely-start-page",
    type: "home",
    headerVideoUrl: (item._json?.headerVideoUrl ?? item._json?.HeaderVideoUrl)?.trim() || undefined,
    headerVideoPoster: (item._json?.headerVideoPoster ?? item._json?.HeaderVideoPoster)?.trim() || undefined,
    locale,
    status: jsonMetadata?.status === "Published" ? "published" : "draft",
    slug,
    title,
    eyebrow: "Optimizely Start Page",
    summary,
    seo: {
      title,
      description: summary,
      keywords: normalizeKeywords(item.keywords ?? item._json?.keywords),
      noIndex: jsonMetadata?.status !== "Published",
    },
    sections: sections.length
      ? sections
      : [
          {
            type: "richText",
            body: [summary],
          },
        ],
  };
}
