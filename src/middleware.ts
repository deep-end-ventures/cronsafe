import { updateSession } from "@/lib/supabase-middleware";
import { type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/ping (public ping endpoint)
     * - api/cron (cron endpoint - uses secret, not session)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/ping|api/cron|api/health|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
