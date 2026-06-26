"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import type { EventsListingBlock, Locale } from "@/lib/cms/types";

function resolveHref(href: string, locale: Locale) {
  if (/^https?:\/\//.test(href)) return href;
  if (href.startsWith("/en/") || href.startsWith("/es/")) return href;
  if (href.startsWith("/")) return `/${locale}${href}`;
  return `/${locale}/${href}`;
}

const BM_WIDGET_SRC =
  "https://web.bigmarker.com/widget/register_channel_widget.js?club=wipfli&widget_type=manually_ist&upcoming_sub_title=&conference_1=6d29d0aa4615&conference_2=ed7a73f3d7f1&conference_3=60e5c9e6e0ee&background_color=ffffff&btext_color=4c586e&link_color=1089f5&ltext_color=ffffff&show_public_webinar=false&widget_width=&widget_height=&enable_iframe=true&cid=cec48b5ceb5c";

export function EventsListing({
  block,
  locale,
}: {
  block: EventsListingBlock;
  locale: Locale;
}) {
  useEffect(() => {
    const existing = document.querySelector(`script[src="${BM_WIDGET_SRC}"]`);
    if (existing) return;
    const script = document.createElement("script");
    script.src = BM_WIDGET_SRC;
    document.body.appendChild(script);
    return () => { script.remove(); };
  }, []);

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
        <div
          id="bigmarker-channel-widget-containerwipfli"
          style={{ width: "100%" }}
          className="[&_iframe]:!w-full [&_iframe]:!min-h-[600px] [&_iframe]:block"
        />
      </div>
    </section>
  );
}
