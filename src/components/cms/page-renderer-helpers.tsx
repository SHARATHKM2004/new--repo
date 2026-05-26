import Link from "next/link";
import { type ReactNode } from "react";
import type { Block } from "@/lib/cms/types";

function isArticleBodyBlock(block: Block) {
  return block.type === "richText" || block.type === "html" || block.type === "image";
}

function renderInlineArticleBlock(block: Block, key: string) {
  if (block.type === "richText") {
    return (
      <div key={key}>
        {block.body.map((paragraph) => {
          const trimmed = paragraph.trim();

          if (trimmed.startsWith("- ")) {
            return (
              <ul key={`${key}-${paragraph}`}>
                <li>{trimmed.slice(2)}</li>
              </ul>
            );
          }

          return <p key={`${key}-${paragraph}`}>{paragraph}</p>;
        })}
      </div>
    );
  }

  if (block.type === "html") {
    return <div key={key} dangerouslySetInnerHTML={{ __html: block.html }} />;
  }

  if (block.type === "image") {
    return (
      <figure key={key} className="my-8 space-y-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={block.src}
          alt={block.alt}
          loading="lazy"
          decoding="async"
          className="w-full object-cover"
        />
        {block.caption ? <figcaption className="text-sm text-muted">{block.caption}</figcaption> : null}
      </figure>
    );
  }

  return null;
}

function renderInlineLinks(text: string) {
  const pattern = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const [, label, href] = match;
    const isExternal = /^https?:\/\//i.test(href);
    nodes.push(
      isExternal ? (
        <a
          key={`link-${key++}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#1554ff", textDecoration: "underline" }}
        >
          {label}
        </a>
      ) : (
        <Link
          key={`link-${key++}`}
          href={href}
          style={{ color: "#1554ff", textDecoration: "underline" }}
        >
          {label}
        </Link>
      ),
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length ? nodes : text;
}

function renderContactIntroBlock(block: Extract<Block, { type: "richText" | "html" }>) {
  if (block.type === "html") {
    return <div className="contact-intro-copy" dangerouslySetInnerHTML={{ __html: block.html }} />;
  }

  return (
    <div className="contact-intro-copy">
      {block.body.map((paragraph) => {
        const trimmed = paragraph.trim();

        if (trimmed.startsWith("- ")) {
          return (
            <ul key={paragraph}>
              <li>{trimmed.slice(2)}</li>
            </ul>
          );
        }

        return <p key={paragraph}>{paragraph}</p>;
      })}
    </div>
  );
}

function formatInsightDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}
export { isArticleBodyBlock, renderInlineArticleBlock, renderInlineLinks, renderContactIntroBlock, formatInsightDate };
