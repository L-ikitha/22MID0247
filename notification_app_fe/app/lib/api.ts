import axios from "axios";
import { Log, setAuthToken } from "campus-logging-middleware";

const BASE = "http://4.224.186.213/evaluation-service";
const TOKEN = process.env.NEXT_PUBLIC_EVAL_TOKEN || "";

if (TOKEN) setAuthToken(TOKEN);

export type NotificationType = "Placement" | "Result" | "Event";

export interface Notification {
  ID: string;
  Type: NotificationType;
  Message: string;
  Timestamp: string;
}

export interface FetchParams {
  limit?: number;
  page?: number;
  notification_type?: NotificationType;
}

export async function getNotifications(params?: FetchParams): Promise<Notification[]> {
  await Log("frontend", "info", "api", `getNotifications ${JSON.stringify(params ?? {})}`);
  try {
    const res = await axios.get(`${BASE}/notifications`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      params,
      timeout: 8000,
    });
    const list: Notification[] = res.data?.notifications ?? [];
    await Log("frontend", "info", "api", `getNotifications: received ${list.length}`);
    return list;
  } catch (err: any) {
    await Log("frontend", "error", "api", `getNotifications failed: ${err?.message}`);
    throw err;
  }
}
