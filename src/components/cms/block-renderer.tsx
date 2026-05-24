import Link from "next/link";
import Image from "next/image";
import { Suspense, lazy } from "react";
import { getAuthorForInsight, getFeaturedContent, getInsights } from "@/lib/cms";
import type { Block, Locale, Page } from "@/lib/cms/types";
import { LocationsDirectory } from "@/components/cms/locations-directory";
import { PortalApplications } from "@/components/cms/portal-applications";
import { PayBill } from "@/components/cms/pay-bill";
import { EventsListing } from "@/components/cms/events-listing";
import { ArticleListing } from "@/components/cms/article-listing";

const LeadForm = lazy(() =>
  import("@/components/forms/lead-form").then((module) => ({
    default: module.LeadForm,
  })),
);

function LeadFormFallback() {
  return (
    <section className="panel rounded-[2rem] p-8 space-y-6">
      <div className="h-8 w-1/2 animate-pulse bg-[#e5e7eb]" />
      <div className="h-4 w-3/4 animate-pulse bg-[#d1d5db]" />
      <div className="h-40 animate-pulse bg-[#e5e7eb]" />
      <div className="h-10 w-32 animate-pulse bg-[#dbe7ff]" />
    </section>
  );
}

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
        <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=70"
            alt=""
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" aria-hidden />
          <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
            <div className="max-w-2xl bg-[#1247ff] px-8 py-10 lg:px-12 lg:py-12">
              {block.eyebrow ? (
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/85">
                  {block.eyebrow}
                </p>
              ) : null}
              <h1 className="mt-4 text-4xl font-extrabold uppercase leading-tight tracking-tight text-white lg:text-6xl">
                {block.title}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/95">{block.intro}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {block.primaryCta ? (
                  <Link
                    href={block.primaryCta.href}
                    className="inline-flex items-center justify-center border border-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-[#1247ff]"
                  >
                    {block.primaryCta.label}
                  </Link>
                ) : null}
                {block.secondaryCta ? (
                  <Link
                    href={block.secondaryCta.href}
                    className="inline-flex items-center justify-center border border-white/70 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-[#1247ff]"
                  >
                    {block.secondaryCta.label}
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      );
    case "richText":
      return (
        <section className="panel prose-copy rounded-[2rem] p-8">
          {block.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      );
    case "html":
      return (
        <section className="panel prose-copy rounded-[2rem] p-8">
          <div dangerouslySetInnerHTML={{ __html: block.html }} />
        </section>
      );
    case "image":
      return (
        <section className="panel overflow-hidden rounded-[2rem] p-4 lg:p-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={block.src}
            alt={block.alt}
            loading="lazy"
            decoding="async"
            className="w-full rounded-[1.5rem] object-cover"
          />
          {block.caption ? <p className="mt-4 text-sm leading-7 text-muted">{block.caption}</p> : null}
        </section>
      );
    case "video":
      return (
        <section className="panel overflow-hidden rounded-[2rem] p-4 lg:p-6">
          <div className="overflow-hidden rounded-[1.5rem] bg-foreground/5">
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
        <section className="panel rounded-[2rem] p-8">
          <h2 className="serif text-3xl font-semibold tracking-tight">{block.title}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {block.items.map((item) => (
              <div key={item.label} className="rounded-[1.5rem] bg-white/70 p-5">
                <div className="text-4xl font-semibold tracking-tight text-accent-warm">
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
        <section className="panel rounded-[2rem] p-8">
          <blockquote className="serif max-w-4xl text-3xl font-semibold leading-tight tracking-tight">
            “{block.quote}”
          </blockquote>
          <p className="mt-6 text-sm font-semibold text-foreground">{block.attribution}</p>
          {block.role ? <p className="mt-1 text-sm text-muted">{block.role}</p> : null}
        </section>
      );
    case "cardGrid":
      return (
        <section>
          <h2 className="text-4xl font-extrabold uppercase leading-tight tracking-tight text-[#1247ff] lg:text-6xl">
            {block.title}
          </h2>
          {block.intro ? (
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#1247ff]">{block.intro}</p>
          ) : null}
          <div className="mt-10 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {block.cards.map((card) => (
              <article key={card.title} className="border-t border-[#d1d5db] pt-5">
                <Link
                  href={resolveCardHref(card.href, locale)}
                  style={{ color: "#1247ff" }}
                  className="text-xl font-bold leading-snug hover:underline"
                >
                  {card.title}
                </Link>
                <p className="mt-3 text-sm font-bold leading-7 text-[#1247ff]">{card.body}</p>
                <Link
                  href={resolveCardHref(card.href, locale)}
                  className="mt-5 inline-flex text-sm font-semibold text-[#0b1220] hover:underline"
                >
                  Explore &rarr;
                </Link>
              </article>
            ))}
          </div>
        </section>
      );
    case "cta":
      return (
        <section
          className={`rounded-[2rem] px-8 py-8 text-white ${
            block.tone === "accent" ? "bg-accent" : "bg-foreground"
          }`}
        >
          <h2 className="serif text-3xl font-semibold tracking-tight">{block.title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/78">{block.body}</p>
          <Link
            href={block.action.href}
            style={{ color: "#1247ff" }}
            className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-bold"
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
            <h2 className="serif text-3xl font-semibold tracking-tight">{block.title}</h2>
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
      const orderedInsights = block.ids?.length
        ? block.ids
            .map((id) => allInsights.find((item) => item.translationKey === id) ?? null)
            .filter((item): item is Extract<Page, { type: "insight" }> => Boolean(item))
        : allInsights;
      const limit = block.limit ?? orderedInsights.length;
      const trimmed = block.hero || block.introHeading || block.initialVisible
        ? orderedInsights
        : orderedInsights.slice(0, limit);
      const authors = await Promise.all(
        trimmed.map((item) =>
          getAuthorForInsight({ locale: item.locale, authorId: item.authorId, draft }),
        ),
      );

      const articles = trimmed.map((item, index) => {
        const author = authors[index];
        return {
          id: item.id,
          href: `/${item.locale}/${item.slug.join("/")}`,
          title: item.title,
          summary: item.summary,
          publishedAt: item.publishedAt,
          readTime: item.readTime,
          topics: [...item.topics],
          authorName: author?.title ?? item.authorName ?? "Editorial team",
          authorAvatar: author?.avatarSrc,
          cardImage: item.cardImage,
        };
      });

      return <ArticleListing block={block} locale={locale} articles={articles} />;
    }
    case "form":
      return (
        <Suspense fallback={<LeadFormFallback />}>
          <LeadForm
            locale={locale}
            title={block.title}
            intro={block.intro}
            introText={block.introText}
            submitLabel={block.submitLabel ?? (locale === "en" ? "Submit" : "Enviar")}
            emailLabel={block.emailLabel}
            firstNameLabel={block.firstNameLabel}
            lastNameLabel={block.lastNameLabel}
            jobTitleLabel={block.jobTitleLabel}
            organizationLabel={block.organizationLabel}
            cityLabel={block.cityLabel}
            stateLabel={block.stateLabel}
            phoneLabel={block.phoneLabel}
            messageLabel={block.messageLabel}
            emailPlaceholder={block.emailPlaceholder}
            firstNamePlaceholder={block.firstNamePlaceholder}
            lastNamePlaceholder={block.lastNamePlaceholder}
            jobTitlePlaceholder={block.jobTitlePlaceholder}
            organizationPlaceholder={block.organizationPlaceholder}
            cityPlaceholder={block.cityPlaceholder}
            statePlaceholder={block.statePlaceholder}
            phonePlaceholder={block.phonePlaceholder}
            messagePlaceholder={block.messagePlaceholder}
            successMessage={block.successMessage}
            errorMessage={block.errorMessage}
          />
        </Suspense>
      );
    case "locationsDirectory":
      return <LocationsDirectory block={block} locale={locale} />;
    case "portalApplications":
      return <PortalApplications block={block} locale={locale} />;
    case "payBill":
      return <PayBill block={block} locale={locale} />;
    case "eventsListing":
      return <EventsListing block={block} locale={locale} />;
    default:
      return null;
  }
}