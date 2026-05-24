"use client";

import Link from "next/link";
import { useState } from "react";
import type { ArticleListBlock, Locale } from "@/lib/cms/types";

type ArticleCardData = {
  id: string;
  href: string;
  title: string;
  summary: string;
  publishedAt: string;
  readTime: string;
  topics: string[];
  authorName: string;
  authorAvatar?: string;
  cardImage?: { src: string; alt: string };
};

function resolveHref(href: string, locale: Locale) {
  if (/^https?:\/\//.test(href)) return href;
  if (href.startsWith("/en/") || href.startsWith("/es/")) return href;
  if (href.startsWith("/")) return `/${locale}${href}`;
  return `/${locale}/${href}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

const BUILTIN_FALLBACK_POOL = [
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
];

export function ArticleListing({
  block,
  locale,
  articles,
}: {
  block: ArticleListBlock;
  locale: Locale;
  articles: ArticleCardData[];
}) {
  const initial = Math.max(1, block.initialVisible ?? block.limit ?? 9);
  const step = Math.max(1, block.loadMoreStep ?? 6);
  const [visible, setVisible] = useState(initial);

  const total = articles.length;
  const shown = Math.min(visible, total);
  const visibleArticles = articles.slice(0, shown);
  const readMoreLabel = block.readMoreLabel ?? (locale === "es" ? "Leer mas" : "Read full story");
  const pool =
    block.fallbackImagePool && block.fallbackImagePool.length > 0
      ? block.fallbackImagePool
      : BUILTIN_FALLBACK_POOL;

  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-white">
      {block.hero ? (
        <div className="relative w-full">
          <div className="relative h-[320px] w-full overflow-hidden lg:h-[420px]">
            {block.hero.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={block.hero.imageUrl}
                alt={block.hero.imageAlt ?? ""}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-black/35" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="px-6 text-center text-4xl font-light tracking-wide text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.6)] lg:text-6xl">
                {block.hero.title}
              </h1>
            </div>
          </div>
          <div className="w-full bg-[#5b6471]">
            <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-6 py-4 text-sm text-white lg:px-10">
              <Link
                href={resolveHref(block.hero.breadcrumbHomeHref ?? "/", locale)}
                className="text-white/90 hover:text-white"
              >
                {block.hero.breadcrumbHomeLabel ?? (locale === "es" ? "Inicio" : "Home")}
              </Link>
              <span className="text-white/60">|</span>
              <span className="text-white">
                {block.hero.breadcrumbCurrentLabel ?? (locale === "es" ? "Articulos" : "Articles")}
              </span>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mx-auto w-full max-w-[1200px] px-6 py-12 lg:px-10 lg:py-16">
        {block.introHeading ? (
          <h2 className="text-3xl font-semibold text-[#1247ff] lg:text-4xl">
            {block.introHeading}
          </h2>
        ) : null}
        {block.introBody?.length ? (
          <div className="mt-4 max-w-4xl space-y-3 text-[15px] leading-7 text-[#374151]">
            {block.introBody.map((paragraph, index) => (
              <p key={`intro-${index}`}>{paragraph}</p>
            ))}
          </div>
        ) : null}

        {block.viewAllHref && block.viewAllLabel ? (
          <div className="mt-8 flex justify-end">
            <Link
              href={block.viewAllHref}
              className="inline-flex items-center justify-center border border-[#1247ff] px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-[#1247ff] transition hover:bg-[#1247ff] hover:text-white"
            >
              {block.viewAllLabel}
            </Link>
          </div>
        ) : null}

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleArticles.map((article, index) => {
            const fallbackImage = pool.length ? pool[index % pool.length] : undefined;
            const imgSrc = article.cardImage?.src || fallbackImage;
            const imgAlt = article.cardImage?.alt || article.title;
            const href = resolveHref(article.href, locale);
            return (
              <article
                key={article.id}
                className="flex h-full flex-col bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
              >
                {imgSrc ? (
                  <Link href={href} className="block overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgSrc}
                      alt={imgAlt}
                      loading="lazy"
                      decoding="async"
                      className="h-52 w-full object-cover"
                    />
                  </Link>
                ) : null}
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex flex-wrap items-center gap-2 text-[12px] text-[#374151]">
                    {article.authorAvatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={article.authorAvatar}
                        alt={article.authorName}
                        loading="lazy"
                        decoding="async"
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    ) : null}
                    <span>{article.authorName}</span>
                    <span className="text-[#c2410c]">|</span>
                    <span>{formatDate(article.publishedAt)}</span>
                    <span className="text-[#c2410c]">|</span>
                    <span>{article.readTime}</span>
                  </div>
                  <Link
                    href={href}
                    className="text-[20px] font-semibold leading-snug text-[#1247ff] hover:underline"
                  >
                    {article.title}
                  </Link>
                  {article.topics.length ? (
                    <div className="flex flex-wrap gap-2">
                      {article.topics.map((topic) => (
                        <span
                          key={`${article.id}-${topic}`}
                          className="rounded-full bg-[#f3f4f6] px-3 py-1 text-[12px] text-[#374151]"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <Link
                    href={href}
                    className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold text-[#0f172a] hover:text-[#1247ff]"
                  >
                    {readMoreLabel}
                    <span className="text-[#1247ff]">&rarr;</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {total > 0 && shown < total ? (
          <div className="mt-10 flex justify-center border-t border-[#e5e7eb] pt-6">
            <button
              type="button"
              onClick={() => setVisible((current) => Math.min(current + step, total))}
              className="inline-flex items-center justify-center border border-[#1247ff] px-8 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-[#1247ff] transition hover:bg-[#1247ff] hover:text-white"
            >
              {block.loadMoreLabel ?? (locale === "es" ? "Cargar mas" : "Load more")}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
