"use client";

import { Monitor, formatInterval, secondsToHuman } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="rounded p-1 text-zinc-500 hover:bg-zinc-700 hover:text-zinc-300 transition-colors"
      title="Copy ping URL"
    >
      {copied ? (
        <svg
          className="h-4 w-4 text-green-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : (
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
          />
        </svg>
      )}
    </button>
  );
}

export function MonitorCard({ monitor }: { monitor: Monitor }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toggling, setToggling] = useState(false);

  const appUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "https://cronsafe.dev";

  const pingUrl = `${appUrl}/api/ping/${monitor.slug}`;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/monitors/${monitor.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  const handleTogglePause = async () => {
    setToggling(true);
    try {
      await fetch(`/api/monitors/${monitor.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_paused: !monitor.is_paused }),
      });
      router.refresh();
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-semibold text-white truncate">
              {monitor.name}
            </h3>
            <StatusBadge status={monitor.is_paused ? "paused" : monitor.status} />
          </div>

          {/* Ping URL */}
          <div className="flex items-center gap-1 mt-2">
            <code className="text-xs text-zinc-500 font-mono truncate">
              {pingUrl}
            </code>
            <CopyButton text={pingUrl} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleTogglePause}
            disabled={toggling}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
            title={monitor.is_paused ? "Resume" : "Pause"}
          >
            {monitor.is_paused ? (
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </button>

          {showConfirm ? (
            <div className="flex items-center gap-1">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg px-2 py-1 text-xs font-medium bg-red-600 text-white hover:bg-red-500"
              >
                {deleting ? "..." : "Confirm"}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="rounded-lg px-2 py-1 text-xs font-medium text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirm(true)}
              className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-red-400 transition-colors"
              title="Delete"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
        <div>
          <span className="text-zinc-500">Interval</span>
          <p className="mt-0.5 font-medium text-zinc-300">
            {formatInterval(monitor.interval_seconds)}
          </p>
        </div>
        <div>
          <span className="text-zinc-500">Grace</span>
          <p className="mt-0.5 font-medium text-zinc-300">
            {secondsToHuman(monitor.grace_seconds)}
          </p>
        </div>
        <div>
          <span className="text-zinc-500">Last Ping</span>
          <p className="mt-0.5 font-medium text-zinc-300">
            {monitor.last_ping_at
              ? formatDistanceToNow(new Date(monitor.last_ping_at), {
                  addSuffix: true,
                })
              : "Never"}
          </p>
        </div>
      </div>

      {/* Alerts config */}
      <div className="mt-3 flex items-center gap-3 text-xs text-zinc-500">
        {monitor.alert_email && (
          <span className="flex items-center gap-1">
            <svg
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Email
          </span>
        )}
        {monitor.webhook_url && (
          <span className="flex items-center gap-1">
            <svg
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            Webhook
          </span>
        )}
      </div>
    </div>
  );
}
