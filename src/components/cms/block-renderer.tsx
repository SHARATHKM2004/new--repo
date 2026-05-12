import Link from "next/link";
import { LeadForm } from "@/components/forms/lead-form";
import { getFeaturedContent } from "@/lib/cms";
import type { Block, Locale, Page } from "@/lib/cms/types";

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
        <section className="panel rounded-[2.25rem] px-6 py-10 lg:px-10 lg:py-14">
          <p className="eyebrow text-xs font-semibold">{block.eyebrow}</p>
          <h1 className="serif mt-4 max-w-4xl text-5xl font-semibold tracking-tight text-balance lg:text-7xl">
            {block.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">{block.intro}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {block.primaryCta ? (
              <Link
                href={block.primaryCta.href}
                className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong"
              >
                {block.primaryCta.label}
              </Link>
            ) : null}
            {block.secondaryCta ? (
              <Link
                href={block.secondaryCta.href}
                className="rounded-full border border-border px-5 py-3 text-sm font-semibold transition hover:border-accent hover:text-accent"
              >
                {block.secondaryCta.label}
              </Link>
            ) : null}
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
        <section className="space-y-6">
          <div>
            <h2 className="serif text-3xl font-semibold tracking-tight">{block.title}</h2>
            {block.intro ? <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">{block.intro}</p> : null}
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {block.cards.map((card) => (
              <article key={card.title} className="panel rounded-[1.75rem] p-6">
                {card.eyebrow ? <p className="eyebrow text-[11px] font-semibold">{card.eyebrow}</p> : null}
                <h3 className="mt-3 text-2xl font-semibold tracking-tight">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{card.body}</p>
                <Link href={card.href} className="mt-5 inline-flex text-sm font-semibold text-accent">
                  Explore
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
            className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-foreground"
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
    case "form":
      return (
        <LeadForm
          locale={locale}
          title={block.title}
          intro={block.intro}
          submitLabel={block.submitLabel ?? (locale === "en" ? "Submit" : "Enviar")}
        />
      );
    default:
      return null;
  }
}