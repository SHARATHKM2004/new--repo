import Link from "next/link";
import { NewsListing } from "@/components/cms/news-listing";
import { NewsSidebar } from "@/components/cms/news-sidebar";
import { getInsights } from "@/lib/cms";
import type { Block, Locale, Page } from "@/lib/cms/types";

export async function NewsLandingView({
  page,
  locale,
  draft,
  renderedSections,
}: {
  page: Page;
  locale: Locale;
  draft: boolean;
  renderedSections: Block[];
}) {
    const heroBlock = renderedSections.find(
      (block): block is Extract<Block, { type: "hero" }> => block.type === "hero",
    );
    const sidebarBlocks = renderedSections.filter(
      (block): block is Extract<Block, { type: "richText" | "html" | "cta" }> =>
        block.type === "richText" || block.type === "html" || block.type === "cta",
    );
    const newsItems = await getInsights({ locale, draft });

    return (
      <main className="flex-1 bg-white">
        <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
          <div className="relative h-[360px] w-full overflow-hidden bg-[#1f2937] lg:h-[420px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1800&q=70"
              alt={heroBlock?.title ?? page.title}
              className="absolute inset-0 h-full w-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-black/25" aria-hidden />
            <div className="relative z-10 mx-auto flex h-full max-w-[1260px] items-center px-6 lg:px-10">
              <h1 className="text-[3.6rem] font-light tracking-tight text-white lg:text-[4.2rem]">
                {heroBlock?.title ?? page.title}
              </h1>
            </div>
          </div>
          <div className="bg-[#4b5563]">
            <div className="mx-auto max-w-[1260px] px-6 py-3 text-sm text-white lg:px-10">
              <Link href={`/${locale}`} className="hover:underline">
                {locale === "en" ? "Home" : "Inicio"}
              </Link>
              <span className="px-2">|</span>
              <span>{locale === "en" ? "News" : "Noticias"}</span>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1260px] px-6 py-10 lg:px-10 lg:py-14">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div>
              <NewsListing
                locale={locale}
                items={newsItems.map((it) => ({
                  id: it.id,
                  slug: it.slug,
                  title: it.title,
                  publishedAt: it.publishedAt,
                  industries: it.relatedIndustryIds ?? [],
                }))}
              />
            </div>

            <aside className="space-y-8">
              {sidebarBlocks.length ? (
                <NewsSidebar locale={locale} blocks={sidebarBlocks} />
              ) : (
                <div className="bg-[#f3f4f6] p-6 text-sm leading-7 text-[#4b5563]">
                  {locale === "en"
                    ? "Add Rich Text blocks to the News page in CMS to fill this sidebar (e.g. External News, Contact us)."
                    : "Agregue bloques de texto enriquecido a la pagina News en el CMS para llenar esta barra lateral."}
                </div>
              )}
            </aside>
          </div>
        </section>
      </main>
    );
}
