import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.BIGMARKER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  const res = await fetch(
    "https://www.bigmarker.com/api/v1/conferences/?type=future&per_page=20",
    {
      headers: { "API-KEY": apiKey },
      next: { revalidate: 300 },
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: `BigMarker API error: ${res.status}` },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
