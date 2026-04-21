import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/signup"];

function isPublicRoute(req: NextRequest): boolean {
  const pathname = req.nextUrl.pathname;
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function clerkConfigured(): boolean {
  return Boolean(
    process.env.CLERK_SECRET_KEY?.trim() &&
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim(),
  );
}

function configErrorResponse(): NextResponse {
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Configuration</title></head><body style="font-family:system-ui;padding:2rem;max-width:36rem">
<h1>Clerk is not configured</h1>
<p>Add <strong>CLERK_SECRET_KEY</strong> and <strong>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</strong> to this deployment (e.g. Vercel → Project → Settings → Environment Variables), then redeploy.</p>
</body></html>`;
  return new NextResponse(html, {
    status: 503,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

/** Do not invoke Clerk when keys are missing — avoids Edge 500 MIDDLEWARE_INVOCATION_FAILED. */
export default function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (!clerkConfigured()) {
    if (isPublicRoute(req)) {
      return NextResponse.next();
    }
    return configErrorResponse();
  }

  return (async () => {
    try {
      const { clerkMiddleware } = await import("@clerk/nextjs/server");
      return clerkMiddleware(async (auth, innerReq) => {
        const { userId } = await auth();

        if (userId && isPublicRoute(innerReq)) {
          return NextResponse.redirect(new URL("/", innerReq.url));
        }

        if (!isPublicRoute(innerReq)) {
          await auth.protect();
        }
      })(req, ev);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown middleware error";
      return new NextResponse(`Middleware failed to initialize: ${msg}`, {
        status: 503,
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }
  })();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
