import { ensureLeadsTable, sql } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LeadRow = {
  name: string;
  email: string;
  company: string;
  message: string;
  submitted_at: string;
};

function csvEscape(value: unknown) {
  const s = value === null || value === undefined ? "" : String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  const adminKey = process.env.ADMIN_KEY;

  if (!adminKey || key !== adminKey) {
    return new Response("Unauthorized", { status: 401 });
  }

  await ensureLeadsTable();
  const rows = (await sql`
    SELECT name, email, company, message, submitted_at
    FROM leads
    ORDER BY submitted_at DESC
  `) as LeadRow[];

  const header = "submitted_at,name,email,company,message";
  const body = rows
    .map((r) =>
      [r.submitted_at, r.name, r.email, r.company, r.message]
        .map(csvEscape)
        .join(","),
    )
    .join("\n");

  return new Response(`${header}\n${body}`, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="leads.csv"',
    },
  });
}
