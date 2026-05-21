"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Locale, NavigationItem, SiteHeaderContent } from "@/lib/cms/types";
import { HeaderSearch } from "./header-search";

const labels = {
  en: {
    title: "Summit Advisory Group",
    tagline: "CMS practice build",
    switchLabel: "ES",
    resourceCenter: "Resource Center",
  },
  es: {
    title: "Summit Advisory Group",
    tagline: "Proyecto de practica CMS",
    switchLabel: "EN",
    resourceCenter: "Centro de Recursos",
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
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const brandTitle = content.title || labels[locale].title;

  const secondaryNavKeywords = [
    "industries",
    "industrias",
    "services",
    "servicios",
    "software solutions",
    "about",
    "article",
    "articulo",
    "events",
    "careers",
  ];
  const panelNavKeywords = ["software solutions", "about", "careers", "eventos", "events"];
  const topRowExcludedKeywords = ["insights", "recursos", ...secondaryNavKeywords];

  function findNavByKeywords(keywords: string[]) {
    return navigation.find((item) => keywords.includes(item.label.trim().toLowerCase()));
  }

  const industriesItem =
    findNavByKeywords(["industries", "industrias"]) ??
    ({ label: locale === "es" ? "Industrias" : "Industries", href: `/${locale}/industries/healthcare-financial-resilience` } as NavigationItem);
  const servicesItem =
    findNavByKeywords(["services", "servicios"]) ??
    ({ label: locale === "es" ? "Servicios" : "Services", href: `/${locale}/services/digital-platform-strategy` } as NavigationItem);
  const softwareSolutionsItem =
    findNavByKeywords(["software solutions"]) ??
    ({ label: "Software Solutions", href: `/${locale}/software-solutions` } as NavigationItem);
  const aboutItem =
    findNavByKeywords(["about"]) ??
    ({ label: "About", href: `/${locale}/about` } as NavigationItem);
  const articleItem =
    findNavByKeywords(["article", "articulo"]) ??
    ({ label: "Article", href: `/${locale}/article` } as NavigationItem);
  const eventsItem =
    findNavByKeywords(["events"]) ??
    ({ label: "Events", href: `/${locale}/events` } as NavigationItem);
  const careersItem =
    findNavByKeywords(["careers"]) ??
    ({ label: "Careers", href: `/${locale}/careers` } as NavigationItem);

  const secondaryNav: NavigationItem[] = [
    industriesItem,
    servicesItem,
    softwareSolutionsItem,
    aboutItem,
    articleItem,
    eventsItem,
    careersItem,
  ];

  const primaryNav = navigation.filter((item) => {
    const normalized = item.label.trim().toLowerCase();
    return !secondaryNavKeywords.includes(normalized) && !topRowExcludedKeywords.includes(normalized);
  });

  const quickLinks = useMemo(
    () =>
      primaryNav
        .slice(0, 6)
        .map((item) => ({ label: item.label, href: item.href })),
    [primaryNav],
  );

  return (
    <header className="sticky top-0 z-40 border-b border-[#e5e7eb] bg-white">
      <div className="flex w-full items-stretch">
        <Link
          href={`/${locale}`}
          className="my-3 ml-0 flex shrink-0 self-center whitespace-nowrap items-center justify-center bg-[#1247ff] px-6 py-4 text-center text-sm font-bold uppercase leading-tight tracking-wide !text-white lg:text-base"
        >
          <span className="!text-white">{brandTitle}</span>
        </Link>

        <div className="flex flex-1">
          <div className="mx-auto flex w-full max-w-[1400px] flex-col justify-center px-6 py-3 lg:px-10">
            <div className="flex items-center justify-end gap-6">
            <nav className="hidden flex-nowrap items-center justify-end gap-x-5 text-[12px] font-medium uppercase tracking-wide text-[#0f172a] lg:flex">
              {primaryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setActivePanel(null)}
                  className="relative pb-1 text-[#101828] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[#101828] after:transition-transform after:duration-200 after:content-[''] hover:after:scale-x-100 focus-visible:after:scale-x-100"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <HeaderSearch locale={locale} />
            </div>

            {secondaryNav.length ? (
              <nav className="mt-3 hidden items-center justify-end gap-x-8 text-[13px] font-semibold uppercase tracking-wide text-[#1247ff] lg:flex">
                {secondaryNav.map((item) => {
                  const normalized = item.label.trim().toLowerCase();
                  const isPanelItem = panelNavKeywords.includes(normalized);
                  const isActive = activePanel === normalized;

                  if (!isPanelItem) {
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setActivePanel(null)}
                        className="px-2 py-1 text-[#1247ff] hover:bg-[#1247ff] hover:!text-white focus:bg-[#1247ff] focus:!text-white"
                      >
                        {item.label}
                      </Link>
                    );
                  }

                  return (
                    <button
                      key={item.href}
                      type="button"
                      onClick={() => {
                        if (isActive) {
                          setActivePanel(null);
                          return;
                        }

                        setActivePanel(normalized);
                      }}
                      className={`px-2 py-1 ${isActive ? "bg-[#1247ff] text-white" : "text-[#1247ff] hover:bg-[#1247ff] hover:text-white"}`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            ) : null}
          </div>
        </div>
      </div>

      {activePanel ? (
        <div className="hidden border-t border-[#1247ff] bg-[#242933] text-white lg:block">
          <div className="mx-auto grid w-full max-w-[1400px] grid-cols-4 gap-10 px-10 py-9">
            <div>
              <h3 className="text-[32px] font-semibold uppercase tracking-wide text-white/90">
                {activePanel}
              </h3>
              <p className="mt-2 text-sm text-white/70">
                Explore available links for this section.
              </p>
            </div>
            <div className="space-y-3">
              {quickLinks.slice(0, 2).map((item) => (
                <Link key={item.href} href={item.href} className="block text-[17px] text-[#4f84ff] hover:underline">
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="space-y-3">
              {quickLinks.slice(2, 4).map((item) => (
                <Link key={item.href} href={item.href} className="block text-[17px] text-[#4f84ff] hover:underline">
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="space-y-3">
              {quickLinks.slice(4, 6).map((item) => (
                <Link key={item.href} href={item.href} className="block text-[17px] text-[#4f84ff] hover:underline">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}