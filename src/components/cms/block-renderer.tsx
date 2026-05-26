import { Suspense, lazy } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { getAuthorForInsight, getFeaturedContent, getInsights } from "@/lib/cms";
import type { Block, Locale, Page } from "@/lib/cms/types";
import {
  CardGridBlockView,
  CtaBlockView,
  HeroBlockView,
  HtmlBlockView,
  ImageBlockView,
  QuoteBlockView,
  RichTextBlockView,
  StatsBlockView,
  VideoBlockView,
} from "@/components/cms/block-renderer-static";

// Lazy-load heavy interactive / route-specific blocks for code splitting.
const LocationsDirectory = dynamic(() =>
  import("@/components/cms/locations-directory").then((m) => m.LocationsDirectory),
);
const PortalApplications = dynamic(() =>
  import("@/components/cms/portal-applications").then((m) => m.PortalApplications),
);
const PayBill = dynamic(() => import("@/components/cms/pay-bill").then((m) => m.PayBill));
const SignIn = dynamic(() => import("@/components/cms/sign-in").then((m) => m.SignIn));
const EventsListing = dynamic(() =>
  import("@/components/cms/events-listing").then((m) => m.EventsListing),
);
const ArticleListing = dynamic(() =>
  import("@/components/cms/article-listing").then((m) => m.ArticleListing),
);

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
      return <HeroBlockView block={block} />;
    case "richText":
      return <RichTextBlockView block={block} />;
    case "html":
      return <HtmlBlockView block={block} />;
    case "image":
      return <ImageBlockView block={block} />;
    case "video":
      return <VideoBlockView block={block} />;
    case "stats":
      return <StatsBlockView block={block} />;
    case "quote":
      return <QuoteBlockView block={block} />;
    case "cardGrid":
      return <CardGridBlockView block={block} locale={locale} />;
    case "cta":
      return <CtaBlockView block={block} />;
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
            uploadLabel={block.uploadLabel}
            stateAsDropdown={block.stateAsDropdown}
          />
        </Suspense>
      );
    case "locationsDirectory":
      return <LocationsDirectory block={block} locale={locale} />;
    case "portalApplications":
      return <PortalApplications block={block} locale={locale} />;
    case "payBill":
      return <PayBill block={block} locale={locale} />;
    case "signIn":
      return <SignIn block={block} locale={locale} />;
    case "eventsListing":
      return <EventsListing block={block} locale={locale} />;
    default:
      return null;
  }
}
