import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SubscribeBody = {
  email?: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  company?: string;
  emailsConsent?: boolean;
  topics?: string[];
};

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

async function getCmaAccessToken() {
  const authoringUrl = process.env.OPTIMIZELY_AUTHORING_URL?.trim().replace(/\/$/, "");
  const clientId = process.env.OPTIMIZELY_CMA_CLIENT_ID?.trim();
  const clientSecret = process.env.OPTIMIZELY_CMA_CLIENT_SECRET?.trim();

  if (!authoringUrl || !clientId || !clientSecret) {
    throw new Error("Missing Optimizely CMA env vars");
  }

  const tokenRes = await fetch(`${authoringUrl}/_cms/preview2/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
    cache: "no-store",
  });

  if (!tokenRes.ok) {
    const text = await tokenRes.text();
    throw new Error(`OAuth failed (${tokenRes.status}): ${text}`);
  }

  const json = (await tokenRes.json()) as { access_token?: string };
  if (!json.access_token) {
    throw new Error("OAuth returned no access_token");
  }
  return { token: json.access_token, authoringUrl };
}

export async function POST(request: Request) {
  let body: SubscribeBody;
  try {
    body = (await request.json()) as SubscribeBody;
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const email = body.email?.trim() ?? "";
  const firstName = body.firstName?.trim() ?? "";
  const lastName = body.lastName?.trim() ?? "";
  const jobTitle = body.jobTitle?.trim() ?? "";
  const company = body.company?.trim() ?? "";
  const emailsConsent = Boolean(body.emailsConsent);
  const topics = Array.isArray(body.topics) ? body.topics.filter(Boolean) : [];

  if (!email || !firstName || !lastName || !jobTitle || !company) {
    return NextResponse.json({ message: "All fields are required." }, { status: 400 });
  }
  if (!isEmail(email)) {
    return NextResponse.json({ message: "Invalid email." }, { status: 400 });
  }

  const container = process.env.OPTIMIZELY_SUBSCRIBERS_CONTAINER?.trim();
  if (!container) {
    return NextResponse.json(
      { message: "Server not configured: subscribers container missing" },
      { status: 500 },
    );
  }

  let token: string;
  let authoringUrl: string;
  try {
    const auth = await getCmaAccessToken();
    token = auth.token;
    authoringUrl = auth.authoringUrl;
  } catch (err) {
    console.error("[subscribe] token error", err);
    return NextResponse.json({ message: "Auth failure" }, { status: 502 });
  }

  const submittedAt = new Date().toISOString();
  const displayName = `${firstName} ${lastName} <${email}>`.slice(0, 200);

  const payload = {
    contentType: "Subscriber",
    container,
    displayName,
    locale: "en",
    status: "Published",
    properties: {
      Email: email,
      FirstName: firstName,
      LastName: lastName,
      JobTitle: jobTitle,
      Company: company,
      EmailsConsent: emailsConsent ? "true" : "false",
      Topics: topics.join(", "),
      SubmittedAt: submittedAt,
    },
  };

  const createRes = await fetch(`${authoringUrl}/_cms/preview2/contentmanagement/content`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!createRes.ok) {
    const text = await createRes.text();
    console.error("[subscribe] create failed", createRes.status, text);
    return NextResponse.json(
      { message: "CMS write failed", status: createRes.status, detail: text },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
