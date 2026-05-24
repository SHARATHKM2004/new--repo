"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { EventsListingBlock, Locale } from "@/lib/cms/types";

function resolveHref(href: string, locale: Locale) {
  if (/^https?:\/\//.test(href)) return href;
  if (href.startsWith("/en/") || href.startsWith("/es/")) return href;
  if (href.startsWith("/")) return `/${locale}${href}`;
  return `/${locale}/${href}`;
}

export function EventsListing({
  block,
  locale,
}: {
  block: EventsListingBlock;
  locale: Locale;
}) {
  const initial = Math.max(1, block.initialVisible ?? 6);
  const [visible, setVisible] = useState(initial);

  const events = block.events ?? [];
  const total = events.length;
  const shown = Math.min(visible, total);
  const visibleEvents = events.slice(0, shown);
  const showingTemplate = block.showingTemplate ?? "{shown} of {total}";
  const showingText = showingTemplate
    .replace("{shown}", `1-${shown}`)
    .replace("{total}", `${total}`);
  const learnMoreLabel = block.learnMoreLabel ?? (locale === "es" ? "Mas informacion" : "Learn more");

  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-white">
      {block.hero ? (
        <div className="relative w-full">
          <div className="relative h-[320px] w-full overflow-hidden lg:h-[420px]">
            {block.hero.imageUrl ? (
              <Image
                src={block.hero.imageUrl}
                alt={block.hero.imageAlt ?? ""}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            ) : null}
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="px-6 text-center text-4xl font-light tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] lg:text-6xl">
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
                {block.hero.breadcrumbCurrentLabel ?? (locale === "es" ? "Eventos" : "Events")}
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

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleEvents.map((event, index) => (
            <EventCard
              key={`${event.title}-${index}`}
              event={event}
              locale={locale}
              learnMoreLabel={learnMoreLabel}
            />
          ))}
          {block.callout && shown <= initial ? (
            <CalloutCard callout={block.callout} locale={locale} />
          ) : null}
        </div>

        {total > 0 ? (
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[#e5e7eb] pt-6 sm:flex-row">
            <p className="text-sm text-[#6b7280]">{showingText}</p>
            {shown < total ? (
              <button
                type="button"
                onClick={() => setVisible((current) => Math.min(current + initial, total))}
                className="inline-flex items-center justify-center border border-[#1247ff] px-8 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-[#1247ff] transition hover:bg-[#1247ff] hover:text-white"
              >
                {block.loadMoreLabel ?? (locale === "es" ? "Cargar mas" : "Load more")}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function EventCard({
  event,
  locale,
  learnMoreLabel,
}: {
  event: EventsListingBlock["events"][number];
  locale: Locale;
  learnMoreLabel: string;
}) {
  const href = resolveHref(event.href, locale);
  return (
    <article className="flex h-full flex-col bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <Link href={href} className="block overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.imageUrl}
          alt={event.imageAlt ?? event.title}
          loading="lazy"
          decoding="async"
          className="h-52 w-full object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="text-[13px] text-[#374151]">
          <span>{event.dateLine}</span>
          <span className="mx-2 text-[#c2410c]">|</span>
          <span>{event.typeLabel}</span>
          <span className="mx-2 text-[#c2410c]">|</span>
          <span>{event.costLabel}</span>
        </p>
        <Link
          href={href}
          className="text-[20px] font-semibold leading-snug text-[#1247ff] hover:underline"
        >
          {event.title}
        </Link>
        {event.tags?.length ? (
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#f3f4f6] px-3 py-1 text-[12px] text-[#374151]"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
        <Link
          href={href}
          className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold text-[#0f172a] hover:text-[#1247ff]"
        >
          {learnMoreLabel}
          <span className="text-[#1247ff]">&rarr;</span>
        </Link>
      </div>
    </article>
  );
}

function CalloutCard({
  callout,
  locale,
}: {
  callout: NonNullable<EventsListingBlock["callout"]>;
  locale: Locale;
}) {
  return (
    <aside className="flex h-full flex-col justify-center bg-[#f3f4f6] p-6">
      {callout.eyebrow ? (
        <p className="text-[15px] font-bold uppercase tracking-wide text-[#1247ff]">
          {callout.eyebrow}
        </p>
      ) : null}
      {callout.body ? (
        <p className="mt-3 text-[15px] leading-7 text-[#374151]">{callout.body}</p>
      ) : null}
      {callout.ctaLabel && callout.ctaHref ? (
        <Link
          href={resolveHref(callout.ctaHref, locale)}
          className="mt-5 inline-flex w-fit items-center justify-center border border-[#1247ff] px-6 py-2 text-sm font-semibold uppercase tracking-[0.08em] text-[#1247ff] transition hover:bg-[#1247ff] hover:text-white"
        >
          {callout.ctaLabel}
        </Link>
      ) : null}
    </aside>
  );
}
