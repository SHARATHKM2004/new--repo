import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getOptimizelyRevalidationTags } from "@/lib/cms";

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<{
    secret: string;
    path: string;
    tags: string[];
  }>;
  const expectedSecret = process.env.REVALIDATE_SECRET ?? "local-revalidate-secret";

  if (body.secret !== expectedSecret) {
    return NextResponse.json({ message: "Invalid revalidation secret." }, { status: 401 });
  }

  const path = body.path?.trim() || "/en";
  const tags = Array.isArray(body.tags) ? body.tags.filter(Boolean) : [];
  const defaultTags = getOptimizelyRevalidationTags();

  revalidatePath(path);
  for (const tag of defaultTags) {
    revalidateTag(tag, { expire: 0 });
  }

  for (const tag of tags) {
    revalidateTag(tag, { expire: 0 });
  }

  return NextResponse.json({ revalidated: true, path, tags: [...defaultTags, ...tags] });
}