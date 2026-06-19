import Link from "next/link";
import type { NavigationItem } from "@/lib/cms/types";

export function SiteHeaderPanel({
  activePanel,
  secondaryNav,
  quickLinks,
  onClose,
}: {
  activePanel: string;
  secondaryNav: NavigationItem[];
  quickLinks: { label: string; href: string }[];
  onClose: () => void;
}) {
  const activeItem = secondaryNav.find(
    (item) => item.label.trim().toLowerCase() === activePanel,
  );
  const groups = activeItem?.groups ?? [];

  if (groups.length > 0) {
    const allLinks = groups.flatMap((g) => g.links);
    const isFlatPanel = groups.every((g) => !g.title || !g.title.trim());

    if (isFlatPanel) {
      return (
        <div className="grid grid-cols-2 gap-x-10 gap-y-4 md:grid-cols-3 lg:grid-cols-4">
          {allLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch={false}
              onClick={onClose}
              style={{ color: "#4f84ff" }}
              className="block text-[18px] font-semibold !text-[#4f84ff] hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </div>
      );
    }

    return (
      <div className="columns-2 gap-x-10 md:columns-3 lg:columns-4">
        {groups.map((group, gi) => (
          <div key={`${group.title}-${gi}`} className="mb-8 space-y-3 break-inside-avoid">
            {group.title ? (
              <h3 className="text-[18px] font-semibold text-[#4f84ff]">
                {group.title}
              </h3>
            ) : null}
            {group.links.length > 0 ? (
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={`${group.title}-${link.href}`}>
                    <Link
                      href={link.href}
                      prefetch={false}
                      onClick={onClose}
                      className="block text-[14px] leading-snug text-white/85 hover:text-white hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
            {group.subgroups && group.subgroups.length > 0 ? (
              <div className="space-y-3">
                {group.subgroups.map((sub, si) => (
                  <div key={`${group.title}-sub-${si}`} className="space-y-1">
                    {sub.title ? (
                      <p className="text-[14px] font-semibold leading-snug text-white">
                        {sub.title}
                      </p>
                    ) : null}
                    <ul className="space-y-1 pl-4">
                      {sub.links.map((link) => (
                        <li key={`${sub.title}-${link.href}`}>
                          <Link
                            href={link.href}
                            prefetch={false}
                            onClick={onClose}
                            className="block text-[14px] leading-snug text-white/85 hover:text-white hover:underline"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-10">
      <div>
        <h3 className="text-[32px] font-semibold uppercase tracking-wide text-white/90">
          {activePanel}
        </h3>
        <p className="mt-2 text-sm text-white/70">
          Explore available links for this section.
        </p>
      </div>
      <div className="space-y-3">
        {quickLinks.slice(0, 2).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            prefetch={false}
            className="block text-[17px] text-[#4f84ff] hover:underline"
          >
            {item.label}
          </Link>
        ))}
      </div>
      <div className="space-y-3">
        {quickLinks.slice(2, 4).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            prefetch={false}
            className="block text-[17px] text-[#4f84ff] hover:underline"
          >
            {item.label}
          </Link>
        ))}
      </div>
      <div className="space-y-3">
        {quickLinks.slice(4, 6).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            prefetch={false}
            className="block text-[17px] text-[#4f84ff] hover:underline"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
