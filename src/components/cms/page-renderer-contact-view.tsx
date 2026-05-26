import { BlockRenderer } from "@/components/cms/block-renderer";
import { renderContactIntroBlock, renderInlineLinks } from "@/components/cms/page-renderer-helpers";
import type { Block, Locale, Page } from "@/lib/cms/types";

export function ContactView({
  page,
  locale,
  draft,
  renderedSections,
}: {
  page: Page;
  locale: Locale;
  draft: boolean;
  renderedSections: Block[];
}) {
    const introBlock = renderedSections.find(
      (block): block is Extract<Block, { type: "richText" | "html" }> =>
        block.type === "richText" || block.type === "html",
    );
    const formBlocks = renderedSections.filter(
      (block): block is Extract<Block, { type: "form" }> => block.type === "form",
    );

    return (
      <main className="flex-1">
        <section className="bg-[#d9d9dd]">
          <div className="mx-auto max-w-[1260px] px-6 py-8 lg:px-10 lg:py-10">
            <h1 className="text-[3.8rem] font-light tracking-tight text-[#1554ff] lg:text-[4.1rem]">
              {page.title}
            </h1>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-[1260px] px-6 py-10 lg:px-10 lg:py-12">
            {formBlocks.length ? (
              <div className="max-w-[1100px] space-y-4">
                {formBlocks[0].intro ? (
                  <h2 className="text-[2.4rem] font-normal leading-[1.15] text-[#1554ff] lg:text-[2.7rem]">
                    {formBlocks[0].intro}
                  </h2>
                ) : null}
                {(formBlocks[0].introText ?? "")
                  .replace(/<br\s*\/?>(\s*<br\s*\/?>)*/gi, "\n\n")
                  .split(/\r?\n+/)
                  .map((p) => p.trim())
                  .filter(Boolean)
                  .map((paragraph, index) => (
                    <p key={index} className="text-[14px] leading-7 text-[#374151]">
                      {renderInlineLinks(paragraph)}
                    </p>
                  ))}
              </div>
            ) : null}

            {introBlock ? (
              <div className="mt-6 max-w-[860px]">{renderContactIntroBlock(introBlock)}</div>
            ) : null}

            <div className="mx-auto mt-8 max-w-[760px]">
              {formBlocks.map((block, index) => (
                <BlockRenderer
                  key={`${page.id}-${block.type}-${index}`}
                  block={{ ...block, title: "", intro: "", introText: "" }}
                  locale={locale}
                  draft={draft}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    );
}
