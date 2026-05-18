import Link from "next/link";
import type { Locale, SiteFooterContent } from "@/lib/cms/types";

export function SiteFooter({ locale, content }: { locale: Locale; content: SiteFooterContent }) {
  return (
    <footer className="mt-20 bg-footer text-white">
      <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-6 py-14 lg:grid-cols-[1.5fr_1fr_1fr] lg:px-10">
        <div className="space-y-3">
          <p className="eyebrow text-xs font-semibold text-white/70">
            {content.eyebrow ?? (locale === "en" ? "Practice project" : "Proyecto de practica")}
          </p>
          <h2 className="serif text-4xl font-semibold tracking-tight text-white">
            {content.title}
          </h2>
          <p className="max-w-xl text-sm leading-7 text-white/72">
            {content.body}
          </p>
        </div>
        {content.columns.slice(0, 2).map((column) => (
          <div key={column.title} className="space-y-3 text-sm text-white/72">
            <p className="font-semibold uppercase tracking-[0.12em] text-white">{column.title}</p>
            {column.links.map((link) => (
              <Link key={`${column.title}-${link.href}`} href={link.href} className="block transition hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      {content.socialLinks.length || content.copyrightText ? (
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 border-t border-white/12 px-6 py-5 text-sm text-white/60 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <p>{content.copyrightText ?? ""}</p>
          <div className="flex flex-wrap gap-4">
            {content.socialLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </footer>
  );
}