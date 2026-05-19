import Link from "next/link";
import type { Locale, SiteFooterContent } from "@/lib/cms/types";

export function SiteFooter({ locale, content }: { locale: Locale; content: SiteFooterContent }) {
  return (
    <footer className="mt-20 bg-[#1247ff] text-white">
      <div className="mx-auto w-full max-w-[1400px] px-6 py-12 lg:px-10">
        {(content.eyebrow || content.title || content.body) ? (
          <div className="mb-10 max-w-3xl space-y-3">
            {content.eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                {content.eyebrow}
              </p>
            ) : null}
            {content.title ? (
              <h2 className="serif text-3xl font-semibold tracking-tight text-white">
                {content.title}
              </h2>
            ) : null}
            {content.body ? (
              <p className="max-w-2xl text-sm leading-7 text-white/90">{content.body}</p>
            ) : null}
          </div>
        ) : null}

        <div className="grid gap-10 lg:grid-cols-[auto_1fr_1fr_auto] lg:gap-12">
          <div className="flex gap-4 text-white">
            {content.socialLinks.slice(0, 4).map((link) => {
              const label = link.label.toLowerCase();
              const isLinkedIn = label.includes("linkedin") || label === "in";
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-label={link.label}
                  className="text-white transition hover:opacity-80"
                >
                  {isLinkedIn ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
                    </svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.408.593 24 1.325 24H12.82V14.706h-3.13v-3.62h3.13V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.464.099 2.795.143v3.24h-1.918c-1.504 0-1.795.715-1.795 1.764v2.313h3.587l-.467 3.62h-3.12V24h6.116c.73 0 1.323-.592 1.323-1.325V1.325C24 .593 23.408 0 22.675 0z" />
                    </svg>
                  )}
                </Link>
              );
            })}
          </div>

          {content.columns.slice(0, 2).map((column) => (
            <div key={column.title} className="space-y-3 text-sm text-white">
              <p className="font-semibold uppercase tracking-wide text-white">{column.title}</p>
              {column.links.map((link) => (
                <Link
                  key={`${column.title}-${link.href}`}
                  href={link.href}
                  className="block font-semibold text-white hover:underline"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}

          <div className="flex items-start justify-end">
            <Link
              href={`/${locale}`}
              className="inline-flex min-w-[200px] items-center justify-center bg-white px-6 py-5 text-center text-base font-bold uppercase leading-tight tracking-wide text-[#1247ff]"
            >
              {content.title}
            </Link>
          </div>
        </div>
      </div>

      {content.copyrightText || content.socialLinks.length ? (
        <div className="border-t border-white/20">
          <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-3 px-6 py-5 text-xs leading-6 text-white/90 lg:flex-row lg:items-center lg:justify-between lg:px-10">
            <p>{content.copyrightText ?? ""}</p>
            <div className="flex flex-wrap gap-4">
              {content.socialLinks.map((link) => (
                <Link key={`legal-${link.href}`} href={link.href} className="text-white/90 hover:underline">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </footer>
  );
}