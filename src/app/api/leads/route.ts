import { NextResponse } from "next/server";
import { ensureLeadsTable, sql } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<{
      name: string;
      email: string;
      company: string;
      message: string;
    }>;

    const name = body.name?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const company = body.company?.trim() ?? "";
    const message = body.message?.trim() ?? "";

    if (!name || !email || !company || !message) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: "Please provide a valid email address." },
        { status: 400 },
      );
    }

    await ensureLeadsTable();
    await sql`
      INSERT INTO leads (name, email, company, message)
      VALUES (${name}, ${email}, ${company}, ${message})
    `;

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/leads] failed", error);
    return NextResponse.json(
      { message: "Unable to save lead." },
      { status: 500 },
    );
  }
}