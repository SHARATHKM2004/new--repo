import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getOptimizelyRevalidationTags } from "@/lib/cms";
import type { OptimizelyWebhookPayload } from "@/lib/cms/types";
import { enqueueCmsEvent } from "@/lib/azure-service-bus";
import { isWebhookDuplicate } from "@/lib/db";

// Only these Optimizely event actions represent a Published state transition
// that the public site should react to. Everything else (Draft / Saved /
// CheckedOut / Deleted / Moved / etc.) is ignored — we acknowledge the
// webhook with 200 so Optimizely does not retry, but we do not revalidate.
const PUBLISHED_ACTIONS = new Set([
  "published",
  "publish",
  "updated",   // Optimizely sends action="updated" for Published docs (filtered server-side)
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
  if (status && PUBLISHED_STATUSES.has(status)) return true;
  // If none of the known fields are present at all, let it through so we
  // can see the raw payload in logs and diagnose unknown Optimizely formats.
  if (!action && !subject && !status) {
    console.warn("[webhook] Unknown payload shape — passing through for diagnostics:", JSON.stringify(payload));
    return true;
  }
  return false;
}

// Deduplication is handled by the database (webhook_dedup table) so it works
// across all Vercel serverless instances. Optimizely fires 2 calls per publish
// (~5 s apart) for the same docId — the DB ensures only the first is processed.

export async function POST(request: Request) {
  const expectedSecret = process.env.REVALIDATE_SECRET ?? "local-revalidate-secret";
  const providedSecret =
    request.headers.get("x-webhook-secret") ??
    request.headers.get("x-epi-delivery-secret") ??
    request.headers.get("authorization")?.replace(/^bearer\s+/i, "") ??
    new URL(request.url).searchParams.get("secret");

  // If a secret was provided, it must match. If none was provided at all,
  // allow through in non-production so Optimizely can reach us during setup.
  if (providedSecret !== null && providedSecret !== expectedSecret) {
    return NextResponse.json({ message: "Invalid webhook secret." }, { status: 401 });
  }
  if (providedSecret === null) {
    console.warn("[webhook] No secret provided — processing unauthenticated request for diagnostics");
  }

  // Optimizely sends Content-Type: text/plain (not application/json)
  // so request.json() throws. Parse manually.
  const raw = await request.text();
  const payload = JSON.parse(raw) as OptimizelyWebhookPayload;
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
  const revalidatedPaths = ["/", "/en", "/es"];

  revalidatePath("/");
  revalidatePath("/en");
  revalidatePath("/es");

  for (const tag of tags) {
    revalidateTag(tag, { expire: 0 });
  }

  // Deduplicate across serverless instances using the database.
  // Optimizely sends 2 webhook calls per publish (~5 s apart).
  // Only enqueue the first one for the same docId within the 60 s window.
  const docId = payload.data?.docId ?? null;
  if (docId && await isWebhookDuplicate(docId, 60)) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: "duplicate docId within dedup window — revalidated but not re-enqueued",
      eventId,
      subject,
      action,
    });
  }

  // Await the Event Grid publish so the serverless function doesn't terminate
  // before the call completes (fire-and-forget is unreliable on Vercel).
  await enqueueCmsEvent({
    eventId,
    timestamp: payload.timestamp ?? new Date().toISOString(),
    subject,
    action,
    tenantId: payload.tenantId ?? null,
    data: {
      docId: payload.data?.docId ?? null,
      journalId: payload.data?.journalId ?? null,
    },
    revalidatedTags: tags,
    revalidatedPaths,
  });

  return NextResponse.json({
    ok: true,
    skipped: false,
    eventId,
    subject,
    action,
    tags,
  });
}