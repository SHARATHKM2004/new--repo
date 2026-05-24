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
  const panelNavKeywords = [
    "industries",
    "industrias",
    "services",
    "servicios",
    "software solutions",
    "about",
    "careers",
    "eventos",
    "events",
  ];
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

  const industriesFallbackGroups = [
    {
      title: locale === "es" ? "Industrias" : "Industries",
      links: [
        { label: "Construction", href: `/${locale}/industries/construction` },
        { label: "Consumer products", href: `/${locale}/industries/consumer-products` },
        { label: "Distribution", href: `/${locale}/industries/distribution` },
        { label: "Education", href: `/${locale}/industries/education` },
      ],
    },
    {
      title: " ",
      links: [
        { label: "Governments", href: `/${locale}/industries/governments` },
        { label: "Healthcare", href: `/${locale}/industries/healthcare-financial-resilience` },
        { label: "Financial services", href: `/${locale}/industries/financial-services` },
        { label: "Insurance", href: `/${locale}/industries/insurance` },
      ],
    },
    {
      title: " ",
      links: [
        { label: "Nonprofits", href: `/${locale}/industries/nonprofits` },
        { label: "Manufacturing", href: `/${locale}/industries/manufacturing` },
        { label: "Private equity", href: `/${locale}/industries/private-equity` },
        { label: "Real estate", href: `/${locale}/industries/real-estate` },
      ],
    },
    {
      title: " ",
      links: [
        { label: "Retail", href: `/${locale}/industries/retail` },
        { label: "Technology", href: `/${locale}/industries/technology` },
        { label: "Tribal gaming and government", href: `/${locale}/industries/tribal-gaming-government` },
      ],
    },
  ];

  const servicesFallbackGroups = [
    {
      title: "Assurance",
      links: [
        { label: "Accounting services", href: `/${locale}/services/accounting` },
        { label: "Audit and assurance", href: `/${locale}/services/audit-assurance` },
      ],
    },
    {
      title: "Performance management",
      links: [
        { label: "Leadership development", href: `/${locale}/services/leadership-development` },
        { label: "Strategy and operations", href: `/${locale}/services/digital-platform-strategy` },
      ],
    },
    {
      title: "Business outsourcing",
      links: [
        { label: "Finance and accounting", href: `/${locale}/services/finance-accounting` },
        { label: "Human resources", href: `/${locale}/services/human-resources` },
        { label: "Technology", href: `/${locale}/services/technology` },
        { label: "Operations", href: `/${locale}/services/operations` },
        { label: "C-suite", href: `/${locale}/services/c-suite` },
      ],
    },
    {
      title: "Private client services",
      links: [
        { label: "Estate and tax planning", href: `/${locale}/services/estate-tax-planning` },
        { label: "Business transition strategy", href: `/${locale}/services/business-transition` },
        { label: "Wealth management and investment advisory services", href: `/${locale}/services/wealth-management` },
      ],
    },
    {
      title: "Risk advisory",
      links: [
        { label: "ESG services", href: `/${locale}/services/esg` },
        { label: "Forensic advisory", href: `/${locale}/services/forensic-advisory` },
        { label: "Fraud investigation and litigation support", href: `/${locale}/services/fraud-litigation` },
        { label: "Governance risk and controls", href: `/${locale}/services/governance-risk` },
        { label: "Internal controls", href: `/${locale}/services/internal-controls` },
        { label: "Marketing compliance", href: `/${locale}/services/marketing-compliance` },
        { label: "Operational risk", href: `/${locale}/services/operational-risk` },
        { label: "Regulatory and compliance", href: `/${locale}/services/regulatory-compliance` },
        { label: "Technology", href: `/${locale}/services/risk-technology` },
      ],
    },
    {
      title: "Tax",
      links: [
        { label: "Credits and incentives", href: `/${locale}/services/credits-incentives` },
        { label: "Individual tax", href: `/${locale}/services/individual-tax` },
        { label: "International expansion", href: `/${locale}/services/international-expansion` },
        { label: "International tax", href: `/${locale}/services/international-tax` },
        { label: "Strategic tax services", href: `/${locale}/services/strategic-tax` },
        { label: "State and local tax services", href: `/${locale}/services/state-local-tax` },
      ],
    },
    {
      title: "Transaction advisory",
      links: [
        { label: "Buy-side", href: `/${locale}/services/buy-side` },
        { label: "Sell-side", href: `/${locale}/services/sell-side` },
        { label: "Investment banking", href: `/${locale}/services/investment-banking` },
        { label: "Valuation services", href: `/${locale}/services/valuation` },
      ],
    },
    {
      title: "Technology consulting",
      links: [
        { label: "AI services", href: `/${locale}/services/ai` },
        { label: "Cybersecurity", href: `/${locale}/services/cybersecurity` },
        { label: "Data & analytics", href: `/${locale}/services/data-analytics` },
        { label: "Digital strategy", href: `/${locale}/services/digital-platform-strategy` },
        { label: "Enterprise solutions", href: `/${locale}/services/enterprise-solutions` },
        { label: "iPaaS solutions", href: `/${locale}/services/ipaas` },
        { label: "Application modernization", href: `/${locale}/services/application-modernization` },
        { label: "Managed services", href: `/${locale}/services/managed-services` },
        { label: "Alliances", href: `/${locale}/services/alliances` },
        { label: "Software solutions", href: `/${locale}/software-solutions` },
      ],
    },
  ];

  if (!industriesItem.groups || industriesItem.groups.length === 0) {
    industriesItem.groups = industriesFallbackGroups;
  }
  if (!servicesItem.groups || servicesItem.groups.length === 0) {
    servicesItem.groups = servicesFallbackGroups;
  }
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
          <div className="mx-auto w-full max-w-[1400px] px-10 py-10">
            {(() => {
              const activeItem = secondaryNav.find(
                (item) => item.label.trim().toLowerCase() === activePanel,
              );
              const groups = activeItem?.groups ?? [];

              if (groups.length > 0) {
                return (
                  <div className="grid grid-cols-2 gap-x-10 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
                    {groups.map((group) => (
                      <div key={group.title} className="space-y-3">
                        <h3 className="text-[18px] font-semibold text-[#4f84ff]">
                          {group.title}
                        </h3>
                        <ul className="space-y-2">
                          {group.links.map((link) => (
                            <li key={`${group.title}-${link.href}`}>
                              <Link
                                href={link.href}
                                onClick={() => setActivePanel(null)}
                                className="block text-[14px] leading-snug text-white/85 hover:text-white hover:underline"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-4 gap-10">
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
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block text-[17px] text-[#4f84ff] hover:underline"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {quickLinks.slice(2, 4).map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block text-[17px] text-[#4f84ff] hover:underline"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {quickLinks.slice(4, 6).map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block text-[17px] text-[#4f84ff] hover:underline"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      ) : null}
    </header>
  );
}