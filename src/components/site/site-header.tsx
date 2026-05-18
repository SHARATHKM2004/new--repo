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
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-6 px-6 py-4 lg:px-10">
        <div className="flex flex-col">
          <Link href={`/${locale}`} className="text-lg font-semibold tracking-tight text-foreground">
            {content.title}
          </Link>
          <span className="text-xs font-medium text-muted">{content.tagline ?? labels[locale].tagline}</span>
        </div>
        <nav className="hidden items-center gap-7 text-[13px] font-medium text-foreground lg:flex">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-accent">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href={`/${otherLocale}`}
            className="rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold text-foreground transition hover:border-accent hover:text-accent"
          >
            {content.switchLabel ?? labels[locale].switchLabel}
          </Link>
          <Link
            href={content.ctaHref}
            className="rounded-full bg-accent-warm px-5 py-2 text-xs font-semibold text-white transition hover:opacity-90"
          >
            {content.ctaLabel}
          </Link>
        </div>
      </div>
    </header>
  );
}