import { setAuthToken, Log } from "campus-logging-middleware";
import { fetchNotifications } from "./notificationClient";
import { topKPriority } from "./priorityInbox";

const TOKEN = process.env.EVAL_TOKEN ?? "";

async function main() {
  if (!TOKEN) {
    process.stderr.write("Set EVAL_TOKEN env var to your bearer access_token\n");
    process.exit(1);
  }
  setAuthToken(TOKEN);
  await Log("backend", "info", "service", "Priority Inbox: application starting");

  try {
    const notifications = await fetchNotifications(TOKEN);
    const top10 = await topKPriority(notifications, 10);

    process.stdout.write("\n╔══════════════════════════════════════════════════════════════╗\n");
    process.stdout.write("║          TOP 10 PRIORITY NOTIFICATIONS                       ║\n");
    process.stdout.write("╚══════════════════════════════════════════════════════════════╝\n\n");
    top10.forEach((n, i) => {
      const tag = n.Type.padEnd(10);
      process.stdout.write(
        `${String(i + 1).padStart(2)}. [${tag}] ${n.Timestamp}  ${n.Message}\n`
      );
    });
    process.stdout.write("\n");

    await Log("backend", "info", "service", "Priority Inbox: completed successfully");
  } catch (err: any) {
    await Log("backend", "fatal", "service", `Priority Inbox crashed: ${err?.message}`);
    process.exit(1);
  }
}

main();
