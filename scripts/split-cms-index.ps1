$ErrorActionPreference = 'Stop'
$src = 'src\lib\cms\index.ts'
$lines = Get-Content -LiteralPath $src
function Slice($a, $b) { return ($lines[$a..$b] -join "`n") }

# =============================================================
# 1. optimizely-types.ts  (lines 22-117 + 288-352)
# =============================================================
$typesTop = Slice 21 117       # OptimizelyGraphResponse, RichTextField, CmsPageItem, StartPageItem
$typesBot = Slice 287 351      # CmsPageListItem, HeaderItem, FooterItem

$file1 = @"
import type { OptimizelyJsonBlock, OptimizelyJsonMetadata } from "./optimizely-block-type";

export type { OptimizelyJsonBlock, OptimizelyJsonMetadata };

export $typesTop

export $typesBot
"@
$file1 = $file1 -replace '\nexport type OptimizelyGraphResponse', "`nexport type OptimizelyGraphResponse"
# Add export keyword to each `type Xxx =` (currently `type Xxx =` becomes `export type Xxx =`)
$file1 = $file1 -replace "`nexport type ", "`nexport type "
# The Slice gave us code that begins with `type ` (not `export type`); we placed `export ` before it.
# But internal `type` declarations between need `export` prefix too.
$file1 = $file1 -replace "(`n)type ", "`$1export type "
Set-Content -LiteralPath 'src\lib\cms\optimizely-types.ts' -Value $file1 -Encoding utf8

# =============================================================
# 2. optimizely-block-type.ts (lines 119-287)
# =============================================================
$blockType = Slice 118 286
$file2 = @"
export $blockType
"@
$file2 = $file2 -replace "(`n)type ", "`$1export type "
Set-Content -LiteralPath 'src\lib\cms\optimizely-block-type.ts' -Value $file2 -Encoding utf8

# =============================================================
# 3. text-helpers.ts (lines 353-398 + 538-598)
# slugKey, preferCmsPagesBySlug, toSlugSegment, getPlaceholderCardHref,
# normalizeLinkItems, toArray, decodeHtmlEntities, stripHtmlTags,
# getRichTextValue, getImageSource, getImageAlt, getVideoSource, inferVideoMode
# =============================================================
$slug = Slice 352 397
$text = Slice 537 597
$file3 = @"
import type { LinkField, Page } from "@/lib/cms/types";
import type { OptimizelyJsonBlock, OptimizelyRichTextField } from "./optimizely-types";

$slug

$text
"@
# Add export keyword to all top-level function declarations
$file3 = $file3 -replace "(`n)function ", "`$1export function "
Set-Content -LiteralPath 'src\lib\cms\text-helpers.ts' -Value $file3 -Encoding utf8

# =============================================================
# 4. optimizely-config.ts (lines 399-436)
# =============================================================
$cfg = Slice 398 435
$file4 = @"
import type { Locale } from "@/lib/cms/types";

$cfg
"@
$file4 = $file4 -replace "(`n)function ", "`$1export function "
Set-Content -LiteralPath 'src\lib\cms\optimizely-config.ts' -Value $file4 -Encoding utf8

# =============================================================
# 5. optimizely-graph.ts (fetchOptimizelyGraph at 521-537, getOptimizelyConnectionStatus 437-520)
# =============================================================
$status = Slice 436 519
$fetch = Slice 520 536
$file5 = @"
import {
  getOptimizelyBasicAuthHeader,
  getOptimizelyTag,
  isOptimizelyProviderEnabled,
} from "./optimizely-config";
import type { OptimizelyGraphResponse } from "./optimizely-types";

$fetch

$status
"@
# Mark fetchOptimizelyGraph and getOptimizelyConnectionStatus as exports
$file5 = $file5 -replace "(`n)async function fetchOptimizelyGraph", "`$1export async function fetchOptimizelyGraph"
# getOptimizelyConnectionStatus is already exported in original
Set-Content -LiteralPath 'src\lib\cms\optimizely-graph.ts' -Value $file5 -Encoding utf8

# =============================================================
# 6. block-mapper.ts (lines 599-1058 = mapOptimizelyBlock + mapOptimizelyBlocks)
# This will be ONE big file ~460 lines - we need to split mapOptimizelyBlock
# into two helpers via line-range slice.
# Strategy: split at end of EventsListingBlock case (~line 838)
# part1: 599 (sig+open) -> insert default return null
# part2: separate function with remaining cases
# Then mapOptimizelyBlock is a tiny dispatcher.
# =============================================================
# Lines (0-indexed): function sig 598; opening switch 599; cases start 600..
# Switch opens at line 600 with "  switch (block.__typename) {"
# Case "HeroBlock" at line 601 (idx 600)
# Case "StoryBlock" at line 839 (idx 838)
# Default at line 986 (idx 985)
# End of switch "}" at line 1052 (idx 1051)
# End of mapOptimizelyBlock "}" at line 1052? Let me find:
# Actually need to look closely. Lines:
# 599 function mapOptimizelyBlock(...)
# 600   switch (block.__typename) {
# 601-985 cases (Hero..MediaVideoBlock)
# 986 default: { ... }
# Closing of switch and function?

# Find the lines that need to be split: we'll cut at "case StoryBlock"
# Part1 contains: 600..838 (i.e., switch ... up through end of EventsListingBlock case body)
# Part2 contains: 839..1051 (StoryBlock..default..closing switch})

# Verify exact lines: line 839 is `    case "StoryBlock": {`
# Let's not split mapOptimizelyBlock — instead put it whole in one file
# and split a different way: put the function body as the entire file content.
# The file will be ~460 lines, over 300. We MUST split.

# Cleaner approach: pre-build two sub-functions, each with their own switch.
$part1Cases = Slice 600 837     # cases HeroBlock..EventsListingBlock body
$part2Cases = Slice 838 1051    # cases StoryBlock..default

# Build block-mapper-content.ts
$contentFile = @"
import type { Block } from "@/lib/cms/types";
import type { OptimizelyJsonBlock } from "./optimizely-block-type";

export function mapContentBlock(block: OptimizelyJsonBlock, fallbackTitle?: string): Block | null {
  switch (block.__typename) {
$part1Cases
    default:
      return null;
  }
}
"@
Set-Content -LiteralPath 'src\lib\cms\block-mapper-content.ts' -Value $contentFile -Encoding utf8

# Build block-mapper-marketing.ts
$marketingFile = @"
import type { Block } from "@/lib/cms/types";
import type { OptimizelyJsonBlock } from "./optimizely-block-type";
import {
  getImageAlt,
  getImageSource,
  getPlaceholderCardHref,
  getRichTextValue,
  getVideoSource,
  inferVideoMode,
  toSlugSegment,
} from "./text-helpers";

export function mapMarketingBlock(block: OptimizelyJsonBlock, fallbackTitle?: string): Block | null {
  switch (block.__typename) {
$part2Cases
  }
  return null;
}
"@
Set-Content -LiteralPath 'src\lib\cms\block-mapper-marketing.ts' -Value $marketingFile -Encoding utf8

# Build block-mapper.ts (the dispatcher + mapOptimizelyBlocks)
$dispatcherFile = @"
import type { Block } from "@/lib/cms/types";
import { mapContentBlock } from "./block-mapper-content";
import { mapMarketingBlock } from "./block-mapper-marketing";
import type { OptimizelyJsonBlock } from "./optimizely-block-type";

export function mapOptimizelyBlock(block: OptimizelyJsonBlock, fallbackTitle?: string): Block | null {
  return (
    mapContentBlock(block, fallbackTitle) ??
    mapMarketingBlock(block, fallbackTitle)
  );
}

export function mapOptimizelyBlocks(
  blocks: OptimizelyJsonBlock[] | undefined,
  fallbackTitle?: string,
) {
  return (blocks ?? [])
    .map((block) => mapOptimizelyBlock(block, fallbackTitle))
    .filter((block): block is Block => Boolean(block));
}
"@
Set-Content -LiteralPath 'src\lib\cms\block-mapper.ts' -Value $dispatcherFile -Encoding utf8

# =============================================================
# 7. keyword-metadata.ts (lines 1059-1241)
# normalizeKeywords, normalizeStringArray, parseCmsKeywordMetadata, inferCmsPageType, normalizeOptimizelySlug
# =============================================================
$kw = Slice 1058 1240
$file7 = @"
$kw
"@
$file7 = $file7 -replace "(`n)function ", "`$1export function "
$file7 = "// keyword metadata + page-type helpers extracted from index.ts`n" + $file7.TrimStart() 
# Replace leading "function " (first line) with "export function "
$file7 = $file7 -replace "(^|\n)function ", "`$1export function "
Set-Content -LiteralPath 'src\lib\cms\keyword-metadata.ts' -Value $file7 -Encoding utf8

# =============================================================
# 8. page-mapper-cms.ts (lines 1242-1375)
# =============================================================
$pmc = Slice 1241 1374
$file8 = @"
import type { Block, InsightPage, Locale, Page, PublishStatus, AuthorPage, IndustryPage, ServicePage, ResourceCenterPage, ContactPage } from "@/lib/cms/types";
import { mapOptimizelyBlocks } from "./block-mapper";
import { decodeHtmlEntities, slugKey, stripHtmlTags } from "./text-helpers";
import { inferCmsPageType, normalizeOptimizelySlug, normalizeStringArray, parseCmsKeywordMetadata } from "./keyword-metadata";
import type { OptimizelyCmsPageItem } from "./optimizely-types";

export $pmc
"@
Set-Content -LiteralPath 'src\lib\cms\page-mapper-cms.ts' -Value $file8 -Encoding utf8

# =============================================================
# 9. page-mapper-start.ts (lines 1376-1413)
# =============================================================
$pms = Slice 1375 1412
$file9 = @"
import type { Page } from "@/lib/cms/types";
import { mapOptimizelyBlocks } from "./block-mapper";
import { slugKey } from "./text-helpers";
import { normalizeKeywords, normalizeOptimizelySlug } from "./keyword-metadata";
import type { OptimizelyStartPageItem } from "./optimizely-types";

export $pms
"@
Set-Content -LiteralPath 'src\lib\cms\page-mapper-start.ts' -Value $file9 -Encoding utf8

# =============================================================
# 10. optimizely-fetchers.ts (lines 1414-1581)
# getOptimizelyPageBySlug, getOptimizelyStartPage, getOptimizelyCmsPages, getLivePages
# =============================================================
$fetchers = Slice 1413 1580
$file10 = @"
import type { Locale, Page } from "@/lib/cms/types";
import { fetchOptimizelyGraph } from "./optimizely-graph";
import { getOptimizelyTag } from "./optimizely-config";
import { slugKey } from "./text-helpers";
import { mapOptimizelyCmsPage } from "./page-mapper-cms";
import { mapOptimizelyStartPage } from "./page-mapper-start";
import type { OptimizelyCmsPageItem, OptimizelyCmsPageListItem, OptimizelyStartPageItem } from "./optimizely-types";

$fetchers
"@
$file10 = $file10 -replace "(`n)async function ", "`$1export async function "
Set-Content -LiteralPath 'src\lib\cms\optimizely-fetchers.ts' -Value $file10 -Encoding utf8

# =============================================================
# 11. page-resolver.ts (lines 1582-1672)
# resolvePages, getPagesForLocale, getPageBySlug, officeSlug, getLocationOffices, getOfficeSlug
# =============================================================
$resolver = Slice 1581 1671
$file11 = @"
import { mockPages } from "@/lib/cms/mock-content";
import type { Locale, Page } from "@/lib/cms/types";
import { isOptimizelyProviderEnabled } from "./optimizely-config";
import { getLivePages, getOptimizelyPageBySlug } from "./optimizely-fetchers";
import { slugKey } from "./text-helpers";

$resolver
"@
$file11 = $file11 -replace "(`n)function ", "`$1export function "
$file11 = $file11 -replace "(`n)async function ", "`$1export async function "
Set-Content -LiteralPath 'src\lib\cms\page-resolver.ts' -Value $file11 -Encoding utf8

# =============================================================
# 12. navigation.ts (lines 1673-1893) — getOptimizelyHeader, getOptimizelyFooter (1718-1742),
# getNavigation, getSiteHeaderContent
# =============================================================
$nav = Slice 1672 1892
$file12 = @"
import type { Locale, NavigationGroup, NavigationItem, SiteHeaderContent } from "@/lib/cms/types";
import { fetchOptimizelyGraph } from "./optimizely-graph";
import { getOptimizelyTag, isOptimizelyProviderEnabled } from "./optimizely-config";
import { toArray } from "./text-helpers";
import type { OptimizelyFooterItem, OptimizelyHeaderItem } from "./optimizely-types";

$nav
"@
$file12 = $file12 -replace "(`n)async function ", "`$1export async function "
Set-Content -LiteralPath 'src\lib\cms\navigation.ts' -Value $file12 -Encoding utf8

# =============================================================
# 13. footer.ts (lines 1894-2010)
# =============================================================
$footer = Slice 1893 2009
$file13 = @"
import type { Locale, SiteFooterContent } from "@/lib/cms/types";
import { fetchOptimizelyGraph } from "./optimizely-graph";
import { isOptimizelyProviderEnabled } from "./optimizely-config";
import { getRichTextValue, toArray } from "./text-helpers";
import { getOptimizelyFooter } from "./navigation";

$footer
"@
Set-Content -LiteralPath 'src\lib\cms\footer.ts' -Value $file13 -Encoding utf8

# =============================================================
# 14. subscription.ts (lines 2011-2117)
# =============================================================
$sub = Slice 2010 2116
$file14 = @"
import type { Locale, SubscriptionPageContent } from "@/lib/cms/types";
import { fetchOptimizelyGraph } from "./optimizely-graph";
import { getOptimizelyTag, isOptimizelyProviderEnabled } from "./optimizely-config";
import { toArray } from "./text-helpers";

$sub
"@
$file14 = $file14 -replace "(`n)type ", "`$1export type "
$file14 = $file14 -replace "(`n)function ", "`$1export function "
Set-Content -LiteralPath 'src\lib\cms\subscription.ts' -Value $file14 -Encoding utf8

# =============================================================
# 15. search.ts (lines 2118-2195)
# =============================================================
$srch = Slice 2117 2194
$file15 = @"
import type { Locale, Page } from "@/lib/cms/types";
import { getPagesForLocale } from "./page-resolver";
import { preferCmsPagesBySlug } from "./text-helpers";

$srch
"@
$file15 = $file15 -replace "(`n)type ", "`$1export type "
$file15 = $file15 -replace "(`n)function ", "`$1export function "
Set-Content -LiteralPath 'src\lib\cms\search.ts' -Value $file15 -Encoding utf8

# =============================================================
# 16. insights.ts (lines 2196-2376)
# =============================================================
$ins = Slice 2195 2376
$file16 = @"
import type { InsightFilters, InsightPage, Locale, Page } from "@/lib/cms/types";
import { getPagesForLocale } from "./page-resolver";
import { preferCmsPagesBySlug } from "./text-helpers";

$ins
"@
$file16 = $file16 -replace "(`n)function ", "`$1export function "
Set-Content -LiteralPath 'src\lib\cms\insights.ts' -Value $file16 -Encoding utf8

# =============================================================
# 17. index.ts (barrel)
# =============================================================
$barrel = @"
// Public API barrel for CMS lib. Internal modules live alongside.
export { getOptimizelyRevalidationTags, isOptimizelyProviderEnabled } from "./optimizely-config";
export { getOptimizelyConnectionStatus } from "./optimizely-graph";
export { getPageBySlug, getLocationOffices, getOfficeSlug } from "./page-resolver";
export { getNavigation, getSiteHeaderContent } from "./navigation";
export { getSiteFooterContent } from "./footer";
export { getSubscriptionPageContent } from "./subscription";
export { searchAllPages } from "./search";
export {
  getInsights,
  getRelatedPages,
  getFeaturedContent,
  getAuthorForInsight,
  getInsightsByAuthor,
  getRelatedInsights,
} from "./insights";
"@
Set-Content -LiteralPath 'src\lib\cms\index.ts' -Value $barrel -Encoding utf8

# Print sizes
Write-Host "==== File sizes ===="
foreach ($f in @(
  'optimizely-types.ts','optimizely-block-type.ts','text-helpers.ts',
  'optimizely-config.ts','optimizely-graph.ts',
  'block-mapper-content.ts','block-mapper-marketing.ts','block-mapper.ts',
  'keyword-metadata.ts','page-mapper-cms.ts','page-mapper-start.ts',
  'optimizely-fetchers.ts','page-resolver.ts','navigation.ts',
  'footer.ts','subscription.ts','search.ts','insights.ts','index.ts'
)) {
  $p = "src\lib\cms\$f"
  if (Test-Path -LiteralPath $p) {
    $c = (Get-Content -LiteralPath $p).Count
    Write-Host ("{0,4}  {1}" -f $c, $f)
  }
}
