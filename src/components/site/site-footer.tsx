import Link from "next/link";
import { Suspense, lazy } from "react";
import type { Locale, SiteFooterContent } from "@/lib/cms/types";

const AlertsCallout = lazy(() =>
  import("./alerts-callout").then((module) => ({
    default: module.AlertsCallout,
  })),
);

function AlertsCalloutFallback() {
  return (
    <div className="bg-[#f3f4f6] px-6 py-16 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-7xl animate-pulse space-y-4">
        <div className="h-3 w-32 bg-[#dbe7ff]" />
        <div className="h-10 w-1/2 bg-[#e5e7eb]" />
        <div className="h-20 bg-[#e5e7eb]" />
        <div className="h-10 w-40 bg-[#d1d5db]" />
      </div>
    </div>
  );
}

const BRAND_NAME = "Summit Advisory Group";

function pickHref(content: SiteFooterContent, keyword: string): string {
  const match = content.socialLinks.find((link) =>
    link.label.toLowerCase().includes(keyword),
  );
  return match?.href ?? "#";
}

export function SiteFooter({ locale, content, hideCallout = false }: { locale: Locale; content: SiteFooterContent; hideCallout?: boolean }) {
  const linkedInHref = pickHref(content, "linkedin");
  const facebookHref = pickHref(content, "facebook");

  return (
    <>
      {hideCallout ? null : (
        <Suspense fallback={<AlertsCalloutFallback />}>
          <AlertsCallout locale={locale} content={content.alertsCallout} />
        </Suspense>
      )}
      <footer className="mt-20 bg-[#1247ff] text-white">
      <div className="w-full py-10">
        <div className="flex w-full items-start">
          {/* Social icons — flush left */}
          <div className="flex shrink-0 items-center gap-4 pl-6 pt-1 text-white lg:pl-10">
            <Link href={linkedInHref} aria-label="LinkedIn" className="text-white transition hover:opacity-80">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
              </svg>
            </Link>
            <Link href={facebookHref} aria-label="Facebook" className="text-white transition hover:opacity-80">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.408.593 24 1.325 24H12.82V14.706h-3.13v-3.62h3.13V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.464.099 2.795.143v3.24h-1.918c-1.504 0-1.795.715-1.795 1.764v2.313h3.587l-.467 3.62h-3.12V24h6.116c.73 0 1.323-.592 1.323-1.325V1.325C24 .593 23.408 0 22.675 0z" />
              </svg>
            </Link>
          </div>

          {/* Link columns — center, with CMS content on the left */}
          <div className="flex flex-1 justify-center gap-16 px-10">
            {(content.eyebrow || content.title || content.body) ? (
              <div className="space-y-3 max-w-[220px]">
                {content.eyebrow ? (
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">{content.eyebrow}</p>
                ) : null}
                {content.title ? (
                  <h2 className="serif text-xl font-semibold tracking-tight text-white">{content.title}</h2>
                ) : null}
                {content.body ? (
                  <p className="text-sm leading-7 text-white/90">{content.body}</p>
                ) : null}
              </div>
            ) : null}
            {content.columns.slice(0, 2).map((column) => (
              <div key={column.title} className="space-y-3">
                {column.links.map((link) => (
                  <Link
                    key={`${column.title}-${link.href}`}
                    href={link.href}
                    className="block text-sm font-normal text-white hover:underline"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>

          {/* Brand badge — flush right */}
          <div className="shrink-0 self-start">
            <Link
              href={`/${locale}`}
              aria-label={BRAND_NAME}
              className="flex items-center justify-center border-2 border-white bg-white px-5 py-4 text-center text-base font-extrabold uppercase leading-tight tracking-wide"
              style={{ color: "#1247ff" }}
            >
              {BRAND_NAME}
            </Link>
          </div>
        </div>
      </div>

      {content.copyrightText ? (
        <div className="border-t border-white/20">
          <div className="w-full px-6 py-5 text-xs leading-6 text-white/90 lg:px-10">
            <p>{content.copyrightText}</p>
          </div>
        </div>
      ) : null}
    </footer>
    </>
  );
}