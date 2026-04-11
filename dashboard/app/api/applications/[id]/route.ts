import { NextRequest, NextResponse } from "next/server";
import { getBackendBaseUrl } from "@/lib/backend-url";

async function proxy(
  id: string,
  init: RequestInit & { method?: string },
): Promise<NextResponse> {
  const base = getBackendBaseUrl();
  if (!base) {
    return NextResponse.json(
      {
        error:
          "Dashboard server is missing API_URL (or BACKEND_URL / NEXT_PUBLIC_API_URL). Set it to your Railway API base URL.",
      },
      { status: 503 },
    );
  }

  const url = `${base}/applications/${encodeURIComponent(id)}`;
  const res = await fetch(url, { ...init, cache: "no-store" });
  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: {
      "content-type":
        res.headers.get("content-type") || "application/json; charset=utf-8",
    },
  });
}

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  return proxy(id, { method: "GET" });
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const body = await req.text();
  return proxy(id, {
    method: "PATCH",
    headers: {
      "content-type":
        req.headers.get("content-type") || "application/json",
    },
    body,
  });
}
