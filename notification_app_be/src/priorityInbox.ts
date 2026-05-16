import { Log } from "campus-logging-middleware";
import { Notification } from "./notificationClient";

/**
 * Type weights — placement > result > event, per product spec.
 * Gap between tiers is large enough that any newer Event can never outrank an older Result,
 * and any newer Result can never outrank an older Placement.
 */
const TYPE_WEIGHT: Record<string, number> = {
  Placement: 1_000_000,
  Result:      100_000,
  Event:        10_000,
};

/**
 * priority = typeWeight + recencyComponent
 * recencyComponent = 1 / (1 + ageInSeconds) — bounded in (0, 1], so within a type,
 * newer always beats older; across types, the categorical weight always dominates.
 */
export function priorityScore(n: Notification, nowMs: number = Date.now()): number {
  const typeW = TYPE_WEIGHT[n.Type] ?? 0;
  const ts = Date.parse(n.Timestamp.replace(" ", "T") + "Z");
  const ageSec = Math.max(0, (nowMs - ts) / 1000);
  const recency = 1 / (1 + ageSec);
  return typeW + recency;
}

/**
 * Size-K min-heap. Used to maintain the top-K highest-priority items while only ever
 * holding K elements in memory — critical when notifications keep streaming in.
 *   - offer():  O(log K)
 *   - top-K over N items: O(N log K) time, O(K) space (independent of N)
 */
class MinHeap {
  private data: { score: number; n: Notification }[] = [];
  constructor(private readonly capacity: number) {}

  size(): number { return this.data.length; }

  offer(score: number, n: Notification): boolean {
    if (this.data.length < this.capacity) {
      this.data.push({ score, n });
      this.bubbleUp(this.data.length - 1);
      return true;
    }
    if (score > this.data[0].score) {
      this.data[0] = { score, n };
      this.bubbleDown(0);
      return true;
    }
    return false;
  }

  toSortedDesc(): Notification[] {
    return [...this.data].sort((a, b) => b.score - a.score).map(x => x.n);
  }

  private bubbleUp(i: number) {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.data[p].score <= this.data[i].score) break;
      [this.data[p], this.data[i]] = [this.data[i], this.data[p]];
      i = p;
    }
  }

  private bubbleDown(i: number) {
    const n = this.data.length;
    while (true) {
      const l = 2 * i + 1, r = 2 * i + 2;
      let s = i;
      if (l < n && this.data[l].score < this.data[s].score) s = l;
      if (r < n && this.data[r].score < this.data[s].score) s = r;
      if (s === i) break;
      [this.data[i], this.data[s]] = [this.data[s], this.data[i]];
      i = s;
    }
  }
}

/**
 * Batch top-K: scan all unread once, push into a size-K min-heap, return sorted desc.
 */
export async function topKPriority(unread: Notification[], k: number = 10): Promise<Notification[]> {
  await Log("backend", "debug", "domain", `topKPriority: k=${k}, input=${unread.length}`);
  if (k <= 0 || unread.length === 0) return [];

  const now = Date.now();
  const heap = new MinHeap(k);
  for (const n of unread) {
    if (!(n.Type in TYPE_WEIGHT)) {
      await Log("backend", "warn", "domain", `topKPriority: unknown type "${n.Type}" id=${n.ID}`);
      continue;
    }
    heap.offer(priorityScore(n, now), n);
  }
  const result = heap.toSortedDesc();
  await Log("backend", "info", "domain", `topKPriority: produced ${result.length} items`);
  return result;
}

/**
 * Streaming variant — one persistent heap. Each new notification is an O(log K) ingest.
 * Call ingest(n) as notifications arrive; call snapshot() to read the current top-K.
 */
export class PriorityInboxStream {
  private heap: MinHeap;
  constructor(private readonly k: number = 10) {
    this.heap = new MinHeap(k);
  }
  async ingest(n: Notification): Promise<void> {
    const accepted = this.heap.offer(priorityScore(n), n);
    await Log("backend", "debug", "domain",
      `PriorityInboxStream.ingest id=${n.ID} type=${n.Type} accepted=${accepted}`);
  }
  snapshot(): Notification[] { return this.heap.toSortedDesc(); }
}
