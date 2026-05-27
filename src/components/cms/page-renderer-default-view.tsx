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
              // @ts-expect-error -- fetchpriority valid HTML attribute, types lag
              fetchpriority="high"
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
                    className="mt-6 inline-flex text-sm font-semibold uppercase tracking-wide text-white underline underline-offset-4 hover:no-underline"
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
