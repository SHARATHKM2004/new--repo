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

export function EventsListing({
  block,
  locale,
}: {
  block: EventsListingBlock;
  locale: Locale;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-unsanitized/method
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://web.bigmarker.com/conferences/7953291e9866/widget/live.js?width=720&height=405&full_experience=false";
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
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
        <div className="flex justify-center">
          <iframe
            id="bigmarker_embed_conference_room_7953291e9866"
            title="BigMarker Live Event"
            width={720}
            height={405}
            allowFullScreen
            style={{ border: 0 }}
            className="max-w-full"
          />
        </div>
      </div>
    </section>
  );
}
