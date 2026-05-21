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
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const brandTitle = content.title || labels[locale].title;

  const secondaryNavKeywords = [
    "industries",
    "industrias",
    "services",
    "servicios",
    "software solutions",
    "about",
    "resource center",
    "resource hub",
    "recursos",
    "events",
    "careers",
  ];
  const panelNavKeywords = ["software solutions", "about", "careers", "insights", "eventos", "events"];
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
  const resourceCenterItem =
    findNavByKeywords(["resource center", "resource hub", "insights", "recursos"]) ??
    ({ label: labels[locale].resourceCenter, href: `/${locale}/resource-center` } as NavigationItem);
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
    resourceCenterItem,
    eventsItem,
    careersItem,
  ];

  // Strip "Contact" from the data-driven nav so we can place it at the end in the required order.
  const contactKeywords = ["contact", "contacto"];
  const primaryNav = navigation.filter((item) => {
    const normalized = item.label.trim().toLowerCase();
    return (
      !contactKeywords.includes(normalized) &&
      !secondaryNavKeywords.includes(normalized) &&
      !topRowExcludedKeywords.includes(normalized)
    );
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
      <div className="mx-auto flex w-full max-w-[1400px] items-stretch">
        <Link
          href={`/${locale}`}
          className="flex min-w-[180px] items-center justify-center bg-[#1247ff] px-6 py-5 text-center text-base font-bold uppercase leading-tight tracking-wide text-white lg:min-w-[220px] lg:text-lg"
        >
          {brandTitle}
        </Link>

        <div className="flex flex-1 flex-col justify-center px-6 py-3 lg:px-10">
          <div className="flex items-center justify-end gap-6">
            <nav className="hidden flex-nowrap items-center justify-end gap-x-5 text-[12px] font-medium uppercase tracking-wide text-[#0f172a] lg:flex">
              {primaryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setActivePanel(null)}
                  className="text-[#101828] underline-offset-4 hover:underline hover:decoration-2"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={`/${locale}/contact`}
                onClick={() => setActivePanel(null)}
                className="text-[#101828] underline-offset-4 hover:underline hover:decoration-2"
              >
                {labels[locale].contact}
              </Link>
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
                      className="px-2 py-1 text-[#1247ff] hover:bg-[#1247ff] hover:text-white"
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