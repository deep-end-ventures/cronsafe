"use client";

import { Monitor } from "@/types";
import { MonitorCard } from "./MonitorCard";
import { CreateMonitorModal } from "./CreateMonitorModal";
import { useState } from "react";

export function DashboardContent({ monitors }: { monitors: Monitor[] }) {
  const [showCreate, setShowCreate] = useState(false);

  const upCount = monitors.filter((m) => m.status === "up" && !m.is_paused).length;
  const downCount = monitors.filter((m) => m.status === "down" && !m.is_paused).length;
  const graceCount = monitors.filter((m) => m.status === "grace" && !m.is_paused).length;
  const pausedCount = monitors.filter((m) => m.is_paused).length;

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="text-2xl font-bold text-white">{monitors.length}</div>
          <div className="text-xs text-zinc-500 mt-1">Total Monitors</div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="text-2xl font-bold text-green-400">{upCount}</div>
          <div className="text-xs text-zinc-500 mt-1">Up</div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="text-2xl font-bold text-red-400">{downCount}</div>
          <div className="text-xs text-zinc-500 mt-1">Down</div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="text-2xl font-bold text-amber-400">
            {graceCount}
          </div>
          <div className="text-xs text-zinc-500 mt-1">In Grace</div>
        </div>
      </div>

      {/* Header + Create button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-white">Your Monitors</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500 transition-colors flex items-center gap-2"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Monitor
        </button>
      </div>

      {/* Monitor list */}
      {monitors.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-zinc-800 p-12 text-center">
          <div className="text-4xl mb-4">📡</div>
          <h3 className="text-lg font-semibold text-white mb-2">
            No monitors yet
          </h3>
          <p className="text-sm text-zinc-400 mb-6 max-w-sm mx-auto">
            Create your first monitor to start tracking your cron jobs. You'll
            get a unique ping URL to add to your scripts.
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-500 transition-colors"
          >
            Create Your First Monitor
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {monitors.map((monitor) => (
            <MonitorCard key={monitor.id} monitor={monitor} />
          ))}
        </div>
      )}

      <CreateMonitorModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
      />
    </>
  );
}
