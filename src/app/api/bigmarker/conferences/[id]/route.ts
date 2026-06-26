import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const apiKey = process.env.BIGMARKER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  const { id } = await params;

  const res = await fetch(
    `https://web.bigmarker.com/api/v1/conferences/${id}`,
    {
      headers: { "API-KEY": apiKey },
      next: { revalidate: 0 },
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
