import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { PageRenderer } from "@/components/cms/page-renderer";
import { getPageBySlug } from "@/lib/cms";
import { isLocale, type Locale } from "@/lib/cms/types";

type RouteParams = {
  locale: string;
  slug?: string[];
};

type SearchParams = {
  q?: string;
  topic?: string;
  service?: string;
  industry?: string;
};

async function loadPage(routeParams: RouteParams) {
  if (!isLocale(routeParams.locale)) {
    return null;
  }

  const draft = await draftMode();

  return getPageBySlug({
    locale: routeParams.locale,
    slug: routeParams.slug ?? [],
    draft: draft.isEnabled,
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const routeParams = await params;
  const page = await loadPage(routeParams);
  const siteUrl = process.env.SITE_URL?.trim();
  const pathname = `/${routeParams.locale}${routeParams.slug?.length ? `/${routeParams.slug.join("/")}` : ""}`;
  const metadataBase = siteUrl ? new URL(siteUrl) : undefined;

  if (!page) {
    return {
      title: "Not found",
      metadataBase,
    };
  }

  return {
    metadataBase,
    title: page.seo.title,
    description: page.seo.description,
    keywords: page.seo.keywords,
    robots: page.seo.noIndex ? { index: false, follow: false } : undefined,
    alternates: {
      canonical: pathname,
      languages: {
        en: `/en${page.slug.length ? `/${page.slug.join("/")}` : ""}`,
        es: `/es${page.slug.length ? `/${page.slug.join("/")}` : ""}`,
      },
    },
    openGraph: {
      title: page.seo.ogTitle ?? page.seo.title,
      description: page.seo.ogDescription ?? page.seo.description,
      url: pathname,
    },
  };
}

export default async function CmsPage({
  params,
  searchParams,
}: {
  params: Promise<RouteParams>;
  searchParams: Promise<SearchParams>;
}) {
  const routeParams = await params;

  if (!isLocale(routeParams.locale)) {
    notFound();
  }

  const draft = await draftMode();
  const page = await getPageBySlug({
    locale: routeParams.locale,
    slug: routeParams.slug ?? [],
    draft: draft.isEnabled,
  });

  if (!page) {
    notFound();
  }

  const filters = await searchParams;

  return (
    <PageRenderer
      page={page}
      locale={page.locale}
      requestedLocale={routeParams.locale as Locale}
      draft={draft.isEnabled}
      filters={filters}
    />
  );
}