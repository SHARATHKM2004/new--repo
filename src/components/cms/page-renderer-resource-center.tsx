import Link from "next/link";
import { getInsights } from "@/lib/cms";
import type { Locale } from "@/lib/cms/types";

export function ResourceCenterToolbar({ locale }: { locale: Locale }) {
  const serviceOptions = [
    { value: "", label: locale === "en" ? "All services" : "Todos los servicios" },
    { value: "service-platform", label: "Digital platform strategy" },
    { value: "service-risk", label: "Enterprise risk operations" },
  ];
  const industryOptions = [
    { value: "", label: locale === "en" ? "All industries" : "Todas las industrias" },
    { value: "industry-healthcare", label: "Healthcare" },
  ];
  const topicOptions = [
    { value: "", label: locale === "en" ? "All topics" : "Todos los temas" },
    { value: "Preview", label: "Preview" },
    { value: "Healthcare", label: "Healthcare" },
    { value: "Taxonomy", label: "Taxonomy" },
  ];

  return (
    <form className="panel grid gap-4 rounded-[2rem] p-6 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]">
      <input
        name="q"
        placeholder={locale === "en" ? "Search insights" : "Buscar articulos"}
        className="rounded-full border border-border bg-white/75 px-4 py-3 outline-none transition focus:border-accent"
      />
      <select
        name="service"
        className="rounded-full border border-border bg-white/75 px-4 py-3 outline-none transition focus:border-accent"
        defaultValue=""
      >
        {serviceOptions.map((option) => (
          <option key={option.value || "all-services"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <select
        name="industry"
        className="rounded-full border border-border bg-white/75 px-4 py-3 outline-none transition focus:border-accent"
        defaultValue=""
      >
        {industryOptions.map((option) => (
          <option key={option.value || "all-industries"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <select
        name="topic"
        className="rounded-full border border-border bg-white/75 px-4 py-3 outline-none transition focus:border-accent"
        defaultValue=""
      >
        {topicOptions.map((option) => (
          <option key={option.value || "all-topics"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white">
        {locale === "en" ? "Filter" : "Filtrar"}
      </button>
    </form>
  );
}

export function ResourceCenterResultsSkeleton() {
  return (
    <section className="bg-[#f3f4f6] -mx-6 px-6 py-12 lg:-mx-10 lg:px-10 lg:py-16">
      <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <article key={`resource-skeleton-${index}`} className="flex flex-col border-t-2 border-[#1554ff] pt-5">
            <div className="h-7 w-3/4 animate-pulse bg-[#dbe7ff]" />
            <div className="mt-4 h-20 animate-pulse bg-[#e5e7eb]" />
            <div className="mt-4 h-4 w-1/2 animate-pulse bg-[#d1d5db]" />
          </article>
        ))}
      </div>
    </section>
  );
}

export async function ResourceCenterResults({
  locale,
  draft,
  filters,
}: {
  locale: Locale;
  draft: boolean;
  filters: {
    q?: string;
    topic?: string;
    service?: string;
    industry?: string;
  };
}) {
  const resourceItems = await getInsights({
    locale,
    draft,
    query: filters.q,
    topic: filters.topic,
    service: filters.service,
    industry: filters.industry,
  });

  return (
    <section className="bg-[#f3f4f6] -mx-6 px-6 py-12 lg:-mx-10 lg:px-10 lg:py-16">
      <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {resourceItems.length ? (
          resourceItems.map((item) => (
            <article
              key={item.id}
              className="flex flex-col border-t-2 border-[#1554ff] pt-5"
            >
              <h2 className="text-2xl font-semibold leading-tight text-[#1554ff]">
                <Link href={`/${locale}/${item.slug.join("/")}`} className="hover:underline">
                  {item.title}
                </Link>
              </h2>
              <p className="mt-4 text-[15px] leading-7 text-[#1f2937]">{item.summary}</p>
              <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#4b5563]">
                <span>{item.readTime}</span>
                <span>â€¢</span>
                <span>{item.publishedAt}</span>
              </div>
            </article>
          ))
        ) : (
          <div className="border-t-2 border-[#1554ff] pt-5 lg:col-span-3">
            <h2 className="text-2xl font-semibold leading-tight text-[#1554ff]">
              {locale === "en" ? "No results matched your filters." : "No hay resultados para esos filtros."}
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-[#1f2937]">
              {locale === "en"
                ? "Clear one of the filters or add more insight content to the mock provider."
                : "Limpie un filtro o agregue mas contenido al proveedor mock."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

