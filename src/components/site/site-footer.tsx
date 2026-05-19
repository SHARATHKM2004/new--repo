import Link from "next/link";
import type { Locale, SiteFooterContent } from "@/lib/cms/types";

export function SiteFooter({ locale, content }: { locale: Locale; content: SiteFooterContent }) {
  return (
    <footer className="mt-20 border-t border-border/80 bg-[rgba(255,251,244,0.72)]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[1.4fr_1fr_1fr_auto] lg:px-10">
        <div className="space-y-3">
          <p className="eyebrow text-xs font-semibold">
            {content.eyebrow ?? (locale === "en" ? "Practice project" : "Proyecto de practica")}
          </p>
          <h2 className="serif text-3xl font-semibold tracking-tight">
            {content.title}
          </h2>
          <p className="max-w-xl text-sm leading-7 text-muted">
            {content.body}
          </p>
        </div>
        {content.columns.slice(0, 2).map((column) => (
          <div key={column.title} className="space-y-3 text-sm text-muted">
            <p className="font-semibold text-foreground">{column.title}</p>
            {column.links.map((link) => (
              <Link key={`${column.title}-${link.href}`} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        ))}
        <div className="flex items-start justify-end">
          <Link
            href={`/${locale}`}
            className="inline-flex min-w-[200px] items-center justify-center border border-[#1247ff] bg-white px-6 py-5 text-center text-base font-bold uppercase leading-tight tracking-wide text-[#1247ff] shadow-sm"
          >
            {content.title}
          </Link>
        </div>
      </div>
      {content.socialLinks.length || content.copyrightText ? (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 border-t border-border/60 px-6 py-5 text-sm text-muted lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <p>{content.copyrightText ?? ""}</p>
          <div className="flex flex-wrap gap-4">
            {content.socialLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </footer>
  );
}