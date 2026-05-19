import { NextResponse } from "next/server";
import { ensureSubscribersTable, sql } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim();
  const firstName = String(body.firstName ?? "").trim();
  const lastName = String(body.lastName ?? "").trim();
  const jobTitle = String(body.jobTitle ?? "").trim();
  const company = String(body.company ?? "").trim();
  const emailsConsent = Boolean(body.emailsConsent);
  const topics = Array.isArray(body.topics)
    ? (body.topics as unknown[]).filter((t): t is string => typeof t === "string").join(", ")
    : "";

  if (!email || !firstName || !lastName || !jobTitle || !company) {
    return NextResponse.json({ message: "All fields are required." }, { status: 400 });
  }
  if (!isEmail(email)) {
    return NextResponse.json({ message: "Invalid email." }, { status: 400 });
  }

  try {
    await ensureSubscribersTable();
    await sql`
      INSERT INTO subscribers (email, first_name, last_name, job_title, company, emails_consent, topics)
      VALUES (${email}, ${firstName}, ${lastName}, ${jobTitle}, ${company}, ${emailsConsent}, ${topics})
    `;
  } catch (err) {
    console.error("[subscribe] db error", err);
    return NextResponse.json({ message: "Database error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
