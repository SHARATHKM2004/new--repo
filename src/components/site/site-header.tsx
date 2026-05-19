import Link from "next/link";
import type { Locale, NavigationItem, SiteHeaderContent } from "@/lib/cms/types";
import { HeaderSearch } from "./header-search";

const labels = {
  en: {
    title: "Summit Advisory Group",
    tagline: "CMS practice build",
    switchLabel: "ES",
    resourceCenter: "Resource Center",
    contact: "Contact",
  },
  es: {
    title: "Summit Advisory Group",
    tagline: "Proyecto de practica CMS",
    switchLabel: "EN",
    resourceCenter: "Centro de Recursos",
    contact: "Contacto",
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

  // Strip "Contact" from the data-driven nav so we can place it at the end in the required order.
  const contactKeywords = ["contact", "contacto"];
  const primaryNav = navigation.filter(
    (item) => !contactKeywords.includes(item.label.trim().toLowerCase()),
  );

  return (
    <header className="sticky top-0 z-40 border-b border-[#e5e7eb] bg-white">
      <div className="mx-auto flex w-full max-w-[1400px] items-stretch">
        <Link
          href={`/${locale}`}
          className="flex min-w-[180px] items-center justify-center bg-[#1247ff] px-6 py-5 text-center text-base font-bold uppercase leading-tight tracking-wide text-white lg:min-w-[220px] lg:text-lg"
        >
          {brandTitle}
        </Link>

        <div className="flex flex-1 items-center justify-end gap-6 px-6 py-4 lg:px-10">
          <nav className="hidden flex-wrap items-center justify-end gap-x-7 gap-y-2 text-sm font-bold uppercase tracking-wide text-[#1247ff] lg:flex">
            {primaryNav.map((item) => (
              <Link key={item.href} href={item.href} className="hover:underline">
                {item.label}
              </Link>
            ))}
            <Link
              href={`/${locale}/resource-center`}
              className="hover:underline"
            >
              {labels[locale].resourceCenter}
            </Link>
            <Link href={`/${otherLocale}`} className="hover:underline">
              {content.switchLabel ?? labels[locale].switchLabel}
            </Link>
            <Link href={`/${locale}/contact`} className="hover:underline">
              {labels[locale].contact}
            </Link>
          </nav>
          <HeaderSearch locale={locale} />
        </div>
      </div>
    </header>
  );
}