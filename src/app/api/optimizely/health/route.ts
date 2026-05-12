import { NextResponse } from "next/server";
import { getOptimizelyConnectionStatus } from "@/lib/cms";

export async function GET() {
  const status = await getOptimizelyConnectionStatus();

  return NextResponse.json(status, {
    status: status.providerEnabled && status.publicReachable ? 200 : 503,
  });
}
