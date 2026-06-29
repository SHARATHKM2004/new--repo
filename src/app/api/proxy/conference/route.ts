import { NextResponse } from "next/server";

const TARGET_URL =
  "https://gfponline.wipfli.com/Shared_Content/Events/Event_Display.aspx?EventKey=NV071326";
const TARGET_ORIGIN = "https://gfponline.wipfli.com";

export async function GET() {
  try {
    const response = await fetch(TARGET_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return new NextResponse("Conference page unavailable", { status: 502 });
    }

    let html = await response.text();

    // Rewrite all relative URLs → absolute so assets load from gfponline.wipfli.com
    html = html
      .replace(/\shref="\//g, ` href="${TARGET_ORIGIN}/`)
      .replace(/\ssrc="\//g, ` src="${TARGET_ORIGIN}/`)
      .replace(/\saction="\//g, ` action="${TARGET_ORIGIN}/`)
      .replace(/url\('\//g, `url('${TARGET_ORIGIN}/`)
      .replace(/url\("\//g, `url("${TARGET_ORIGIN}/`)
      // Fix the JS site root variable so any JS-driven requests go to the right domain
      .replace(
        /gWebSiteRoot\s*=\s*'[^']*'/g,
        `gWebSiteRoot='${TARGET_ORIGIN}'`
      );

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        // Allow this page to be framed by anyone
        "X-Frame-Options": "ALLOWALL",
        "Content-Security-Policy": "frame-ancestors *",
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    });
  } catch {
    return new NextResponse("Failed to load conference page", { status: 502 });
  }
}
