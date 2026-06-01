import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getOptimizelyRevalidationTags } from "@/lib/cms";
import type { OptimizelyWebhookPayload } from "@/lib/cms/types";

// Only these Optimizely event actions represent a Published state transition
// that the public site should react to. Everything else (Draft / Saved /
// CheckedOut / Deleted / Moved / etc.) is ignored — we acknowledge the
// webhook with 200 so Optimizely does not retry, but we do not revalidate.
const PUBLISHED_ACTIONS = new Set([
  "published",
  "publish",
  "contentpublished",
  "contentversionpublished",
]);

const PUBLISHED_STATUSES = new Set(["published", "publish"]);

function normalize(value: string | undefined | null): string {
  return (value ?? "").trim().toLowerCase();
}

function isPublishedEvent(payload: OptimizelyWebhookPayload): boolean {
  const action = normalize(payload.type?.action);
  const subject = normalize(payload.type?.subject);
  const status = normalize(
    (payload as { status?: string; data?: { status?: string } }).status ??
      (payload as { data?: { status?: string } }).data?.status,
  );

  if (status && !PUBLISHED_STATUSES.has(status)) return false;
  if (action && PUBLISHED_ACTIONS.has(action)) return true;
  if (subject && PUBLISHED_ACTIONS.has(subject)) return true;
  // Fall back: if an explicit Published status is present, honour it even
  // when the action field is missing.
  return status ? PUBLISHED_STATUSES.has(status) : false;
}

export async function POST(request: Request) {
  const expectedSecret = process.env.REVALIDATE_SECRET ?? "local-revalidate-secret";
  const providedSecret =
    request.headers.get("x-webhook-secret") ?? new URL(request.url).searchParams.get("secret");

  if (providedSecret !== expectedSecret) {
    return NextResponse.json({ message: "Invalid webhook secret." }, { status: 401 });
  }

  const payload = (await request.json()) as OptimizelyWebhookPayload;
  const eventId = payload.id ?? null;
  const subject = payload.type?.subject ?? null;
  const action = payload.type?.action ?? null;

  if (!isPublishedEvent(payload)) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: "non-published event ignored",
      eventId,
      subject,
      action,
    });
  }

  const tags = getOptimizelyRevalidationTags();

  revalidatePath("/");
  revalidatePath("/en");
  revalidatePath("/es");

  for (const tag of tags) {
    revalidateTag(tag, { expire: 0 });
  }

  return NextResponse.json({
    ok: true,
    skipped: false,
    eventId,
    subject,
    action,
    tags,
  });
}