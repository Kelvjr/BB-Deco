import { NextRequest, NextResponse } from "next/server";
import { getBackendBaseUrl } from "@/lib/backend-url";

export async function GET() {
  const base = getBackendBaseUrl();
  if (!base) {
    return NextResponse.json({ error: "API URL is not set." }, { status: 503 });
  }
  const res = await fetch(`${base}/announcements`, { cache: "no-store" });
  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: {
      "content-type":
        res.headers.get("content-type") || "application/json; charset=utf-8",
    },
  });
}

export async function POST(req: NextRequest) {
  const base = getBackendBaseUrl();
  if (!base) {
    return NextResponse.json({ error: "API URL is not set." }, { status: 503 });
  }
  const body = await req.text();
  const res = await fetch(`${base}/announcements`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
    cache: "no-store",
  });
  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: {
      "content-type":
        res.headers.get("content-type") || "application/json; charset=utf-8",
    },
  });
}
