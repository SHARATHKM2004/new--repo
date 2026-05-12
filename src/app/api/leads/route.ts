import { NextResponse } from "next/server";
import { saveLeadSubmission } from "@/lib/leads";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
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

  await saveLeadSubmission({
    name,
    email,
    company,
    message,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}