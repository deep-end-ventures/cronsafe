import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Server-side client using the anon key + cookie-based auth.
 * For use in Server Components and Route Handlers where we pass cookies.
 */
export function createServerSupabaseClient(cookieHeader?: string) {
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: cookieHeader
          ? { cookie: cookieHeader }
          : {},
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
  return client;
}

/**
 * Admin client using the service role key.
 * For cron jobs, ping endpoints, and other server-side operations
 * that bypass RLS.
 */
export function createAdminSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
