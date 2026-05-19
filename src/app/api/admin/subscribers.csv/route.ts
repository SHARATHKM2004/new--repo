import { NextResponse } from "next/server";
import { ensureSubscribersTable, sql } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SubscriberRow = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  job_title: string;
  company: string;
  emails_consent: boolean;
  topics: string | null;
  submitted_at: string;
};

function csvEscape(value: unknown): string {
  const s = value === null || value === undefined ? "" : String(value);
  if (/[",\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  const adminKey = process.env.ADMIN_KEY;

  if (!adminKey || key !== adminKey) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  await ensureSubscribersTable();
  const rows = (await sql`
    SELECT id, email, first_name, last_name, job_title, company, emails_consent, topics, submitted_at
    FROM subscribers
    ORDER BY submitted_at DESC
  `) as SubscriberRow[];

  const header = ["submitted_at","email","first_name","last_name","job_title","company","emails_consent","topics"];
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push([
      r.submitted_at,
      r.email,
      r.first_name,
      r.last_name,
      r.job_title,
      r.company,
      r.emails_consent ? "true" : "false",
      r.topics ?? "",
    ].map(csvEscape).join(","));
  }

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=subscribers.csv",
    },
  });
}
