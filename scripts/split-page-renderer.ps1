$ErrorActionPreference = 'Stop'
$src = 'src\components\cms\page-renderer.tsx'
$lines = Get-Content -LiteralPath $src

# Extract slices (0-indexed inclusive)
function Slice($arr, $a, $b) { return ($arr[$a..$b] -join "`n") }

# Inner branch bodies (skip the `if (..) {` line and trailing `}` line)
$newsBody = Slice $lines 186 252
$contactBody = Slice $lines 256 313
$insightBody = Slice $lines 317 518
$defaultBody = Slice $lines 521 736

# Build NewsLandingView
$news = @"
import Link from "next/link";
import { NewsListing } from "@/components/cms/news-listing";
import { NewsSidebar } from "@/components/cms/news-sidebar";
import { getInsights } from "@/lib/cms";
import type { Block, Locale, Page } from "@/lib/cms/types";

export async function NewsLandingView({
  page,
  locale,
  draft,
  renderedSections,
}: {
  page: Page;
  locale: Locale;
  draft: boolean;
  renderedSections: Block[];
}) {
$newsBody
}
"@
Set-Content -LiteralPath 'src\components\cms\page-renderer-news-landing.tsx' -Value $news -Encoding utf8

# Build ContactView
$contact = @"
import { BlockRenderer } from "@/components/cms/block-renderer";
import { renderContactIntroBlock, renderInlineLinks } from "@/components/cms/page-renderer-helpers";
import type { Block, Locale, Page } from "@/lib/cms/types";

export function ContactView({
  page,
  locale,
  draft,
  renderedSections,
}: {
  page: Page;
  locale: Locale;
  draft: boolean;
  renderedSections: Block[];
}) {
$contactBody
}
"@
Set-Content -LiteralPath 'src\components\cms\page-renderer-contact-view.tsx' -Value $contact -Encoding utf8

# Build InsightView
$insight = @"
import Link from "next/link";
import { BlockRenderer } from "@/components/cms/block-renderer";
import {
  formatInsightDate,
  isArticleBodyBlock,
  renderInlineArticleBlock,
} from "@/components/cms/page-renderer-helpers";
import type { Locale, Page } from "@/lib/cms/types";

export function InsightView({
  page,
  locale,
  draft,
  author,
  insightAuthorName,
  explicitTopPickPages,
  explicitReadMorePages,
  insightRecommendations,
  insightRecommendationAuthors,
}: {
  page: Extract<Page, { type: "insight" }>;
  locale: Locale;
  draft: boolean;
  author: Extract<Page, { type: "author" }> | null;
  insightAuthorName: string | null;
  explicitTopPickPages: Extract<Page, { type: "insight" }>[];
  explicitReadMorePages: Extract<Page, { type: "insight" }>[];
  insightRecommendations: Extract<Page, { type: "insight" }>[];
  insightRecommendationAuthors: (Extract<Page, { type: "author" }> | null)[];
}) {
$insightBody
}
"@
Set-Content -LiteralPath 'src\components\cms\page-renderer-insight-view.tsx' -Value $insight -Encoding utf8

# Build DefaultView
$default = @"
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { BlockRenderer } from "@/components/cms/block-renderer";
import { PageKicker } from "@/components/cms/page-renderer-kicker";
import {
  ResourceCenterResults,
  ResourceCenterResultsSkeleton,
  ResourceCenterToolbar,
} from "@/components/cms/page-renderer-resource-center";
import type { Block, Locale, Page } from "@/lib/cms/types";

export function DefaultView({
  page,
  locale,
  draft,
  filters,
  fallbackNotice,
  author,
  insightAuthorName,
  pageKicker,
  trendingInsights,
  renderedSections,
  authorInsights,
  relatedPages,
  showPageHeader,
  isFullBleedStandalone,
}: {
  page: Page;
  locale: Locale;
  draft: boolean;
  filters: { q?: string; topic?: string; service?: string; industry?: string };
  fallbackNotice: string | null;
  author: Extract<Page, { type: "author" }> | null;
  insightAuthorName: string | null;
  pageKicker: ReactNode;
  trendingInsights: Extract<Page, { type: "insight" }>[];
  renderedSections: Block[];
  authorInsights: Extract<Page, { type: "insight" }>[];
  relatedPages: Page[];
  showPageHeader: boolean;
  isFullBleedStandalone: boolean;
}) {
  return (
$defaultBody
  );
}
"@
# Need to strip the leading `return (` from defaultBody since we added it; restore: the original body started with `return (`. Let's adjust below.
# Actually defaultBody contains the original `return (` lines. Inserting `return (` again would duplicate. Strip.
$defaultBody2 = $defaultBody -replace '^\s*return \(\s*', ''
$defaultBody2 = $defaultBody2 -replace '\s*\);\s*$', ''
$default = @"
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { BlockRenderer } from "@/components/cms/block-renderer";
import { PageKicker } from "@/components/cms/page-renderer-kicker";
import {
  ResourceCenterResults,
  ResourceCenterResultsSkeleton,
  ResourceCenterToolbar,
} from "@/components/cms/page-renderer-resource-center";
import type { Block, Locale, Page } from "@/lib/cms/types";

export function DefaultView({
  page,
  locale,
  draft,
  filters,
  fallbackNotice,
  author,
  insightAuthorName,
  pageKicker,
  trendingInsights,
  renderedSections,
  authorInsights,
  relatedPages,
  showPageHeader,
  isFullBleedStandalone,
}: {
  page: Page;
  locale: Locale;
  draft: boolean;
  filters: { q?: string; topic?: string; service?: string; industry?: string };
  fallbackNotice: string | null;
  author: Extract<Page, { type: "author" }> | null;
  insightAuthorName: string | null;
  pageKicker: ReactNode;
  trendingInsights: Extract<Page, { type: "insight" }>[];
  renderedSections: Block[];
  authorInsights: Extract<Page, { type: "insight" }>[];
  relatedPages: Page[];
  showPageHeader: boolean;
  isFullBleedStandalone: boolean;
}) {
  return (
$defaultBody2
  );
}
"@
Set-Content -LiteralPath 'src\components\cms\page-renderer-default-view.tsx' -Value $default -Encoding utf8

Write-Host "Wrote 4 view files"
Write-Host "news lines: $((Get-Content -LiteralPath 'src\components\cms\page-renderer-news-landing.tsx').Count)"
Write-Host "contact lines: $((Get-Content -LiteralPath 'src\components\cms\page-renderer-contact-view.tsx').Count)"
Write-Host "insight lines: $((Get-Content -LiteralPath 'src\components\cms\page-renderer-insight-view.tsx').Count)"
Write-Host "default lines: $((Get-Content -LiteralPath 'src\components\cms\page-renderer-default-view.tsx').Count)"
