"use client";
import { useEffect, useMemo, useState } from "react";
import { Alert, CircularProgress, Box, Typography } from "@mui/material";
import { getNotifications, Notification, NotificationType } from "../lib/api";
import { getViewed, markManyViewed } from "../lib/viewedStore";
import { topN } from "../lib/priority";
import { Log } from "campus-logging-middleware";
import NotificationCard from "../components/NotificationCard";
import FilterBar, { TypeFilter } from "../components/FilterBar";

export default function PriorityPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [type, setType] = useState<TypeFilter>("All");
  const [limit, setLimit] = useState<number>(10);
  const [viewed, setViewed] = useState<Set<string>>(new Set());

  useEffect(() => {
    Log("frontend", "info", "page", "PriorityPage mounted");
    setViewed(getViewed());
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setErr(null);
    (async () => {
      try {
        const params =
          type === "All" ? {} : { notification_type: type as NotificationType };
        const data = await getNotifications(params);
        if (!cancelled) setItems(data);
      } catch (e: any) {
        if (!cancelled) {
          setErr(e?.message ?? "Failed to load notifications");
          Log("frontend", "error", "page", `PriorityPage load failed: ${e?.message}`);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [type]);

  const ranked = useMemo(() => {
    // Priority Inbox = top-N of UNREAD notifications
    const unread = items.filter((i) => !viewed.has(i.ID));
    return topN(unread, limit);
  }, [items, limit, viewed]);

  // After a longer delay (so user can see them), mark as viewed
  useEffect(() => {
    if (!ranked.length) return;
    const t = setTimeout(() => {
      markManyViewed(ranked.map((i) => i.ID));
      setViewed(getViewed());
    }, 6000);
    return () => clearTimeout(t);
  }, [ranked]);

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
        Priority Inbox
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Top {limit} unread notifications, ranked by importance (Placement &gt; Result &gt; Event) and recency.
      </Typography>
      <FilterBar type={type} onType={setType} limit={limit} onLimit={setLimit} />
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {err && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {err}
        </Alert>
      )}
      {!loading && !err && ranked.length === 0 && (
        <Alert severity="success">
          You're all caught up — no unread priority notifications.
        </Alert>
      )}
      {ranked.map((n, i) => (
        <NotificationCard
          key={n.ID}
          n={n}
          isNew={!viewed.has(n.ID)}
          rank={i + 1}
        />
      ))}
    </Box>
  );
}
