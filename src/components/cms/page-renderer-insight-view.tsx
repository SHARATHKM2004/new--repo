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
    const labels = {
      backToArticles: page.uiLabels?.backToArticles ?? (locale === "en" ? "Back to Articles" : "Volver a articulos"),
      keyTakeaways: page.uiLabels?.keyTakeaways ?? "Key takeaways",
      topPicks: page.uiLabels?.topPicks ?? (locale === "en" ? "Top picks" : "Destacados"),
      readMore: page.uiLabels?.readMore ?? "Read more",
      authors: page.uiLabels?.authors ?? "Author(s)",
      viewProfile: page.uiLabels?.viewProfile ?? (locale === "en" ? "View Profile â†’" : "Ver perfil â†’"),
      readFullStory: page.uiLabels?.readFullStory ?? (locale === "en" ? "Read full story â†’" : "Leer articulo â†’"),
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
            â† {labels.backToArticles}
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
