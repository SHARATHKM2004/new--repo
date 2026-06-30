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

  if (!conferenceId || !firstName?.trim() || !lastName?.trim() || !email?.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(conferenceId)) {
    return NextResponse.json({ error: "Invalid conference ID" }, { status: 400 });
  }

  let customFields: Record<string, string> = {};
  try {
    const cfRes = await fetch(
      `https://web.bigmarker.com/api/v1/conferences/custom_fields/${conferenceId}`,
      { headers: { "API-KEY": apiKey } }
    );
    if (cfRes.ok) {
      const fields = (await cfRes.json()) as { id: string; field_name?: string; api_name?: string }[];
      for (const field of fields) {
        const name = (field.field_name ?? field.api_name ?? "").toLowerCase();
        if (name.includes("job") || (name.includes("title") && !name.includes("webinar"))) {
          customFields[field.id] = jobTitle?.trim() ?? "";
        } else if (name.includes("organization") && !name.includes("industry")) {
          customFields[field.id] = organization?.trim() ?? "";
        } else if (name.includes("industry")) {
          customFields[field.id] = organizationIndustry?.trim() ?? "";
        }
      }
    }
  } catch {
    customFields = {};
  }

  const params = new URLSearchParams({
    id: conferenceId,
    email: email.trim().toLowerCase(),
    first_name: firstName.trim(),
    last_name: lastName.trim(),
    custom_fields: JSON.stringify(customFields),
  });

  const bmRes = await fetch("https://web.bigmarker.com/api/v1/conferences/register", {
    method: "PUT",
    headers: {
      "API-KEY": apiKey,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
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
