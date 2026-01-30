"use client";

import { createBrowserSupabaseClient } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function DashboardNav({ userEmail }: { userEmail?: string }) {
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-bold text-white">
              ⏱ Cron<span className="text-brand-400">Safe</span>
            </Link>
            <span className="hidden sm:block text-sm text-zinc-500">
              Dashboard
            </span>
          </div>
          <div className="flex items-center gap-4">
            {userEmail && (
              <span className="hidden sm:block text-sm text-zinc-400 truncate max-w-[200px]">
                {userEmail}
              </span>
            )}
            <button
              onClick={handleSignOut}
              className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
