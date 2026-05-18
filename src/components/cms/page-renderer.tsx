import Link from "next/link";
import { BlockRenderer } from "@/components/cms/block-renderer";
import {
  getAuthorForInsight,
  getInsights,
  getInsightsByAuthor,
  getRelatedPages,
} from "@/lib/cms";
import type { Block, Locale, Page } from "@/lib/cms/types";

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
        <section className="grid gap-5 lg:grid-cols-3">
          {resourceItems.length ? (
            resourceItems.map((item) => (
              <article key={item.id} className="panel rounded-[1.75rem] p-6">
                <p className="eyebrow text-[11px] font-semibold">{item.topics.join(" • ")}</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted">{item.summary}</p>
                <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted">
                  <span>{item.readTime}</span>
                  <span>•</span>
                  <span>{item.publishedAt}</span>
                </div>
                <Link
                  href={`/${locale}/${item.slug.join("/")}`}
                  className="mt-5 inline-flex text-sm font-semibold text-accent"
                >
                  {locale === "en" ? "Read insight" : "Leer articulo"}
                </Link>
              </article>
            ))
          ) : (
            <div className="panel rounded-[1.75rem] p-6 lg:col-span-3">
              <h2 className="text-2xl font-semibold tracking-tight">
                {locale === "en" ? "No results matched your filters." : "No hay resultados para esos filtros."}
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted">
                {locale === "en"
                  ? "Clear one of the filters or add more insight content to the mock provider."
                  : "Limpie un filtro o agregue mas contenido al proveedor mock."}
              </p>
            </div>
          )}
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