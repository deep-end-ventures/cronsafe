"use client";

import { useState } from "react";

interface EmailCaptureProps {
  variant?: "card" | "inline";
  heading?: string;
  subheading?: string;
  source?: string;
}

export default function EmailCapture({
  variant = "card",
  heading = "Get DevOps Insights Delivered",
  subheading = "Cron monitoring tips, reliability patterns, and product updates. No spam — unsubscribe anytime.",
  source = "homepage",
}: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Failed to subscribe");
    }
  };

  if (status === "success") {
    return (
      <div
        className={
          variant === "card"
            ? "rounded-2xl border border-brand-500/30 bg-brand-500/5 p-8 text-center"
            : "rounded-xl bg-brand-500/5 border border-brand-500/20 p-4 text-center"
        }
      >
        <div className="text-2xl mb-2">✅</div>
        <p className="text-white font-semibold">You&apos;re subscribed!</p>
        <p className="text-zinc-400 text-sm mt-1">
          Check your inbox for a welcome email.
        </p>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className="rounded-xl bg-zinc-900/50 border border-zinc-800 p-4">
        <p className="text-sm font-medium text-white mb-2">{heading}</p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
            className="flex-1 rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500 transition-colors"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500 disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            {status === "loading" ? "..." : "Subscribe"}
          </button>
        </form>
        {status === "error" && (
          <p className="text-red-400 text-xs mt-2">{errorMsg}</p>
        )}
      </div>
    );
  }

  // Card variant (default)
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 text-center">
      <div className="text-3xl mb-3">📬</div>
      <h3 className="text-xl font-bold text-white mb-2">{heading}</h3>
      <p className="text-zinc-400 text-sm mb-6 max-w-md mx-auto">{subheading}</p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          required
          className="flex-1 rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500 transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-500 disabled:opacity-50 transition-colors whitespace-nowrap"
        >
          {status === "loading" ? "Subscribing..." : "Subscribe →"}
        </button>
      </form>
      {status === "error" && (
        <p className="text-red-400 text-sm mt-3">{errorMsg}</p>
      )}
      <p className="text-zinc-600 text-xs mt-4">
        No spam. Unsubscribe anytime. We respect your inbox.
      </p>
    </div>
  );
}
