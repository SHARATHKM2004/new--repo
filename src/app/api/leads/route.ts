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
      email: string;
      firstName: string;
      lastName: string;
      jobTitle: string;
      organization: string;
      city: string;
      state: string;
      phone: string;
      message: string;
    }>;

    const email = body.email?.trim() ?? "";
    const firstName = body.firstName?.trim() ?? "";
    const lastName = body.lastName?.trim() ?? "";
    const jobTitle = body.jobTitle?.trim() ?? "";
    const organization = body.organization?.trim() ?? "";
    const city = body.city?.trim() ?? "";
    const state = body.state?.trim() ?? "";
    const phone = body.phone?.trim() ?? "";
    const message = body.message?.trim() ?? "";

    if (!email || !firstName || !lastName || !jobTitle || !organization || !message) {
      return NextResponse.json(
        { message: "Please complete all required fields." },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: "Please provide a valid email address." },
        { status: 400 },
      );
    }

    const name = `${firstName} ${lastName}`.trim();

    await ensureLeadsTable();
    await sql`
      INSERT INTO leads (
        name,
        email,
        company,
        message,
        first_name,
        last_name,
        job_title,
        city,
        state,
        phone
      )
      VALUES (
        ${name},
        ${email},
        ${organization},
        ${message},
        ${firstName},
        ${lastName},
        ${jobTitle},
        ${city || null},
        ${state || null},
        ${phone || null}
      )
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