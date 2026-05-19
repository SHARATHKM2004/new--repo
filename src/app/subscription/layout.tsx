import { draftMode } from "next/headers";
import { SiteFooter } from "@/components/site/site-footer";
import { getSiteFooterContent } from "@/lib/cms";

export default async function SubscriptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const draft = await draftMode();
  const footerContent = await getSiteFooterContent("en", draft.isEnabled);

  return (
    <div className="site-shell flex min-h-screen flex-col">
      <div className="flex-1">{children}</div>
      <SiteFooter locale="en" content={footerContent} hideCallout />
    </div>
  );
}
