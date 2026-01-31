"use client";

import { createBrowserSupabaseClient } from "@/lib/supabase";
import { ProBadge } from "@/components/ProBadge";
import { isPro } from "@/lib/subscription";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function DashboardNav({ userEmail }: { userEmail?: string }) {
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();
  const [isProUser, setIsProUser] = useState(false);

  useEffect(() => {
    setIsProUser(isPro());
  }, []);

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
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" fill="none" className="h-8 w-8">
                <defs>
                  <linearGradient id="cs-dash" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0d9488"/>
                    <stop offset="100%" stopColor="#059669"/>
                  </linearGradient>
                </defs>
                <path d="M120 28 L200 65 L200 130 C200 175 165 210 120 225 C75 210 40 175 40 130 L40 65 Z" fill="url(#cs-dash)"/>
                <path d="M120 44 L186 75 L186 130 C186 168 156 198 120 211 C84 198 54 168 54 130 L54 75 Z" fill="#ffffff" opacity="0.15"/>
                <circle cx="120" cy="125" r="45" fill="none" stroke="#ffffff" strokeWidth="5" opacity="0.9"/>
                <circle cx="120" cy="125" r="4" fill="#ffffff"/>
                <line x1="120" y1="125" x2="103" y2="100" stroke="#ffffff" strokeWidth="5" strokeLinecap="round"/>
                <line x1="120" y1="125" x2="145" y2="108" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round"/>
                <circle cx="158" cy="163" r="18" fill="#059669" stroke="#ffffff" strokeWidth="3"/>
                <polyline points="149,163 155,170 168,156" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Cron<span className="text-brand-400">Safe</span>
            </Link>
            <span className="hidden sm:block text-sm text-zinc-500">
              Dashboard
            </span>
            <ProBadge />
          </div>
          <div className="flex items-center gap-4">
            {!isProUser && (
              <Link
                href="/pricing"
                className="hidden sm:block text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors"
              >
                Upgrade to Pro
              </Link>
            )}
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
