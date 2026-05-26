import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { BlockRenderer } from "@/components/cms/block-renderer";
import {
  getAuthorForInsight,
  getInsights,
  getInsightsByAuthor,
  getRelatedInsights,
  getRelatedPages,
} from "@/lib/cms";
import type { Block, Locale, Page } from "@/lib/cms/types";

function isArticleBodyBlock(block: Block) {
  return block.type === "richText" || block.type === "html" || block.type === "image";
}

function renderInlineArticleBlock(block: Block, key: string) {
  if (block.type === "richText") {
    return (
      <div key={key}>
        {block.body.map((paragraph) => {
          const trimmed = paragraph.trim();

          if (trimmed.startsWith("- ")) {
            return (
              <ul key={`${key}-${paragraph}`}>
                <li>{trimmed.slice(2)}</li>
              </ul>
            );
          }

          return <p key={`${key}-${paragraph}`}>{paragraph}</p>;
        })}
      </div>
    );
  }

  if (block.type === "html") {
    return <div key={key} dangerouslySetInnerHTML={{ __html: block.html }} />;
  }

  if (block.type === "image") {
    return (
      <figure key={key} className="my-8 space-y-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={block.src}
          alt={block.alt}
          loading="lazy"
          decoding="async"
          className="w-full object-cover"
        />
        {block.caption ? <figcaption className="text-sm text-muted">{block.caption}</figcaption> : null}
      </figure>
    );
  }

  return null;
}

function renderInlineLinks(text: string) {
  const pattern = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const [, label, href] = match;
    const isExternal = /^https?:\/\//i.test(href);
    nodes.push(
      isExternal ? (
        <a
          key={`link-${key++}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#1554ff", textDecoration: "underline" }}
        >
          {label}
        </a>
      ) : (
        <Link
          key={`link-${key++}`}
          href={href}
          style={{ color: "#1554ff", textDecoration: "underline" }}
        >
          {label}
        </Link>
      ),
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length ? nodes : text;
}

function renderContactIntroBlock(block: Extract<Block, { type: "richText" | "html" }>) {
  if (block.type === "html") {
    return <div className="contact-intro-copy" dangerouslySetInnerHTML={{ __html: block.html }} />;
  }

  return (
    <div className="contact-intro-copy">
      {block.body.map((paragraph) => {
        const trimmed = paragraph.trim();

        if (trimmed.startsWith("- ")) {
          return (
            <ul key={paragraph}>
              <li>{trimmed.slice(2)}</li>
            </ul>
          );
        }

        return <p key={paragraph}>{paragraph}</p>;
      })}
    </div>
  );
}

function formatInsightDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function PageKicker({ page }: { page: Page }) {
  switch (page.type) {
    case "service":
      return (
        <div className="flex flex-wrap gap-2 text-sm text-muted">
          {page.outcomes.map((outcome) => (
            <span key={outcome} className="rounded-full border border-border px-3 py-1">
              {outcome}
            </span>
          ))}
        </div>
      );
    case "industry":
      return (
        <div className="flex flex-wrap gap-2 text-sm text-muted">
          {page.audience.map((audience) => (
            <span key={audience} className="rounded-full border border-border px-3 py-1">
              {audience}
            </span>
          ))}
        </div>
      );
    case "insight":
      return (
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
          <span>{page.readTime}</span>
          <span>•</span>
          <span>{page.publishedAt}</span>
          {page.topics.map((topic) => (
            <span key={topic} className="rounded-full border border-border px-3 py-1">
              {topic}
            </span>
          ))}
        </div>
      );
    case "caseStudy":
      return (
        <div className="grid gap-3 text-sm text-muted md:grid-cols-3">
          <div>
            <div className="font-semibold text-foreground">Client</div>
            <div>{page.client}</div>
          </div>
          <div>
            <div className="font-semibold text-foreground">Challenge</div>
            <div>{page.challenge}</div>
          </div>
          <div>
            <div className="font-semibold text-foreground">Result</div>
            <div>{page.result}</div>
          </div>
        </div>
      );
    case "author":
      return (
        <div className="flex flex-wrap gap-2 text-sm text-muted">
          <span className="rounded-full border border-border px-3 py-1">{page.role}</span>
          {page.expertise.map((skill) => (
            <span key={skill} className="rounded-full border border-border px-3 py-1">
              {skill}
            </span>
          ))}
        </div>
      );
    case "contact":
      return (
        <div className="grid gap-4 md:grid-cols-2">
          {page.offices.map((office) => (
            <div key={office.city} className="rounded-[1.5rem] border border-border bg-white/75 p-5 text-sm">
              <div className="font-semibold text-foreground">{office.city}</div>
              <div className="mt-2 text-muted">{office.phone}</div>
              <div className="mt-2 text-muted">{office.focus}</div>
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
}

function ResourceCenterToolbar({ locale }: { locale: Locale }) {
  const serviceOptions = [
    { value: "", label: locale === "en" ? "All services" : "Todos los servicios" },
    { value: "service-platform", label: "Digital platform strategy" },
    { value: "service-risk", label: "Enterprise risk operations" },
  ];
  const industryOptions = [
    { value: "", label: locale === "en" ? "All industries" : "Todas las industrias" },
    { value: "industry-healthcare", label: "Healthcare" },
  ];
  const topicOptions = [
    { value: "", label: locale === "en" ? "All topics" : "Todos los temas" },
    { value: "Preview", label: "Preview" },
    { value: "Healthcare", label: "Healthcare" },
    { value: "Taxonomy", label: "Taxonomy" },
  ];

  return (
    <form className="panel grid gap-4 rounded-[2rem] p-6 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]">
      <input
        name="q"
        placeholder={locale === "en" ? "Search insights" : "Buscar articulos"}
        className="rounded-full border border-border bg-white/75 px-4 py-3 outline-none transition focus:border-accent"
      />
      <select
        name="service"
        className="rounded-full border border-border bg-white/75 px-4 py-3 outline-none transition focus:border-accent"
        defaultValue=""
      >
        {serviceOptions.map((option) => (
          <option key={option.value || "all-services"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <select
        name="industry"
        className="rounded-full border border-border bg-white/75 px-4 py-3 outline-none transition focus:border-accent"
        defaultValue=""
      >
        {industryOptions.map((option) => (
          <option key={option.value || "all-industries"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <select
        name="topic"
        className="rounded-full border border-border bg-white/75 px-4 py-3 outline-none transition focus:border-accent"
        defaultValue=""
      >
        {topicOptions.map((option) => (
          <option key={option.value || "all-topics"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white">
        {locale === "en" ? "Filter" : "Filtrar"}
      </button>
    </form>
  );
}

function ResourceCenterResultsSkeleton() {
  return (
    <section className="bg-[#f3f4f6] -mx-6 px-6 py-12 lg:-mx-10 lg:px-10 lg:py-16">
      <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <article key={`resource-skeleton-${index}`} className="flex flex-col border-t-2 border-[#1554ff] pt-5">
            <div className="h-7 w-3/4 animate-pulse bg-[#dbe7ff]" />
            <div className="mt-4 h-20 animate-pulse bg-[#e5e7eb]" />
            <div className="mt-4 h-4 w-1/2 animate-pulse bg-[#d1d5db]" />
          </article>
        ))}
      </div>
    </section>
  );
}

async function ResourceCenterResults({
  locale,
  draft,
  filters,
}: {
  locale: Locale;
  draft: boolean;
  filters: {
    q?: string;
    topic?: string;
    service?: string;
    industry?: string;
  };
}) {
  const resourceItems = await getInsights({
    locale,
    draft,
    query: filters.q,
    topic: filters.topic,
    service: filters.service,
    industry: filters.industry,
  });

  return (
    <section className="bg-[#f3f4f6] -mx-6 px-6 py-12 lg:-mx-10 lg:px-10 lg:py-16">
      <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {resourceItems.length ? (
          resourceItems.map((item) => (
            <article
              key={item.id}
              className="flex flex-col border-t-2 border-[#1554ff] pt-5"
            >
              <h2 className="text-2xl font-semibold leading-tight text-[#1554ff]">
                <Link href={`/${locale}/${item.slug.join("/")}`} className="hover:underline">
                  {item.title}
                </Link>
              </h2>
              <p className="mt-4 text-[15px] leading-7 text-[#1f2937]">{item.summary}</p>
              <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#4b5563]">
                <span>{item.readTime}</span>
                <span>•</span>
                <span>{item.publishedAt}</span>
              </div>
            </article>
          ))
        ) : (
          <div className="border-t-2 border-[#1554ff] pt-5 lg:col-span-3">
            <h2 className="text-2xl font-semibold leading-tight text-[#1554ff]">
              {locale === "en" ? "No results matched your filters." : "No hay resultados para esos filtros."}
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-[#1f2937]">
              {locale === "en"
                ? "Clear one of the filters or add more insight content to the mock provider."
                : "Limpie un filtro o agregue mas contenido al proveedor mock."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

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
  const hasEventsListing = renderedSections.some((block) => block.type === "eventsListing");
  const hasArticleListingHero = renderedSections.some(
    (block) => block.type === "articleList" && Boolean(block.hero || block.introHeading),
  );
  const showPageHeader = Boolean(
    page.eyebrow || page.title || page.summary || fallbackNotice || author || pageKicker,
  ) && !hasLocationsDirectory && !hasPortalApplications && !hasPayBill && !hasEventsListing && !hasArticleListingHero;
  const trendingInsights =
    page.type === "home" ? (await getInsights({ locale, draft })).slice(0, 4) : [];

  const isNewsLandingPage =
    page.type === "standard" && page.slug.length === 1 && page.slug[0] === "news";

  if (isNewsLandingPage) {
    const heroBlock = renderedSections.find(
      (block): block is Extract<Block, { type: "hero" }> => block.type === "hero",
    );
    const sidebarBlocks = renderedSections.filter(
      (block): block is Extract<Block, { type: "richText" | "html" | "cta" }> =>
        block.type === "richText" || block.type === "html" || block.type === "cta",
    );
    const newsItems = await getInsights({ locale, draft });

    return (
      <main className="flex-1 bg-white">
        <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
          <div className="relative h-[360px] w-full overflow-hidden bg-[#1f2937] lg:h-[420px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1800&q=70"
              alt={heroBlock?.title ?? page.title}
              className="absolute inset-0 h-full w-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-black/25" aria-hidden />
            <div className="relative z-10 mx-auto flex h-full max-w-[1260px] items-center px-6 lg:px-10">
              <h1 className="text-[3.6rem] font-light tracking-tight text-white lg:text-[4.2rem]">
                {heroBlock?.title ?? page.title}
              </h1>
            </div>
          </div>
          <div className="bg-[#4b5563]">
            <div className="mx-auto max-w-[1260px] px-6 py-3 text-sm text-white lg:px-10">
              <Link href={`/${locale}`} className="hover:underline">
                {locale === "en" ? "Home" : "Inicio"}
              </Link>
              <span className="px-2">|</span>
              <span>{locale === "en" ? "News" : "Noticias"}</span>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1260px] px-6 py-10 lg:px-10 lg:py-14">
          <form className="mb-10 flex flex-wrap gap-4">
            <select
              name="date"
              defaultValue=""
              className="h-12 min-w-[260px] rounded-none border border-[#d1d5db] bg-[#f3f4f6] px-4 text-sm text-[#1f2937]"
            >
              <option value="">{locale === "en" ? "Filter By Date (all)" : "Filtrar por fecha (todas)"}</option>
            </select>
            <select
              name="industry"
              defaultValue=""
              className="h-12 min-w-[260px] rounded-none border border-[#d1d5db] bg-[#f3f4f6] px-4 text-sm text-[#1f2937]"
            >
              <option value="">{locale === "en" ? "Industry (all)" : "Industria (todas)"}</option>
            </select>
          </form>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div>
              <h2 className="text-xl font-semibold uppercase tracking-wide text-[#1554ff]">
                {locale === "en" ? "Most recent news" : "Noticias recientes"}
              </h2>
              <ul className="mt-6 space-y-8">
                {newsItems.map((item) => (
                  <li key={item.id} className="space-y-2">
                    <h3 className="text-[1.35rem] font-semibold leading-snug text-[#1554ff]">
                      <Link href={`/${locale}/${item.slug.join("/")}`} className="hover:underline">
                        {item.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-[#4b5563]">{formatInsightDate(item.publishedAt)}</p>
                    <Link
                      href={`/${locale}/${item.slug.join("/")}`}
                      className="inline-flex text-sm text-[#1554ff] hover:underline"
                    >
                      {locale === "en" ? "View More" : "Ver mas"}
                    </Link>
                  </li>
                ))}
                {newsItems.length === 0 ? (
                  <li className="text-sm text-[#4b5563]">
                    {locale === "en"
                      ? "No news items yet. Publish CMS articles to populate this list."
                      : "Aun no hay noticias. Publique articulos en el CMS."}
                  </li>
                ) : null}
              </ul>
            </div>

            <aside className="space-y-8">
              {sidebarBlocks.length ? (
                sidebarBlocks.map((block, index) => (
                  <div
                    key={`${page.id}-news-side-${index}`}
                    className="bg-[#f3f4f6] p-6 text-sm leading-7 text-[#1f2937] contact-intro-copy"
                  >
                    <BlockRenderer block={block} locale={locale} draft={draft} />
                  </div>
                ))
              ) : (
                <div className="bg-[#f3f4f6] p-6 text-sm leading-7 text-[#4b5563]">
                  {locale === "en"
                    ? "Add Rich Text blocks to the News page in CMS to fill this sidebar (e.g. External News, Contact us)."
                    : "Agregue bloques de texto enriquecido a la pagina News en el CMS para llenar esta barra lateral."}
                </div>
              )}
            </aside>
          </div>
        </section>
      </main>
    );
  }

  if (page.type === "contact") {
    const introBlock = renderedSections.find(
      (block): block is Extract<Block, { type: "richText" | "html" }> =>
        block.type === "richText" || block.type === "html",
    );
    const formBlocks = renderedSections.filter(
      (block): block is Extract<Block, { type: "form" }> => block.type === "form",
    );

    return (
      <main className="flex-1">
        <section className="bg-[#d9d9dd]">
          <div className="mx-auto max-w-[1260px] px-6 py-8 lg:px-10 lg:py-10">
            <h1 className="text-[3.8rem] font-light tracking-tight text-[#1554ff] lg:text-[4.1rem]">
              {page.title}
            </h1>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-[1260px] px-6 py-10 lg:px-10 lg:py-12">
            {formBlocks.length ? (
              <div className="max-w-[1100px] space-y-4">
                {formBlocks[0].intro ? (
                  <h2 className="text-[2.4rem] font-normal leading-[1.15] text-[#1554ff] lg:text-[2.7rem]">
                    {formBlocks[0].intro}
                  </h2>
                ) : null}
                {(formBlocks[0].introText ?? "")
                  .replace(/<br\s*\/?>(\s*<br\s*\/?>)*/gi, "\n\n")
                  .split(/\r?\n+/)
                  .map((p) => p.trim())
                  .filter(Boolean)
                  .map((paragraph, index) => (
                    <p key={index} className="text-[14px] leading-7 text-[#374151]">
                      {renderInlineLinks(paragraph)}
                    </p>
                  ))}
              </div>
            ) : null}

            {introBlock ? (
              <div className="mt-6 max-w-[860px]">{renderContactIntroBlock(introBlock)}</div>
            ) : null}

            <div className="mx-auto mt-8 max-w-[760px]">
              {formBlocks.map((block, index) => (
                <BlockRenderer
                  key={`${page.id}-${block.type}-${index}`}
                  block={{ ...block, title: "", intro: "", introText: "" }}
                  locale={locale}
                  draft={draft}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (page.type === "insight") {
    const labels = {
      backToArticles: page.uiLabels?.backToArticles ?? (locale === "en" ? "Back to Articles" : "Volver a articulos"),
      keyTakeaways: page.uiLabels?.keyTakeaways ?? "Key takeaways",
      topPicks: page.uiLabels?.topPicks ?? (locale === "en" ? "Top picks" : "Destacados"),
      readMore: page.uiLabels?.readMore ?? "Read more",
      authors: page.uiLabels?.authors ?? "Author(s)",
      viewProfile: page.uiLabels?.viewProfile ?? (locale === "en" ? "View Profile →" : "Ver perfil →"),
      readFullStory: page.uiLabels?.readFullStory ?? (locale === "en" ? "Read full story →" : "Leer articulo →"),
    };
    const backToArticlesHref = `/${locale}/article`;
    const topPicks = explicitTopPickPages.length ? explicitTopPickPages.slice(0, 3) : insightRecommendations.slice(0, 3);
    const readMore = explicitReadMorePages.length ? explicitReadMorePages.slice(0, 6) : insightRecommendations.slice(3, 6);
    const renderedArticleSections = page.sections.length
      ? page.sections
      : [
          {
            type: "richText" as const,
            body: [page.summary],
          },
        ];
    const leadBlock = renderedArticleSections[0] ?? null;
    const bodyBlocks = renderedArticleSections.slice(1).filter(isArticleBodyBlock);
    const supplementalBlocks = renderedArticleSections.slice(1).filter((block) => !isArticleBodyBlock(block));

    return (
      <main className="article-detail mx-auto flex w-full max-w-[1260px] flex-1 flex-col gap-8 px-6 py-8 lg:px-10 lg:py-10">
        <div>
          <Link href={backToArticlesHref} className="text-sm font-semibold text-[#2563eb] transition hover:text-[#1d4ed8]">
            ← {labels.backToArticles}
          </Link>
        </div>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
          <article className="min-w-0 space-y-8">
            <header className="space-y-6">
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-balance text-black lg:text-[3.35rem] lg:leading-[1.08]">
                {page.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-sm text-[#4b5563]">
                {author?.avatarSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={author.avatarSrc}
                    alt={author.title}
                    loading="lazy"
                    decoding="async"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : null}
                {insightAuthorName ? (
                  author ? (
                    <Link href={`/${locale}/${author.slug.join("/")}`} className="font-semibold text-black">
                      {author.title}
                    </Link>
                  ) : (
                    <span className="font-semibold text-black">{insightAuthorName}</span>
                  )
                ) : null}
                <span>|</span>
                <span>{formatInsightDate(page.publishedAt)}</span>
                <span>|</span>
                <span>{page.readTime}</span>
              </div>

              {page.topics.length ? (
                <div className="flex flex-wrap gap-3">
                  {page.topics.map((topic) => (
                    <span key={topic} className="rounded-full bg-[#f3f4f6] px-3 py-1 text-sm text-black">
                      {topic}
                    </span>
                  ))}
                </div>
              ) : null}
            </header>

            {leadBlock?.type === "richText" ? (
              <section className="max-w-[740px] bg-[#f3f4f6] px-6 py-6">
                <h2 className="mb-4 text-[1.65rem] font-semibold tracking-tight text-[#374151]">
                  {leadBlock.title ?? labels.keyTakeaways}
                </h2>
                <div className="article-copy">
                  {leadBlock.body.map((paragraph) => {
                    const trimmed = paragraph.trim();

                    if (trimmed.startsWith("- ")) {
                      return (
                        <ul key={paragraph}>
                          <li>{trimmed.slice(2)}</li>
                        </ul>
                      );
                    }

                    return <p key={paragraph}>{paragraph}</p>;
                  })}
                </div>
              </section>
            ) : null}

            <section className="article-copy max-w-[760px]">
              {bodyBlocks.map((block, index) => renderInlineArticleBlock(block, `${page.id}-article-${index}`))}
            </section>

            {supplementalBlocks.map((block, index) => (
              <BlockRenderer
                key={`${page.id}-${block.type}-supplemental-${index}`}
                block={block}
                locale={locale}
                draft={draft}
              />
            ))}

            {readMore.length ? (
              <section className="max-w-[760px] space-y-4 pt-8">
                <h2 className="text-[2rem] font-medium tracking-tight text-[#2563eb]">{labels.readMore}</h2>
                <ul className="space-y-3 text-lg text-[#2563eb]">
                  {readMore.map((item) => (
                    <li key={item.translationKey}>
                      <Link href={`/${locale}/${item.slug.join("/")}`} className="transition hover:text-[#1d4ed8]">
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {author ? (
              <section className="max-w-[760px] space-y-5 pt-8">
                <h2 className="text-[2.25rem] font-black tracking-tight text-black">{labels.authors}</h2>
                <div className="flex items-center gap-4">
                  {author.avatarSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={author.avatarSrc}
                      alt={author.title}
                      loading="lazy"
                      decoding="async"
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : null}
                  <div>
                    <div className="text-xl font-semibold text-black">{author.title}</div>
                    <p className="text-sm text-[#4b5563]">{author.role}</p>
                    <Link href={`/${locale}/${author.slug.join("/")}`} className="mt-1 inline-flex text-sm font-semibold text-[#2563eb]">
                      {labels.viewProfile}
                    </Link>
                  </div>
                </div>
              </section>
            ) : null}
          </article>

          <aside className="space-y-8 lg:sticky lg:top-24">
            <section>
              <h2 className="text-xl font-semibold uppercase tracking-tight text-[#2563eb]">{labels.topPicks}</h2>
              <div className="mt-5 space-y-5">
                {topPicks.length ? (
                  topPicks.map((item, index) => {
                    const recommendationAuthor = insightRecommendationAuthors[index];
                    const recommendationAuthorName =
                      recommendationAuthor?.title ?? item.authorName ?? (locale === "en" ? "Editorial team" : "Equipo editorial");

                    return (
                      <article key={item.translationKey} className="border-t border-[#d1d5db] pt-5 first:border-t first:pt-5">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#4b5563]">
                          {recommendationAuthor?.avatarSrc ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={recommendationAuthor.avatarSrc}
                              alt={recommendationAuthor.title}
                              loading="lazy"
                              decoding="async"
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : null}
                          <span className="font-semibold text-black">{recommendationAuthorName}</span>
                          <span>|</span>
                          <span>{formatInsightDate(item.publishedAt)}</span>
                        </div>
                        <Link href={`/${locale}/${item.slug.join("/")}`} className="mt-3 block text-base font-medium leading-7 text-black transition hover:text-[#2563eb]">
                          {item.title}
                        </Link>
                        <Link href={`/${locale}/${item.slug.join("/")}`} className="mt-3 inline-flex text-sm font-semibold text-[#2563eb]">
                          {labels.readFullStory}
                        </Link>
                      </article>
                    );
                  })
                ) : (
                  <p className="text-sm leading-7 text-[#4b5563]">
                    {locale === "en"
                      ? "Add more related articles in CMS to populate this sidebar."
                      : "Agregue mas articulos relacionados en el CMS para completar esta barra lateral."}
                  </p>
                )}
              </div>
            </section>
          </aside>
        </div>
      </main>
    );
  }

  const isFullBleedStandalone = hasLocationsDirectory || hasPortalApplications || hasPayBill || hasEventsListing || hasArticleListingHero;

  return (
    <main
      className={
        isFullBleedStandalone
          ? "flex w-full flex-1 flex-col bg-white"
          : "mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-6 py-10 lg:px-10 lg:py-14"
      }
    >
      {showPageHeader ? (
        page.type === "home" ? (
          <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster={
                page.headerVideoPoster ??
                "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=60"
              }
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source
                src={
                  page.headerVideoUrl ??
                  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
                }
                type="video/mp4"
              />
              <source
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                type="video/mp4"
              />
              <source
                src="https://cdn.pixabay.com/video/2024/03/15/204306-924035851_large.mp4"
                type="video/mp4"
              />
            </video>
            <div className="absolute inset-0 bg-black/40" aria-hidden />
            <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
              <div className="max-w-2xl bg-[#1247ff] px-8 py-10 lg:px-12 lg:py-12">
                {page.eyebrow ? (
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/85">
                    {page.eyebrow}
                  </p>
                ) : null}
                {page.title ? (
                  <h1 className="mt-4 text-4xl font-extrabold uppercase leading-tight tracking-tight text-white lg:text-6xl">
                    {page.title}
                  </h1>
                ) : null}
                {page.summary ? (
                  <p className="mt-5 max-w-xl text-base leading-7 text-white/95">{page.summary}</p>
                ) : null}
                {fallbackNotice ? (
                  <p className="mt-5 inline-flex border border-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                    {fallbackNotice}
                  </p>
                ) : null}
                {insightAuthorName ? (
                  <p className="mt-5 text-sm text-white/90">
                    By{" "}
                    {author ? (
                      <Link
                        href={`/${locale}/${author.slug.join("/")}`}
                        className="font-semibold text-white underline"
                      >
                        {author.title}
                      </Link>
                    ) : (
                      <span className="font-semibold text-white">{insightAuthorName}</span>
                    )}
                  </p>
                ) : null}
                {pageKicker ? <div className="mt-5 text-white">{pageKicker}</div> : null}
              </div>
            </div>
          </section>
        ) : (
          <section className="border-b border-[#e5e7eb] pb-10">
            {page.eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1247ff]">
                {page.eyebrow}
              </p>
            ) : null}
            {page.title ? (
              <h1 className="mt-4 text-4xl font-extrabold uppercase leading-tight tracking-tight text-[#0b1220] lg:text-5xl">
                {page.title}
              </h1>
            ) : null}
            {page.summary ? (
              <p className="mt-5 max-w-3xl text-base leading-7 text-[#1247ff]">{page.summary}</p>
            ) : null}
            {fallbackNotice ? (
              <p className="mt-5 inline-flex border border-[#1247ff] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#1247ff]">
                {fallbackNotice}
              </p>
            ) : null}
            {insightAuthorName ? (
              <p className="mt-5 text-sm text-[#4b5563]">
                By{" "}
                {author ? (
                  <Link
                    href={`/${locale}/${author.slug.join("/")}`}
                    className="font-semibold text-[#1247ff] underline"
                  >
                    {author.title}
                  </Link>
                ) : (
                  <span className="font-semibold text-[#0b1220]">{insightAuthorName}</span>
                )}
              </p>
            ) : null}
            {pageKicker ? <div className="mt-5 text-[#0b1220]">{pageKicker}</div> : null}
          </section>
        )
      ) : null}

      {page.type === "home" && trendingInsights.length ? (
        <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-[#1247ff] px-6 py-16 lg:px-10 lg:py-20">
          <div className="mx-auto max-w-[1240px]">
            <h2 className="text-4xl font-extrabold uppercase leading-tight tracking-tight text-white lg:text-5xl">
              {locale === "en" ? "Trending Insights" : "Tendencias destacadas"}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/90">
              {locale === "en"
                ? "Fresh perspectives and strategic insights from Summit Advisory Group"
                : "Perspectivas frescas e ideas estrategicas de Summit Advisory Group"}
            </p>
            <div className="mt-10 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
              {trendingInsights.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col border-t-2 border-white pt-5"
                >
                  <h3 className="text-xl font-bold leading-snug text-white">
                    <Link href={`/${locale}/${item.slug.join("/")}`} className="hover:underline">
                      {item.title}
                    </Link>
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-white/90">{item.summary}</p>
                  <Link
                    href={`/${locale}/${item.slug.join("/")}`}
                    className="mt-6 inline-flex text-sm font-semibold uppercase tracking-wide text-white hover:underline"
                  >
                    {locale === "en" ? "Read now >" : "Leer ahora >"}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {page.type === "resourceCenter" ? <ResourceCenterToolbar locale={locale} /> : null}

      {page.type === "resourceCenter" ? (
        <Suspense fallback={<ResourceCenterResultsSkeleton />}>
          <ResourceCenterResults locale={locale} draft={draft} filters={filters} />
        </Suspense>
      ) : null}

      <div className="flex flex-col gap-8">
        {renderedSections.map((block, index) => (
          <BlockRenderer
            key={`${page.id}-${block.type}-${index}`}
            block={block}
            locale={locale}
            draft={draft}
          />
        ))}
      </div>

      {page.type === "author" && authorInsights.length ? (
        <section className="space-y-5">
          <h2 className="serif text-3xl font-semibold tracking-tight">
            {locale === "en" ? "Recent insights" : "Articulos recientes"}
          </h2>
          <div className="grid gap-5 lg:grid-cols-2">
            {authorInsights.map((item) => (
              <article key={item.id} className="panel rounded-[1.75rem] p-6">
                <h3 className="text-2xl font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{item.summary}</p>
                <Link href={`/${locale}/${item.slug.join("/")}`} className="mt-4 inline-flex text-sm font-semibold text-accent">
                  {locale === "en" ? "Open insight" : "Abrir articulo"}
                </Link>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {relatedPages.length ? (
        <section className="space-y-5">
          <h2 className="serif text-3xl font-semibold tracking-tight">
            {locale === "en" ? "Related content" : "Contenido relacionado"}
          </h2>
          <div className="grid gap-5 lg:grid-cols-3">
            {relatedPages.map((item) => (
              <article key={item.id} className="panel rounded-[1.75rem] p-6">
                <p className="eyebrow text-[11px] font-semibold">{item.eyebrow ?? item.type}</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{item.summary}</p>
                <Link href={`/${locale}/${item.slug.join("/")}`} className="mt-4 inline-flex text-sm font-semibold text-accent">
                  {locale === "en" ? "Open page" : "Abrir pagina"}
                </Link>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}