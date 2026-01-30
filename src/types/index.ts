export type MonitorStatus = "up" | "down" | "grace" | "paused" | "new";

export type IntervalUnit = "minutes" | "hours" | "days";

export interface Monitor {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  interval_seconds: number;
  grace_seconds: number;
  status: MonitorStatus;
  last_ping_at: string | null;
  next_expected_at: string | null;
  last_alert_at: string | null;
  alert_email: boolean;
  webhook_url: string | null;
  is_paused: boolean;
  created_at: string;
  updated_at: string;
}

export interface Ping {
  id: string;
  monitor_id: string;
  received_at: string;
  source_ip: string | null;
  user_agent: string | null;
}

export interface AlertLog {
  id: string;
  monitor_id: string;
  alert_type: "email" | "webhook";
  message: string;
  sent_at: string;
  success: boolean;
  error: string | null;
}

export interface CreateMonitorInput {
  name: string;
  interval_value: number;
  interval_unit: IntervalUnit;
  grace_value: number;
  grace_unit: IntervalUnit;
  alert_email: boolean;
  webhook_url?: string;
}

export interface MonitorWithStats extends Monitor {
  ping_count?: number;
  uptime_percentage?: number;
}

export function unitToSeconds(value: number, unit: IntervalUnit): number {
  switch (unit) {
    case "minutes":
      return value * 60;
    case "hours":
      return value * 3600;
    case "days":
      return value * 86400;
  }
}

export function secondsToHuman(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)}h`;
  return `${Math.round(seconds / 86400)}d`;
}

export function formatInterval(seconds: number): string {
  if (seconds % 86400 === 0) {
    const days = seconds / 86400;
    return `Every ${days} day${days > 1 ? "s" : ""}`;
  }
  if (seconds % 3600 === 0) {
    const hours = seconds / 3600;
    return `Every ${hours} hour${hours > 1 ? "s" : ""}`;
  }
  const minutes = Math.round(seconds / 60);
  return `Every ${minutes} minute${minutes > 1 ? "s" : ""}`;
}
