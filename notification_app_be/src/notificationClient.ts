import axios from "axios";
import { Log } from "campus-logging-middleware";

const NOTIF_API = "http://4.224.186.213/evaluation-service/notifications";

export interface Notification {
  ID: string;
  Type: "Placement" | "Result" | "Event";
  Message: string;
  Timestamp: string; // "YYYY-MM-DD HH:mm:ss"
}

export async function fetchNotifications(token: string): Promise<Notification[]> {
  await Log("backend", "info", "service", "fetchNotifications: requesting list");
  try {
    const res = await axios.get(NOTIF_API, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 8000,
    });
    const list: Notification[] = res.data?.notifications ?? [];
    await Log("backend", "info", "service", `fetchNotifications: received ${list.length} items`);
    return list;
  } catch (err: any) {
    await Log("backend", "error", "service", `fetchNotifications failed: ${err?.message ?? "unknown"}`);
    throw err;
  }
}
