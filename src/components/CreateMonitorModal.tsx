"use client";

import { IntervalUnit } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CreateMonitorModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [intervalValue, setIntervalValue] = useState(1);
  const [intervalUnit, setIntervalUnit] = useState<IntervalUnit>("hours");
  const [graceValue, setGraceValue] = useState(5);
  const [graceUnit, setGraceUnit] = useState<IntervalUnit>("minutes");
  const [alertEmail, setAlertEmail] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState("");

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/monitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          interval_value: intervalValue,
          interval_unit: intervalUnit,
          grace_value: graceValue,
          grace_unit: graceUnit,
          alert_email: alertEmail,
          webhook_url: webhookUrl || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create monitor");
      }

      // Reset form
      setName("");
      setIntervalValue(1);
      setIntervalUnit("hours");
      setGraceValue(5);
      setGraceUnit("minutes");
      setAlertEmail(true);
      setWebhookUrl("");

      onClose();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            Create New Monitor
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Monitor Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Nightly DB Backup"
              required
              maxLength={100}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
            />
          </div>

          {/* Expected Interval */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Expected Interval
            </label>
            <p className="text-xs text-zinc-500 mb-2">
              How often should this job ping?
            </p>
            <div className="flex gap-3">
              <input
                type="number"
                min={1}
                max={999}
                value={intervalValue}
                onChange={(e) => setIntervalValue(Number(e.target.value))}
                required
                className="w-24 rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
              />
              <select
                value={intervalUnit}
                onChange={(e) =>
                  setIntervalUnit(e.target.value as IntervalUnit)
                }
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
              >
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </select>
            </div>
          </div>

          {/* Grace Period */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Grace Period
            </label>
            <p className="text-xs text-zinc-500 mb-2">
              How long to wait before alerting after a missed ping?
            </p>
            <div className="flex gap-3">
              <input
                type="number"
                min={0}
                max={999}
                value={graceValue}
                onChange={(e) => setGraceValue(Number(e.target.value))}
                required
                className="w-24 rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
              />
              <select
                value={graceUnit}
                onChange={(e) => setGraceUnit(e.target.value as IntervalUnit)}
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
              >
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </select>
            </div>
          </div>

          {/* Alert Email */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="alertEmail"
              checked={alertEmail}
              onChange={(e) => setAlertEmail(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-brand-600 focus:ring-brand-500"
            />
            <label htmlFor="alertEmail" className="text-sm text-zinc-300">
              Send email alerts when this monitor goes down
            </label>
          </div>

          {/* Webhook URL */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Webhook URL{" "}
              <span className="text-zinc-500 font-normal">(optional)</span>
            </label>
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://discord.com/api/webhooks/..."
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
            />
            <p className="mt-1 text-xs text-zinc-500">
              Discord or Slack webhook URL for instant notifications.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="rounded-lg border border-red-800 bg-red-900/30 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name}
              className="flex-1 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Monitor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
