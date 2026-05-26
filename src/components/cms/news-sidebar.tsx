import Link from "next/link";
import type { Block, Locale } from "@/lib/cms/types";

type SidebarBlock = Extract<Block, { type: "richText" | "html" | "cta" }>;

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>(\s*)/gi, "\n")
    .replace(/<\/p>\s*<p[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function blockToLines(block: SidebarBlock): string[] {
  if (block.type === "cta") {
    return [block.title, block.body, `${block.action.label} -> ${block.action.href}`];
  }
  const raw =
    block.type === "richText"
      ? block.body.join("\n")
      : stripHtml(block.html);
  return raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

function isHeading(line: string): boolean {
  if (line.length < 3 || line.length > 60) return false;
  const letters = line.replace(/[^A-Za-z]/g, "");
  if (!letters) return false;
  return letters === letters.toUpperCase();
}

function isButton(line: string): { label: string; href: string } | null {
  // Matches "Label -> https://..." or "Label | https://..."
  const arrow = line.match(/^(.+?)\s*(?:->|=>|\|)\s*(https?:\/\/\S+|mailto:\S+|\/\S*)\s*$/i);
  if (arrow && /[A-Za-z]/.test(arrow[1])) {
    return { label: arrow[1].trim(), href: arrow[2].trim() };
  }
  // Plain "READ MORE" or "CONTACT US" with no link
  if (/^(read more|contact us|learn more|view all)$/i.test(line)) {
    return { label: line, href: "#" };
  }
  return null;
}

function parseItemLine(line: string): { title: string; meta?: string } {
  // Patterns: "Title — Source | Date"  or  "Title - Source | Date"
  const dashSplit = line.split(/\s+[—–-]\s+/);
  if (dashSplit.length >= 2) {
    return { title: dashSplit[0].trim(), meta: dashSplit.slice(1).join(" — ").trim() };
  }
  // Patterns: "Title | Date"
  const pipeIdx = line.indexOf(" | ");
  if (pipeIdx > 0) {
    return { title: line.slice(0, pipeIdx).trim(), meta: line.slice(pipeIdx + 3).trim() };
  }
  return { title: line };
}

type Props = {
  locale: Locale;
  blocks: SidebarBlock[];
};

export function NewsSidebar({ blocks }: Props) {
  if (!blocks.length) return null;

  return (
    <>
      {blocks.map((block, blockIndex) => {
        const lines = blockToLines(block);
        if (!lines.length) return null;

        return (
          <div
            key={`news-sidebar-${blockIndex}`}
            className="bg-[#f3f4f6] p-6 text-sm leading-7 text-[#1f2937]"
          >
            {lines.map((line, i) => {
              const btn = isButton(line);
              if (btn) {
                return (
                  <Link
                    key={i}
                    href={btn.href}
                    className="mt-4 inline-block border border-[#1554ff] px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#1554ff] hover:bg-[#1554ff] hover:text-white"
                  >
                    {btn.label}
                  </Link>
                );
              }
              if (isHeading(line)) {
                return (
                  <h3
                    key={i}
                    className={`${i === 0 ? "" : "mt-6"} text-base font-semibold uppercase tracking-wide text-[#1554ff]`}
                  >
                    {line}
                  </h3>
                );
              }
              // Treat email & phone specially
              if (/^[^\s]+@[^\s]+\.[^\s]+$/.test(line)) {
                return (
                  <div key={i} className="mt-1">
                    <a href={`mailto:${line}`} className="text-[#1554ff] hover:underline">
                      {line}
                    </a>
                  </div>
                );
              }
              if (/^\+?[\d().\s-]{7,}$/.test(line)) {
                return (
                  <div key={i} className="mt-1 text-[#1f2937]">
                    {line}
                  </div>
                );
              }
              const { title, meta } = parseItemLine(line);
              return (
                <div key={i} className="mt-3 border-b border-[#d1d5db] pb-3 last:border-b-0">
                  <div className="font-semibold text-[#0b1220]">{title}</div>
                  {meta ? <div className="mt-1 text-xs text-[#6b7280]">{meta}</div> : null}
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
}
