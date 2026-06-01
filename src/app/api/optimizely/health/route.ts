import { NextResponse } from "next/server";
import { getOptimizelyConnectionStatus } from "@/lib/cms";
import { requireBasicAuth } from "@/lib/api-auth";

export async function GET(request: Request) {
  const unauthorized = requireBasicAuth(request, "Optimizely Health");
  if (unauthorized) return unauthorized;

  const status = await getOptimizelyConnectionStatus();

  return NextResponse.json(status, {
    status: status.providerEnabled && status.publicReachable ? 200 : 503,
  });
}
