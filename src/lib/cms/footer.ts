import type { Locale, SiteFooterContent } from "@/lib/cms/types";
import { fetchOptimizelyGraph } from "./optimizely-graph";
import { isOptimizelyProviderEnabled } from "./optimizely-config";
import { getRichTextValue, toArray } from "./text-helpers";
import { getOptimizelyFooter } from "./navigation";


export async function getSiteFooterContent(
  locale: Locale,
  draft = false,
): Promise<SiteFooterContent> {
  const fallback: SiteFooterContent = {
    eyebrow: locale === "en" ? "Practice project" : "Proyecto de practica",
    title:
      locale === "en"
        ? "Build the architecture you actually want to inherit."
        : "Construya la arquitectura que si quiera heredar.",
    body:
      locale === "en"
        ? "This scaffold is intentionally opinionated about page modeling, editor guardrails, and the split between CMS content and application-owned workflows."
        : "Esta base es intencionalmente opinionada sobre modelado de paginas, guardrails editoriales y la separacion entre contenido del CMS y flujos propios de la aplicacion.",
    brandLabel: locale === "en" ? "Summit Advisory Groups" : "Summit Advisory Groups",
    columns: [
      {
        title: locale === "en" ? "Core paths" : "Rutas clave",
        links: [
          { label: "Home", href: `/${locale}` },
          { label: "Resource center", href: `/${locale}/resource-center` },
          { label: "Contact", href: `/${locale}/contact` },
        ],
      },
      {
        title: "Developer hooks",
        links: [
          { label: "Enable preview", href: "/api/draft?secret=local-preview-secret&slug=/en" },
          { label: "Disable preview", href: "/api/draft/disable" },
        ],
      },
    ],
    socialLinks: [],
  };

  if (!isOptimizelyProviderEnabled()) {
    return fallback;
  }

  const footer = await getOptimizelyFooter(locale, draft);

  if (!footer) {
    return fallback;
  }

  const columns = toArray(footer._json?.columns)
    .map((column) => {
      const title = column.title?.trim();
      const links = toArray(column.links)
        .map((link) => {
          const label = link.label?.trim();
          const href = link.href?.trim();

          if (!label || !href) {
            return null;
          }

          return { label, href };
        })
        .filter((link): link is { label: string; href: string } => Boolean(link));

      if (!title || !links.length) {
        return null;
      }

      return { title, links };
    })
    .filter((column): column is SiteFooterContent["columns"][number] => Boolean(column));

  const socialLinks = toArray(footer._json?.socialLinks)
    .map((link) => {
      const label = link.platform?.trim();
      const href = link.href?.trim();

      if (!label || !href) {
        return null;
      }

      return { label, href };
    })
    .filter((link): link is { label: string; href: string } => Boolean(link));

  const alertsEyebrow = (footer._json?.alertsEyebrow ?? footer._json?.AlertsEyebrow)?.trim() || undefined;
  const alertsHeading = (footer._json?.alertsHeading ?? footer._json?.AlertsHeading)?.trim() || undefined;
  const alertsBody = (footer._json?.alertsBody ?? footer._json?.AlertsBody)?.trim() || undefined;
  const alertsCtaLabel = (footer._json?.alertsCtaLabel ?? footer._json?.AlertsCtaLabel)?.trim() || undefined;
  const alertsCtaHref = (footer._json?.alertsCtaHref ?? footer._json?.AlertsCtaHref)?.trim() || undefined;
  const alertsCallout =
    alertsEyebrow || alertsHeading || alertsBody || alertsCtaLabel || alertsCtaHref
      ? {
          eyebrow: alertsEyebrow,
          heading: alertsHeading,
          body: alertsBody,
          ctaLabel: alertsCtaLabel,
          ctaHref: alertsCtaHref,
        }
      : undefined;

  return {
    eyebrow: footer._json?.eyebrow?.trim() || fallback.eyebrow,
    title: footer._json?.title?.trim() || fallback.title,
    body: getRichTextValue(footer._json?.body) || fallback.body,
    brandLabel:
      footer._json?.brandLabel?.trim() ||
      footer._json?.BrandLabel?.trim() ||
      footer._json?.logoLabel?.trim() ||
      footer._json?.LogoLabel?.trim() ||
      fallback.brandLabel,
    columns: columns.length ? columns : fallback.columns,
    socialLinks,
    copyrightText:
      footer.copyrightText?.trim() || footer._json?.copyrightText?.trim() || undefined,
    alertsCallout,
  };
}

