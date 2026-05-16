import { Notification } from "./api";

const W: Record<string, number> = { Placement: 1_000_000, Result: 100_000, Event: 10_000 };

export function score(n: Notification, now = Date.now()): number {
  const ts = Date.parse(n.Timestamp.replace(" ", "T") + "Z");
  const ageSec = Math.max(0, (now - ts) / 1000);
  return (W[n.Type] ?? 0) + 1 / (1 + ageSec);
}

export function topN(list: Notification[], n: number): Notification[] {
  return [...list].sort((a, b) => score(b) - score(a)).slice(0, n);
}
