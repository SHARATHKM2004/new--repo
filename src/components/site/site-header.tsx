import Link from "next/link";
import type { Locale, NavigationItem, SiteHeaderContent } from "@/lib/cms/types";

const labels = {
  en: {
    title: "Summit Advisory Group",
    tagline: "CMS practice build",
    switchLabel: "ES",
  },
  es: {
    title: "Summit Advisory Group",
    tagline: "Proyecto de practica CMS",
    switchLabel: "EN",
  },
} as const;

export function SiteHeader({
  locale,
  navigation,
  content,
}: {
  locale: Locale;
  navigation: NavigationItem[];
  content: SiteHeaderContent;
}) {
  const otherLocale = locale === "en" ? "es" : "en";
  const brandTitle = content.title || labels[locale].title;

  return (
    <header className="sticky top-0 z-40 border-b border-[#e5e7eb] bg-white">
      <div className="mx-auto flex w-full max-w-[1400px] items-stretch gap-6">
        <Link
          href={`/${locale}`}
          className="flex min-w-[180px] items-center justify-center bg-[#1247ff] px-6 py-5 text-center text-base font-bold uppercase leading-tight tracking-wide text-white lg:min-w-[220px] lg:text-lg"
        >
          {brandTitle}
        </Link>

        <div className="flex flex-1 flex-col justify-center gap-3 px-6 py-3 lg:px-10">
          <div className="flex flex-wrap items-center justify-end gap-x-6 gap-y-2 text-xs font-medium uppercase tracking-wide text-[#111827]">
            <Link href={`/${locale}/contact`} className="hover:text-[#1247ff]">
              {locale === "en" ? "Contact" : "Contacto"}
            </Link>
            <Link href={`/${locale}/insights`} className="hover:text-[#1247ff]">
              {locale === "en" ? "News" : "Noticias"}
            </Link>
            <Link href={`/${locale}/locations`} className="hover:text-[#1247ff]">
              {locale === "en" ? "Locations" : "Ubicaciones"}
            </Link>
            <Link href={`/${otherLocale}`} className="hover:text-[#1247ff]">
              {content.switchLabel ?? labels[locale].switchLabel}
            </Link>
            <Link href={content.ctaHref} className="hover:text-[#1247ff]">
              {content.ctaLabel}
            </Link>
            <div className="flex items-center gap-2 rounded-sm bg-[#f3f4f6] px-3 py-1.5">
              <input
                type="search"
                placeholder={locale === "en" ? "Search ..." : "Buscar ..."}
                className="w-40 bg-transparent text-xs text-[#111827] placeholder:text-[#6b7280] focus:outline-none"
                aria-label={locale === "en" ? "Search" : "Buscar"}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#6b7280]"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
          </div>

          <nav className="hidden items-center justify-end gap-8 text-sm font-bold uppercase tracking-wide text-[#1247ff] lg:flex">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="hover:underline">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}