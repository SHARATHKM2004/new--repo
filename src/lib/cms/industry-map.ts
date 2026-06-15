// D365 → CMS industry mapping.
//
// Mirrors the agreement table shared by the US team. The KEY is the value
// D365 sends in `industryName` (the "Parameter expecting from D365" column).
// The VALUE is the list of CMS industry tag names (the "Corresponding
// Sitecore/CMS name" column) that should be considered a match.
//
// A value of `"*"` is a wildcard — return the latest records irrespective
// of the industry tag (the "Returns latest records irrespective of the
// industry" remark).
//
// Update this map in lock-step with the spreadsheet.

export type IndustryMatch = readonly string[] | "*";

export const INDUSTRY_MAP: Readonly<Record<string, IndustryMatch>> = {
  "Construction and Real Estate": ["Construction and Real Estate", "Construction", "Real Estate"],
  "Financial Services": ["Financial Services", "Insurance", "Financial Institutions", "Fintech", "Private Equity"],
  "General Office": "*",
  "Healthcare": ["Healthcare"],
  "Manufacturing and Distribution": ["Manufacturing", "Distribution", "Agribusiness", "Dealerships"],
  "Nonprofits": ["Nonprofits"],
  "Governments": ["Governments"],
  "Education": ["Education"],
  "Private Client": "*",
  "Technology and Innovation": ["Technology Companies", "Fintech"],
  "Tribal": ["Tribal"],
  "Wipfli Internal": "*",
};

export const ACCEPTED_INDUSTRY_NAMES: readonly string[] = Object.keys(INDUSTRY_MAP);

/** Case-insensitive lookup. Returns the mapped CMS names, "*" for wildcard,
 *  or `null` if the D365 value is not in the agreed vocabulary. */
export function resolveIndustryMatch(industryName: string | null | undefined): IndustryMatch | null {
  const needle = (industryName ?? "").trim().toLowerCase();
  if (!needle) return null;
  for (const key of ACCEPTED_INDUSTRY_NAMES) {
    if (key.toLowerCase() === needle) {
      return INDUSTRY_MAP[key];
    }
  }
  return null;
}

/** True when the article's CMS industry tags satisfy the requested match. */
export function articleMatchesIndustry(
  articleIndustryTags: readonly string[],
  match: IndustryMatch,
): boolean {
  if (match === "*") return true;
  const tags = articleIndustryTags.map((tag) => tag.trim().toLowerCase()).filter(Boolean);
  const wanted = match.map((tag) => tag.trim().toLowerCase());
  return tags.some((tag) => wanted.includes(tag));
}
