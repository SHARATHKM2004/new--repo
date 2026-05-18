import Link from "next/link";
import { LeadForm } from "@/components/forms/lead-form";
import { getAuthorForInsight, getFeaturedContent, getInsights } from "@/lib/cms";
import type { Block, Locale, Page } from "@/lib/cms/types";

function resolveCardHref(href: string, locale: Locale) {
  if (/^https?:\/\//.test(href)) {
    return href;
  }

  if (href.startsWith("/en/") || href.startsWith("/es/")) {
    return href;
  }

  if (href.startsWith("/")) {
    return `/${locale}${href}`;
  }

  return `/${locale}/${href}`;
}

function ContentCard({ page }: { page: Page }) {
  return (
    <article className="border border-border bg-surface-strong p-7 shadow-[0_14px_40px_rgba(3,43,73,0.08)]">
      <p className="eyebrow text-[11px] font-semibold">{page.eyebrow ?? page.type}</p>
      <h3 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">{page.title}</h3>
      <p className="mt-4 text-base leading-7 text-muted">{page.summary}</p>
      <Link
        href={`/${page.locale}/${page.slug.join("/")}`}
        className="wipfli-link mt-6"
      >
        Explore
        <span>→</span>
      </Link>
    </article>
  );
}

function formatArticleDate(publishedAt: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${publishedAt}T00:00:00`));
}

function ArticleCard({
  page,
  author,
}: {
  page: Extract<Page, { type: "insight" }>;
  author: Extract<Page, { type: "author" }> | null;
}) {
  const href = `/${page.locale}/${page.slug.join("/")}`;
  const authorName = author?.title ?? page.authorName ?? "Editorial team";

  return (
    <article className="flex h-full flex-col overflow-hidden border border-border bg-white shadow-[0_14px_40px_rgba(3,43,73,0.08)]">
      <Link href={href} className="block overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={page.cardImage?.src ?? "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80"}
          alt={page.cardImage?.alt ?? page.title}
          className="h-[13.5rem] w-full object-cover transition duration-300 hover:scale-[1.02]"
        />
      </Link>
      <div className="flex min-h-[24rem] flex-1 flex-col gap-5 p-4 lg:p-5">
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted">
          {author?.avatarSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={author.avatarSrc}
              alt={author.title}
              className="h-7 w-7 rounded-full object-cover"
            />
          ) : null}
          <div className="flex flex-wrap items-center gap-2">
            <span>{authorName}</span>
            <span className="h-3 w-px bg-[#1247ff]" />
            <span>{formatArticleDate(page.publishedAt)}</span>
            <span className="h-3 w-px bg-[#1247ff]" />
            <span>{page.readTime}</span>
          </div>
        </div>

        <Link href={href} className="text-[2rem] font-semibold leading-[1.15] text-[#135cff] transition hover:text-[#0d46c7]">
          {page.title}
        </Link>

        <div className="flex flex-wrap gap-2">
          {page.topics.map((topic) => (
            <span key={topic} className="wipfli-chip">
              {topic}
            </span>
          ))}
        </div>

        <Link
          href={href}
          className="mt-auto inline-flex items-center gap-2 pt-4 text-base font-semibold text-[#0a2463] transition hover:text-[#1247ff]"
        >
          Read full story
          <span className="text-[#1247ff]">→</span>
        </Link>
      </div>
    </article>
  );
}

export async function BlockRenderer({
  block,
  locale,
  draft,
}: {
  block: Block;
  locale: Locale;
  draft: boolean;
}) {
  switch (block.type) {
    case "hero":
      return (
        <section className="panel px-7 py-12 lg:px-12 lg:py-16">
          <p className="eyebrow text-xs font-semibold">{block.eyebrow}</p>
          <h1 className="serif mt-4 max-w-5xl text-5xl font-semibold tracking-tight text-balance lg:text-7xl">
            {block.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">{block.intro}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {block.primaryCta ? (
              <Link
                href={block.primaryCta.href}
                className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong"
              >
                {block.primaryCta.label}
              </Link>
            ) : null}
            {block.secondaryCta ? (
              <Link
                href={block.secondaryCta.href}
                className="rounded-full border border-border bg-white px-6 py-3 text-sm font-semibold transition hover:border-accent hover:text-accent"
              >
                {block.secondaryCta.label}
              </Link>
            ) : null}
          </div>
        </section>
      );
    case "richText":
      return (
        <section className="panel prose-copy p-8 lg:p-10">
          {block.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      );
    case "html":
      return (
        <section className="panel prose-copy p-8 lg:p-10">
          <div dangerouslySetInnerHTML={{ __html: block.html }} />
        </section>
      );
    case "image":
      return (
        <section className="panel overflow-hidden p-4 lg:p-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={block.src} alt={block.alt} className="w-full object-cover" />
          {block.caption ? <p className="mt-4 text-sm leading-7 text-muted">{block.caption}</p> : null}
        </section>
      );
    case "video":
      return (
        <section className="panel overflow-hidden p-4 lg:p-6">
          <div className="overflow-hidden bg-foreground/5">
            {block.mode === "embed" ? (
              <iframe
                src={block.src}
                title={block.title}
                className="aspect-video w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                controls
                className="aspect-video w-full"
                src={block.src}
                poster={block.poster}
                preload="metadata"
              />
            )}
          </div>
          {block.caption ? <p className="mt-4 text-sm leading-7 text-muted">{block.caption}</p> : null}
        </section>
      );
    case "stats":
      return (
        <section className="panel p-8 lg:p-10">
          <h2 className="wipfli-section-title">{block.title}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {block.items.map((item) => (
              <div key={item.label} className="border border-border bg-[#f8f8f8] p-6">
                <div className="text-5xl font-semibold tracking-tight text-accent-warm">
                  {item.value}
                </div>
                <div className="mt-2 text-sm leading-6 text-muted">{item.label}</div>
              </div>
            ))}
          </div>
        </section>
      );
    case "quote":
      return (
        <section className="panel p-8 lg:p-10">
          <blockquote className="serif max-w-4xl text-3xl font-semibold leading-tight tracking-tight">
            “{block.quote}”
          </blockquote>
          <p className="mt-6 text-sm font-semibold text-foreground">{block.attribution}</p>
          {block.role ? <p className="mt-1 text-sm text-muted">{block.role}</p> : null}
        </section>
      );
    case "cardGrid":
      return (
        <section className="space-y-6">
          <div>
            <h2 className="wipfli-section-title">{block.title}</h2>
            {block.intro ? <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">{block.intro}</p> : null}
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {block.cards.map((card) => (
              <article key={card.title} className="panel p-6 lg:p-7">
                {card.eyebrow ? <p className="eyebrow text-[11px] font-semibold">{card.eyebrow}</p> : null}
                <h3 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{card.body}</p>
                <Link href={resolveCardHref(card.href, locale)} className="wipfli-link mt-6">
                  Explore
                  <span>→</span>
                </Link>
              </article>
            ))}
          </div>
        </section>
      );
    case "cta":
      return (
        <section
          className={`px-8 py-9 text-white lg:px-10 ${
            block.tone === "accent" ? "bg-accent" : "bg-footer"
          }`}
        >
          <h2 className="wipfli-section-title text-white">{block.title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/78">{block.body}</p>
          <Link
            href={block.action.href}
            className="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-foreground"
          >
            {block.action.label}
          </Link>
        </section>
      );
    case "featuredContent": {
      const items = await getFeaturedContent({
        locale,
        contentTypes: block.contentTypes,
        topic: block.topic,
        service: block.service,
        industry: block.industry,
        ids: block.ids,
        limit: block.limit,
        draft,
      });

      return (
        <section className="space-y-6">
          <div>
            <h2 className="wipfli-section-title">{block.title}</h2>
            {block.intro ? <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">{block.intro}</p> : null}
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {items.map((item) => (
              <ContentCard key={item.id} page={item} />
            ))}
          </div>
        </section>
      );
    }
    case "articleList": {
      const allInsights = await getInsights({ locale, draft });
      const cmsInsights = allInsights.filter((item) => item.contentSource === "optimizely");
      const sourceInsights = cmsInsights.length ? cmsInsights : allInsights;
      const orderedInsights = block.ids?.length
        ? block.ids
            .map((id) => sourceInsights.find((item) => item.translationKey === id) ?? null)
            .filter((item): item is Extract<Page, { type: "insight" }> => Boolean(item))
            .slice(0, block.limit)
        : sourceInsights.slice(0, block.limit);
      const authors = await Promise.all(
        orderedInsights.map((item) =>
          getAuthorForInsight({ locale: item.locale, authorId: item.authorId, draft }),
        ),
      );

      return (
        <section className="space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="wipfli-section-title uppercase">
              {block.title}
            </h2>
            {block.viewAllHref && block.viewAllLabel ? (
              <Link
                href={block.viewAllHref}
                className="wipfli-link"
              >
                {block.viewAllLabel}
                <span>→</span>
              </Link>
            ) : null}
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {orderedInsights.map((item, index) => (
              <ArticleCard key={item.id} page={item} author={authors[index]} />
            ))}
          </div>
        </section>
      );
    }
    case "form":
      return (
        <LeadForm
          locale={locale}
          title={block.title}
          intro={block.intro}
          submitLabel={block.submitLabel ?? (locale === "en" ? "Submit" : "Enviar")}
        />
      );
    default:
      return null;
  }
}