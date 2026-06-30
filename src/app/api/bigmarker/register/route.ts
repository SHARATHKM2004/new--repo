import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.BIGMARKER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const {
    conferenceId,
    firstName,
    lastName,
    email,
    jobTitle,
    organization,
    organizationIndustry,
  } = body as Record<string, string>;

  // Server-side validation
  if (!conferenceId || !firstName?.trim() || !lastName?.trim() || !email?.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }
  // Reject obviously malformed conference IDs (alphanumeric + hyphens only)
  if (!/^[a-zA-Z0-9_-]+$/.test(conferenceId)) {
    return NextResponse.json({ error: "Invalid conference ID" }, { status: 400 });
  }

  const bmRes = await fetch("https://web.bigmarker.com/api/v1/conferences/register", {
    method: "POST",
    headers: {
      "API-KEY": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      conference_id: conferenceId,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim().toLowerCase(),
      custom_fields: {
        job_title: jobTitle?.trim() ?? "",
        organization: organization?.trim() ?? "",
        organization_industry: organizationIndustry?.trim() ?? "",
      },
    }),
  });

  const data = await bmRes.json().catch(() => ({}));

  if (!bmRes.ok) {
    const message =
      (data as { error?: string; message?: string }).error ??
      (data as { error?: string; message?: string }).message ??
      "Registration failed. Please try again.";
    return NextResponse.json({ error: message }, { status: bmRes.status });
  }

  return NextResponse.json({ success: true });
}
