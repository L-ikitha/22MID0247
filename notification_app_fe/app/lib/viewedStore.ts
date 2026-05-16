import { Log } from "campus-logging-middleware";

const KEY = "campus_viewed_notification_ids";

export function getViewed(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(KEY);
    return new Set<string>(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

export function markManyViewed(ids: string[]): void {
  if (typeof window === "undefined") return;
  const s = getViewed();
  let changed = false;
  ids.forEach((id) => {
    if (!s.has(id)) {
      s.add(id);
      changed = true;
    }
  });
  if (changed) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify([...s]));
      Log("frontend", "debug", "state", `markManyViewed: now tracking ${s.size} ids`);
    } catch (e: any) {
      Log("frontend", "warn", "state", `markManyViewed failed: ${e?.message}`);
    }
  }
}
