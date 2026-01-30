import { MonitorStatus } from "@/types";

const STATUS_CONFIG: Record<
  MonitorStatus,
  { label: string; dotColor: string; bgColor: string; textColor: string }
> = {
  up: {
    label: "Up",
    dotColor: "bg-green-500",
    bgColor: "bg-green-900/30 border-green-800/50",
    textColor: "text-green-400",
  },
  down: {
    label: "Down",
    dotColor: "bg-red-500",
    bgColor: "bg-red-900/30 border-red-800/50",
    textColor: "text-red-400",
  },
  grace: {
    label: "Grace",
    dotColor: "bg-amber-500",
    bgColor: "bg-amber-900/30 border-amber-800/50",
    textColor: "text-amber-400",
  },
  paused: {
    label: "Paused",
    dotColor: "bg-zinc-500",
    bgColor: "bg-zinc-800/50 border-zinc-700/50",
    textColor: "text-zinc-400",
  },
  new: {
    label: "New",
    dotColor: "bg-blue-500",
    bgColor: "bg-blue-900/30 border-blue-800/50",
    textColor: "text-blue-400",
  },
};

export function StatusBadge({ status }: { status: MonitorStatus }) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.bgColor} ${config.textColor}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${config.dotColor} ${
          status === "up" ? "animate-pulse" : ""
        }`}
      />
      {config.label}
    </span>
  );
}
