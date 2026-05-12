import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getOptimizelyRevalidationTags } from "@/lib/cms";
import type { OptimizelyWebhookPayload } from "@/lib/cms/types";

export async function POST(request: Request) {
  const expectedSecret = process.env.REVALIDATE_SECRET ?? "local-revalidate-secret";
  const providedSecret =
    request.headers.get("x-webhook-secret") ?? new URL(request.url).searchParams.get("secret");

  if (providedSecret !== expectedSecret) {
    return NextResponse.json({ message: "Invalid webhook secret." }, { status: 401 });
  }

  const payload = (await request.json()) as OptimizelyWebhookPayload;
  const tags = getOptimizelyRevalidationTags();

  revalidatePath("/");
  revalidatePath("/en");
  revalidatePath("/es");

  for (const tag of tags) {
    revalidateTag(tag, { expire: 0 });
  }

  return NextResponse.json({
    ok: true,
    eventId: payload.id ?? null,
    subject: payload.type?.subject ?? null,
    action: payload.type?.action ?? null,
    tags,
  });
}