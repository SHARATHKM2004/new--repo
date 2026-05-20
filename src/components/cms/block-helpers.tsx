import Link from "next/link";
import type { Block, Locale, Page } from "@/lib/cms/types";

/**
 * Helper function to resolve internal card hrefs with locale prefix
 */
export function resolveCardHref(href: string, locale: Locale) {
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

/**
 * Format article publish date using Intl.DateTimeFormat
 */
export function formatArticleDate(publishedAt: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${publishedAt}T00:00:00`));
}

/**
 * Reusable card component for CMS content listings
 */
export function ContentCard({ page }: { page: Page }) {
  return (
    <article className="rounded-[1.75rem] border border-border bg-surface-strong p-6 shadow-[0_16px_40px_rgba(21,49,58,0.08)]">
      <p className="eyebrow text-[11px] font-semibold">{page.eyebrow ?? page.type}</p>
      <h3 className="mt-3 text-xl font-semibold tracking-tight">{page.title}</h3>
      <p className="mt-3 text-sm leading-7 text-muted">{page.summary}</p>
      <Link
        href={`/${page.locale}/${page.slug.join("/")}`}
        className="mt-5 inline-flex text-sm font-semibold text-accent transition hover:text-accent-strong"
      >
        Explore
      </Link>
    </article>
  );
}

/**
 * Article card component with author metadata and topic tags
 */
export function ArticleCard({
  page,
  author,
}: {
  page: Extract<Page, { type: "insight" }>;
  author: Extract<Page, { type: "author" }> | null;
}) {
  const href = `/${page.locale}/${page.slug.join("/")}`;
  const authorName = author?.title ?? page.authorName ?? "Editorial team";

  return (
    <article className="flex h-full flex-col overflow-hidden bg-[#ececec]">
      <Link href={href} className="block overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={page.cardImage?.src ?? "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80"}
          alt={page.cardImage?.alt ?? page.title}
          width={1200}
          height={640}
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="h-64 w-full object-cover transition duration-300 hover:scale-[1.02]"
        />
      </Link>
      <div className="flex min-h-[21rem] flex-1 flex-col gap-5 p-5 lg:p-6">
        <div className="flex flex-wrap items-center gap-2 text-[12px] text-[#0f172a]">
          {author?.avatarSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={author.avatarSrc}
              alt={author.title}
              loading="lazy"
              decoding="async"
              className="h-7 w-7 rounded-full object-cover"
            />
          ) : null}
          <div className="flex flex-wrap items-center gap-2">
            <span>{authorName}</span>
            <span>|</span>
            <span>{formatArticleDate(page.publishedAt)}</span>
            <span>|</span>
            <span>{page.readTime}</span>
          </div>
        </div>

        <Link href={href} className="text-[1.75rem] font-semibold leading-tight text-[#1247ff] transition hover:text-[#0d36c2]">
          {page.title}
        </Link>

        <div className="flex flex-wrap gap-2">
          {page.topics.map((topic) => (
            <span
              key={topic}
              className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#4b5563]"
            >
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
