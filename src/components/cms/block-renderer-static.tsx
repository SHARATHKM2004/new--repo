import Link from "next/link";
import Image from "next/image";
import type { Block, Locale } from "@/lib/cms/types";

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

export function HeroBlockView({ block }: { block: Extract<Block, { type: "hero" }> }) {
  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=60"
        alt=""
        fill
        priority
        fetchPriority="high"
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
}

export function RichTextBlockView({ block }: { block: Extract<Block, { type: "richText" }> }) {
  return (
    <section className="panel prose-copy rounded-[2rem] p-8">
      {block.body.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </section>
  );
}

export function HtmlBlockView({ block }: { block: Extract<Block, { type: "html" }> }) {
  return (
    <section className="panel prose-copy rounded-[2rem] p-8">
      <div dangerouslySetInnerHTML={{ __html: block.html }} />
    </section>
  );
}

export function ImageBlockView({ block }: { block: Extract<Block, { type: "image" }> }) {
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
}

export function VideoBlockView({ block }: { block: Extract<Block, { type: "video" }> }) {
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
}

export function StatsBlockView({ block }: { block: Extract<Block, { type: "stats" }> }) {
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
}

export function QuoteBlockView({ block }: { block: Extract<Block, { type: "quote" }> }) {
  return (
    <section className="panel rounded-[2rem] p-8">
      <blockquote className="serif max-w-4xl text-3xl font-semibold leading-tight tracking-tight">
        “{block.quote}”
      </blockquote>
      <p className="mt-6 text-sm font-semibold text-foreground">{block.attribution}</p>
      {block.role ? <p className="mt-1 text-sm text-muted">{block.role}</p> : null}
    </section>
  );
}

export function CardGridBlockView({
  block,
  locale,
}: {
  block: Extract<Block, { type: "cardGrid" }>;
  locale: Locale;
}) {
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
}

export function CtaBlockView({ block }: { block: Extract<Block, { type: "cta" }> }) {
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
}
