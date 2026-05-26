import {
  getAuthorForInsight,
  getInsights,
  getInsightsByAuthor,
  getRelatedInsights,
  getRelatedPages,
} from "@/lib/cms";
import type { Block, Locale, Page } from "@/lib/cms/types";
import { PageKicker } from "@/components/cms/page-renderer-kicker";
import { NewsLandingView } from "@/components/cms/page-renderer-news-landing";
import { ContactView } from "@/components/cms/page-renderer-contact-view";
import { InsightView } from "@/components/cms/page-renderer-insight-view";
import { DefaultView } from "@/components/cms/page-renderer-default-view";

export async function PageRenderer({
  page,
  locale,
  requestedLocale,
  draft,
  filters,
}: {
  page: Page;
  locale: Locale;
  requestedLocale: Locale;
  draft: boolean;
  filters: {
    q?: string;
    topic?: string;
    service?: string;
    industry?: string;
  };
}) {
  const fallbackNotice =
    page.locale !== requestedLocale
      ? requestedLocale === "en"
        ? "This page is falling back to the default locale."
        : "Esta pagina usa contenido del idioma predeterminado como fallback."
      : null;

  const author =
    page.type === "insight"
      ? page.authorId
        ? await getAuthorForInsight({ locale, authorId: page.authorId, draft })
        : null
      : null;
  const explicitTopPickPages =
    page.type === "insight" && page.relatedInsightIds?.topPicks.length
      ? (await getRelatedPages({ locale, ids: page.relatedInsightIds.topPicks, draft })).filter(
          (item): item is Extract<Page, { type: "insight" }> => item.type === "insight",
        )
      : [];
  const explicitReadMorePages =
    page.type === "insight" && page.relatedInsightIds?.readMore.length
      ? (await getRelatedPages({ locale, ids: page.relatedInsightIds.readMore, draft })).filter(
          (item): item is Extract<Page, { type: "insight" }> => item.type === "insight",
        )
      : [];
  const insightRecommendations =
    page.type === "insight"
      ? await getRelatedInsights({
          locale,
          page,
          draft,
          limit: 6,
        })
      : [];
  const insightRecommendationAuthors =
    page.type === "insight"
      ? await Promise.all(
          insightRecommendations.map((item) =>
            item.authorId ? getAuthorForInsight({ locale: item.locale, authorId: item.authorId, draft }) : null,
          ),
        )
      : [];
  const insightAuthorName = page.type === "insight" ? author?.title ?? page.authorName ?? null : null;
  const authorInsights =
    page.type === "author"
      ? await getInsightsByAuthor({ locale, authorId: page.translationKey, draft })
      : [];
  const hasCmsRelatedContentBlock =
    page.type === "service" &&
    page.sections.some(
      (block) => block.type === "featuredContent" || block.type === "cardGrid",
    );
  const relatedPages =
    page.type === "service"
      ? hasCmsRelatedContentBlock
        ? []
        : await getRelatedPages({
            locale,
            ids: ["case-study-healthcare", "insight-preview", "insight-taxonomy"],
            draft,
          })
      : page.type === "caseStudy"
        ? await getRelatedPages({ locale, ids: page.relatedServiceIds, draft })
        : [];
  const isArticleLandingPage =
    page.type === "standard" &&
    page.slug[0] === "article" &&
    (page.slug.length === 1 || page.slug[1] === "all");
  const articleListFallbackBlock: Block | null = isArticleLandingPage
    ? {
        type: "articleList",
        title: "Articles",
        limit: 999,
        hero: {
          imageUrl:
            "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=2400&q=80",
          imageAlt: "Newsroom desk overhead view",
          title: locale === "es" ? "Articulos" : "Articles",
          breadcrumbHomeLabel: locale === "es" ? "Inicio" : "Home",
          breadcrumbCurrentLabel: locale === "es" ? "Articulos" : "Articles",
          breadcrumbHomeHref: `/${locale}`,
        },
        initialVisible: 9,
        loadMoreStep: 6,
        loadMoreLabel: locale === "es" ? "Cargar mas" : "Load more",
        readMoreLabel: locale === "es" ? "Leer mas" : "Read full story",
        fallbackImagePool: [
          "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=70",
          "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=70",
          "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=70",
          "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=70",
          "https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=1200&q=70",
          "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=70",
          "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=70",
          "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=70",
          "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1200&q=70",
          "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=70",
          "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=70",
          "https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=1200&q=70",
          "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=70",
          "https://images.unsplash.com/photo-1542626991-cbc4e32524cc?auto=format&fit=crop&w=1200&q=70",
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=70",
          "https://images.unsplash.com/photo-1573497019418-b400bb3ab074?auto=format&fit=crop&w=1200&q=70",
          "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=1200&q=70",
          "https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&w=1200&q=70",
          "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?auto=format&fit=crop&w=1200&q=70",
          "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=70",
        ],
      }
    : null;
  const hasArticleListBlock = page.sections.some((block) => block.type === "articleList");
  const renderedSections =
    articleListFallbackBlock && !hasArticleListBlock
      ? [...page.sections, articleListFallbackBlock]
      : page.sections;
  const shouldShowPageKicker = ["service", "industry", "insight", "caseStudy", "author", "contact"].includes(
    page.type,
  );
  const pageKicker = shouldShowPageKicker ? <PageKicker page={page} /> : null;
  const hasLocationsDirectory = renderedSections.some(
    (block) => block.type === "locationsDirectory",
  );
  const hasPortalApplications = renderedSections.some(
    (block) => block.type === "portalApplications",
  );
  const hasPayBill = renderedSections.some((block) => block.type === "payBill");
  const hasSignIn = renderedSections.some((block) => block.type === "signIn");
  const hasEventsListing = renderedSections.some((block) => block.type === "eventsListing");
  const hasArticleListingHero = renderedSections.some(
    (block) => block.type === "articleList" && Boolean(block.hero || block.introHeading),
  );
  const showPageHeader = Boolean(
    page.eyebrow || page.title || page.summary || fallbackNotice || author || pageKicker,
  ) && !hasLocationsDirectory && !hasPortalApplications && !hasPayBill && !hasSignIn && !hasEventsListing && !hasArticleListingHero;
  const trendingInsights =
    page.type === "home" ? (await getInsights({ locale, draft })).slice(0, 4) : [];

  const isNewsLandingPage =
    page.type === "standard" && page.slug.length === 1 && page.slug[0] === "news";

  if (isNewsLandingPage) {
    return (
      <NewsLandingView
        page={page}
        locale={locale}
        draft={draft}
        renderedSections={renderedSections}
      />
    );
  }

  if (page.type === "contact") {
    return (
      <ContactView
        page={page}
        locale={locale}
        draft={draft}
        renderedSections={renderedSections}
      />
    );
  }

  if (page.type === "insight") {
    return (
      <InsightView
        page={page}
        locale={locale}
        draft={draft}
        author={author}
        insightAuthorName={insightAuthorName}
        explicitTopPickPages={explicitTopPickPages}
        explicitReadMorePages={explicitReadMorePages}
        insightRecommendations={insightRecommendations}
        insightRecommendationAuthors={insightRecommendationAuthors}
      />
    );
  }

  const isFullBleedStandalone = hasLocationsDirectory || hasPortalApplications || hasPayBill || hasSignIn || hasEventsListing || hasArticleListingHero;

  return (
    <DefaultView
      page={page}
      locale={locale}
      draft={draft}
      filters={filters}
      fallbackNotice={fallbackNotice}
      author={author}
      insightAuthorName={insightAuthorName}
      pageKicker={pageKicker}
      trendingInsights={trendingInsights}
      renderedSections={renderedSections}
      authorInsights={authorInsights}
      relatedPages={relatedPages}
      showPageHeader={showPageHeader}
      isFullBleedStandalone={isFullBleedStandalone}
    />
  );
}
