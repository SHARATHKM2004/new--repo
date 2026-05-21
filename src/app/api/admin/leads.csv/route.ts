import { ensureLeadsTable, sql } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LeadRow = {
  email: string;
  first_name: string | null;
  last_name: string | null;
  job_title: string | null;
  company: string;
  city: string | null;
  state: string | null;
  phone: string | null;
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
    SELECT email, first_name, last_name, job_title, company, city, state, phone, message, submitted_at
    FROM leads
    ORDER BY submitted_at DESC
  `) as LeadRow[];

  const header = "submitted_at,email,first_name,last_name,job_title,organization,city,state,phone,message";
  const body = rows
    .map((r) =>
      [
        r.submitted_at,
        r.email,
        r.first_name,
        r.last_name,
        r.job_title,
        r.company,
        r.city,
        r.state,
        r.phone,
        r.message,
      ]
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
