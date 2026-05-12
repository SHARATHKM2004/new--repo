import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getNavigation, getSiteFooterContent, getSiteHeaderContent } from "@/lib/cms";
import { isLocale } from "@/lib/cms/types";

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const draft = await draftMode();
  const navigation = await getNavigation(locale, draft.isEnabled);
  const headerContent = await getSiteHeaderContent(locale, draft.isEnabled);
  const footerContent = await getSiteFooterContent(locale, draft.isEnabled);

  return (
    <div className="site-shell flex min-h-screen flex-col">
      {draft.isEnabled ? (
        <div className="border-b border-accent/20 bg-accent px-6 py-3 text-center text-sm font-semibold text-white">
          Preview mode is enabled. Draft content is currently visible.
        </div>
      ) : null}
      <SiteHeader locale={locale} navigation={navigation} content={headerContent} />
      {children}
      <SiteFooter locale={locale} content={footerContent} />
    </div>
  );
}