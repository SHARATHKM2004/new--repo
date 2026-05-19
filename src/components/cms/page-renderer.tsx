import Link from "next/link";
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
        <img src={block.src} alt={block.alt} className="w-full object-cover" />
        {block.caption ? <figcaption className="text-sm text-muted">{block.caption}</figcaption> : null}
      </figure>
    );
  }

  return null;
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
  const resourceItems =
    page.type === "resourceCenter"
      ? await getInsights({
          locale,
          draft,
          query: filters.q,
          topic: filters.topic,
          service: filters.service,
          industry: filters.industry,
        })
      : [];
  const isArticleLandingPage =
    page.type === "standard" &&
    page.slug[0] === "article" &&
    (page.slug.length === 1 || page.slug[1] === "all");
  const articleListFallbackBlock: Block | null = isArticleLandingPage
    ? {
        type: "articleList",
        title: "Articles",
        limit: page.slug[1] === "all" ? 15 : 3,
        viewAllLabel: page.slug[1] === "all" ? undefined : "View all articles",
        viewAllHref: page.slug[1] === "all" ? undefined : `/${locale}/article/all`,
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
  const showPageHeader = Boolean(
    page.eyebrow || page.title || page.summary || fallbackNotice || author || pageKicker,
  );

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
                  <img src={author.avatarSrc} alt={author.title} className="h-8 w-8 rounded-full object-cover" />
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
                    <img src={author.avatarSrc} alt={author.title} className="h-16 w-16 rounded-full object-cover" />
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

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-6 py-10 lg:px-10 lg:py-14">
      {showPageHeader ? (
        <section className="panel rounded-[2.5rem] px-6 py-8 lg:px-10 lg:py-12">
          <div className="max-w-4xl space-y-5">
            {page.eyebrow ? <p className="eyebrow text-xs font-semibold">{page.eyebrow}</p> : null}
            {page.title ? (
              <h1 className="serif text-5xl font-semibold tracking-tight text-balance lg:text-6xl">
                {page.title}
              </h1>
            ) : null}
            {page.summary ? <p className="max-w-3xl text-lg leading-8 text-muted">{page.summary}</p> : null}
            {fallbackNotice ? (
              <p className="inline-flex rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm text-accent-strong">
                {fallbackNotice}
              </p>
            ) : null}
            {insightAuthorName ? (
              <p className="text-sm text-muted">
                By{" "}
                {author ? (
                  <Link href={`/${locale}/${author.slug.join("/")}`} className="font-semibold text-foreground">
                    {author.title}
                  </Link>
                ) : (
                  <span className="font-semibold text-foreground">{insightAuthorName}</span>
                )}
              </p>
            ) : null}
            {pageKicker}
          </div>
        </section>
      ) : null}

      {page.type === "resourceCenter" ? <ResourceCenterToolbar locale={locale} /> : null}

      {page.type === "resourceCenter" ? (
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