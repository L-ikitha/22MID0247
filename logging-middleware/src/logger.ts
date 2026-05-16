import axios from "axios";

const LOG_API = "http://4.224.186.213/evaluation-service/logs";

export type Stack = "backend" | "frontend";
export type Level = "debug" | "info" | "warn" | "error" | "fatal";

const BACKEND_PKGS = ["cache", "controller", "cron_job", "db", "domain", "route", "service"];
const FRONTEND_PKGS = ["api", "component", "hook", "page", "state", "style"];
const SHARED_PKGS = ["auth", "config", "middleware", "utils"];

let authToken: string | null = null;

/** Call once at app startup to set the bearer token used by the log API. */
export function setAuthToken(token: string): void {
  authToken = token;
}

function isValidPackage(stack: Stack, pkg: string): boolean {
  if (SHARED_PKGS.includes(pkg)) return true;
  if (stack === "backend") return BACKEND_PKGS.includes(pkg);
  return FRONTEND_PKGS.includes(pkg);
}

/**
 * Reusable Log function — posts a structured log entry to the evaluation log service.
 * Signature: Log(stack, level, package, message).
 * Failures are swallowed; logging must never break the host application.
 */
export async function Log(
  stack: Stack,
  level: Level,
  pkg: string,
  message: string
): Promise<string | null> {
  if (!isValidPackage(stack, pkg)) return null;

  const body = {
    stack: stack.toLowerCase(),
    level: level.toLowerCase(),
    package: pkg.toLowerCase(),
    message: String(message),
  };

  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
    const res = await axios.post(LOG_API, body, { headers, timeout: 5000 });
    return res.data?.logID ?? null;
  } catch {
    return null;
  }
}
