import { draftMode } from "next/headers";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");
  const slug = url.searchParams.get("slug") ?? "/en";
  const previewSecret = process.env.PREVIEW_SECRET ?? "local-preview-secret";

  if (secret !== previewSecret) {
    return new Response("Invalid preview secret", { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  return Response.redirect(new URL(slug, request.url));
}