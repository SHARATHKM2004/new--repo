import Link from "next/link";
import type { PortalApplicationsBlock } from "@/lib/cms/types";

type Props = {
  block: PortalApplicationsBlock;
  locale: "en" | "es";
};

function renderInlineLinks(text: string) {
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  const nodes: Array<string | JSX.Element> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    nodes.push(
      <a
        key={`link-${key++}`}
        href={match[2]}
        style={{ color: "#1554ff", textDecoration: "underline" }}
      >
        {match[1]}
      </a>,
    );
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

export function PortalApplications({ block, locale }: Props) {
  const bannerHeading =
    block.bannerHeading ?? (locale === "en" ? "Connect with us" : "Conecta con nosotros");
  const sectionHeading =
    block.sectionHeading ?? (locale === "en" ? "Our applications" : "Nuestras aplicaciones");
  const introParagraphs = (block.introText ?? "").split(/\r?\n+/).filter((p) => p.trim());
  const signInDefault = locale === "en" ? "SIGN IN" : "INICIAR SESION";

  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-white">
      <div className="w-full bg-[#e9ebee]">
        <div className="mx-auto max-w-[1260px] px-6 py-16 lg:px-10 lg:py-24">
          <h1 className="text-center text-4xl font-light text-[#1554ff] lg:text-6xl">
            {bannerHeading}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-[820px] px-6 py-14 lg:px-10 lg:py-20">
        <h2 className="mb-6 text-3xl font-normal text-[#1554ff] lg:text-4xl">{sectionHeading}</h2>
        {introParagraphs.length > 0 ? (
          <div className="mb-10 space-y-4 text-[15px] leading-7 text-[#374151]">
            {introParagraphs.map((p, i) => (
              <p key={i}>{renderInlineLinks(p)}</p>
            ))}
          </div>
        ) : null}

        <div className="space-y-10">
          {block.applications.map((app, idx) => (
            <div key={`${app.title}-${idx}`}>
              <h3 className="mb-3 text-2xl font-normal text-[#1554ff]">{app.title}</h3>
              {app.description ? (
                <div className="mb-4 space-y-4 text-[15px] leading-7 text-[#374151]">
                  {app.description.split(/\r?\n+/).filter((p) => p.trim()).map((p, i) => (
                    <p key={i}>{renderInlineLinks(p)}</p>
                  ))}
                </div>
              ) : null}
              {app.signInUrl ? (
                <Link
                  href={app.signInUrl}
                  className="inline-block border border-[#1554ff] px-6 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#1554ff] hover:bg-[#1554ff] hover:text-white"
                >
                  {app.signInLabel ?? signInDefault}
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
