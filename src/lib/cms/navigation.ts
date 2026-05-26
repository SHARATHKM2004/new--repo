import type { Locale, NavigationGroup, NavigationItem, SiteHeaderContent } from "@/lib/cms/types";
import { fetchOptimizelyGraph } from "./optimizely-graph";
import { getOptimizelyTag, isOptimizelyProviderEnabled } from "./optimizely-config";
import { toArray } from "./text-helpers";
import type { OptimizelyFooterItem, OptimizelyHeaderItem } from "./optimizely-types";


export async function getOptimizelyHeader(locale: Locale, draft = false) {
  const data = await fetchOptimizelyGraph<{
    Header: {
      item: OptimizelyHeaderItem | null;
    };
  }>(
    `query {
      Header(limit: 1, locale: ${locale}) {
        item {
          logo
          ctaText
          ctaHref
          _json
        }
      }
    }`,
    {
      draft,
      tags: [getOptimizelyTag("chrome", locale), getOptimizelyTag("header", locale)],
    },
  );

  return data?.Header?.item ?? null;
}

export async function getOptimizelyFooter(locale: Locale, draft = false) {
  const data = await fetchOptimizelyGraph<{
    Footer: {
      item: OptimizelyFooterItem | null;
    };
  }>(
    `query {
      Footer(limit: 1, locale: ${locale}) {
        item {
          copyrightText
          _json
        }
      }
    }`,
    {
      draft,
      tags: [getOptimizelyTag("chrome", locale), getOptimizelyTag("footer", locale)],
    },
  );

  return data?.Footer?.item ?? null;
}

export async function getNavigation(locale: Locale, draft = false): Promise<NavigationItem[]> {
  const dictionary = {
    en: {
      services: "Services",
      industries: "Industries",
      insights: "Insights",
      article: "Article",
      contact: "Contact",
    },
    es: {
      services: "Servicios",
      industries: "Industrias",
      insights: "Recursos",
      article: "Articulo",
      contact: "Contacto",
    },
  } as const;

  if (isOptimizelyProviderEnabled()) {
    const header = await getOptimizelyHeader(locale, draft);
    const liveItems = toArray(header?._json?.navItems)
      .map((item) => {
        const label = item.label?.trim();
        const href = item.href?.trim();

        if (!label || !href) {
          return null;
        }

        type RawGroup = {
          title?: string;
          Title?: string;
          links?: Array<{ label?: string; href?: string; Label?: string; Href?: string }>;
          Links?: Array<{ label?: string; href?: string; Label?: string; Href?: string }>;
          subgroups?: Array<RawGroup>;
          Subgroups?: Array<RawGroup>;
        };

        const pickLinks = (raw: RawGroup) => {
          const list = toArray(raw.links ?? raw.Links);
          return list
            .map((link) => {
              const linkLabel = (link.label ?? link.Label)?.trim();
              const linkHref = (link.href ?? link.Href)?.trim();
              if (!linkLabel || !linkHref) return null;
              return { label: linkLabel, href: linkHref };
            })
            .filter((link): link is { label: string; href: string } => Boolean(link));
        };

        const rawGroups = toArray((item as { groups?: RawGroup[]; Groups?: RawGroup[] }).groups
          ?? (item as { Groups?: RawGroup[] }).Groups);

        const groups = rawGroups
          .map((group) => {
            const title = (group.title ?? group.Title)?.trim();
            const links = pickLinks(group);

            const subgroups = toArray(group.subgroups ?? group.Subgroups)
              .map((sub) => {
                const subTitle = (sub.title ?? sub.Title)?.trim();
                const subLinks = pickLinks(sub);
                if (subLinks.length === 0) return null;
                return { title: subTitle ?? "", links: subLinks };
              })
              .filter((sub): sub is { title: string; links: Array<{ label: string; href: string }> } => Boolean(sub));

            if (links.length === 0 && subgroups.length === 0 && !title) return null;
            const groupResult: NavigationGroup = { title: title ?? "", links };
            if (subgroups.length > 0) groupResult.subgroups = subgroups;
            return groupResult;
          })
          .filter((group): group is NavigationGroup => Boolean(group));

        return groups.length ? { label, href, groups } : { label, href };
      })
      .filter((item): item is NavigationItem => Boolean(item));

    if (liveItems.length) {
      return liveItems;
    }
  }

  return [
    {
      label: dictionary[locale].services,
      href: `/${locale}/services/digital-platform-strategy`,
    },
    {
      label: dictionary[locale].industries,
      href: `/${locale}/industries/healthcare-financial-resilience`,
    },
    {
      label: locale === "es" ? "Soluciones de Software" : "Software Solutions",
      href: `/${locale}/software-solutions`,
    },
    {
      label: dictionary[locale].insights,
      href: `/${locale}/resource-center`,
    },
    {
      label: dictionary[locale].article,
      href: `/${locale}/article`,
    },
    {
      label: dictionary[locale].contact,
      href: `/${locale}/contact`,
    },
  ];
}

export async function getSiteHeaderContent(
  locale: Locale,
  draft = false,
): Promise<SiteHeaderContent> {
  const dictionary = {
    en: {
      title: "Summit Advisory Group",
      tagline: "CMS practice build",
      switchLabel: "ES",
      ctaLabel: "Talk to us",
      ctaHref: `/${locale}/contact`,
    },
    es: {
      title: "Summit Advisory Group",
      tagline: "Proyecto de practica CMS",
      switchLabel: "EN",
      ctaLabel: "Contactar",
      ctaHref: `/${locale}/contact`,
    },
  } as const;

  if (!isOptimizelyProviderEnabled()) {
    return dictionary[locale];
  }

  const header = await getOptimizelyHeader(locale, draft);

  return {
    title:
      header?._json?.title?.trim() ||
      header?.logo?.trim() ||
      header?._json?.logo?.trim() ||
      dictionary[locale].title,
    tagline: header?._json?.tagline?.trim() || dictionary[locale].tagline,
    switchLabel:
      header?._json?.switchLabel?.trim() ||
      header?._json?.localeSwitcherLabel?.trim() ||
      dictionary[locale].switchLabel,
    ctaLabel: header?.ctaText?.trim() || header?._json?.ctaText?.trim() || dictionary[locale].ctaLabel,
    ctaHref: header?.ctaHref?.trim() || header?._json?.ctaHref?.trim() || dictionary[locale].ctaHref,
  };
}
