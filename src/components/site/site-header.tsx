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

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-[rgba(246,241,232,0.82)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-10">
        <div className="flex flex-col">
          <Link href={`/${locale}`} className="text-lg font-semibold tracking-tight">
            {content.title}
          </Link>
          <span className="text-sm text-muted">{content.tagline ?? labels[locale].tagline}</span>
        </div>
        <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-accent">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href={`/${otherLocale}`}
            className="rounded-full border border-border px-4 py-2 text-sm font-semibold transition hover:border-accent hover:text-accent"
          >
            {labels[locale].switchLabel}
          </Link>
          <Link
            href={content.ctaHref}
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-strong"
          >
            {content.ctaLabel}
          </Link>
        </div>
      </div>
    </header>
  );
}