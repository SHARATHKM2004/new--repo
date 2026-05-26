import type { Page } from "@/lib/cms/types";

export function PageKicker({ page }: { page: Page }) {
  switch (page.type) {
    case "service":
      return (
        <div className="flex flex-wrap gap-2 text-sm text-muted">
          {page.outcomes.map((outcome) => (
            <span key={outcome} className="rounded-full border border-border px-3 py-1">
              {outcome}
            </span>
          ))}
        </div>
      );
    case "industry":
      return (
        <div className="flex flex-wrap gap-2 text-sm text-muted">
          {page.audience.map((audience) => (
            <span key={audience} className="rounded-full border border-border px-3 py-1">
              {audience}
            </span>
          ))}
        </div>
      );
    case "insight":
      return (
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
          <span>{page.readTime}</span>
          <span>â€¢</span>
          <span>{page.publishedAt}</span>
          {page.topics.map((topic) => (
            <span key={topic} className="rounded-full border border-border px-3 py-1">
              {topic}
            </span>
          ))}
        </div>
      );
    case "caseStudy":
      return (
        <div className="grid gap-3 text-sm text-muted md:grid-cols-3">
          <div>
            <div className="font-semibold text-foreground">Client</div>
            <div>{page.client}</div>
          </div>
          <div>
            <div className="font-semibold text-foreground">Challenge</div>
            <div>{page.challenge}</div>
          </div>
          <div>
            <div className="font-semibold text-foreground">Result</div>
            <div>{page.result}</div>
          </div>
        </div>
      );
    case "author":
      return (
        <div className="flex flex-wrap gap-2 text-sm text-muted">
          <span className="rounded-full border border-border px-3 py-1">{page.role}</span>
          {page.expertise.map((skill) => (
            <span key={skill} className="rounded-full border border-border px-3 py-1">
              {skill}
            </span>
          ))}
        </div>
      );
    case "contact":
      return (
        <div className="grid gap-4 md:grid-cols-2">
          {page.offices.map((office) => (
            <div key={office.city} className="rounded-[1.5rem] border border-border bg-white/75 p-5 text-sm">
              <div className="font-semibold text-foreground">{office.city}</div>
              <div className="mt-2 text-muted">{office.phone}</div>
              <div className="mt-2 text-muted">{office.focus}</div>
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
}

