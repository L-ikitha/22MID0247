"use client";
import { useEffect, useMemo, useState } from "react";
import { Alert, CircularProgress, Box, Typography } from "@mui/material";
import { getNotifications, Notification, NotificationType } from "./lib/api";
import { getViewed, markManyViewed } from "./lib/viewedStore";
import { Log } from "campus-logging-middleware";
import NotificationCard from "./components/NotificationCard";
import FilterBar, { TypeFilter } from "./components/FilterBar";

export default function AllPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [type, setType] = useState<TypeFilter>("All");
  const [viewed, setViewed] = useState<Set<string>>(new Set());

  useEffect(() => {
    Log("frontend", "info", "page", "AllPage mounted");
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
          Log("frontend", "error", "page", `AllPage load failed: ${e?.message}`);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [type]);

  // After a short delay, mark currently displayed notifications as viewed
  useEffect(() => {
    if (!items.length) return;
    const t = setTimeout(() => {
      markManyViewed(items.map((i) => i.ID));
      setViewed(getViewed());
    }, 4000);
    return () => clearTimeout(t);
  }, [items]);

  const sorted = useMemo(
    () =>
      [...items].sort((a, b) =>
        b.Timestamp.localeCompare(a.Timestamp)
      ),
    [items]
  );

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
        All Notifications
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Everything you've received, newest first. Yellow cards are unviewed.
      </Typography>
      <FilterBar type={type} onType={setType} showLimit={false} />
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
      {!loading && !err && sorted.length === 0 && (
        <Alert severity="info">No notifications match this filter.</Alert>
      )}
      {sorted.map((n) => (
        <NotificationCard key={n.ID} n={n} isNew={!viewed.has(n.ID)} />
      ))}
    </Box>
  );
}
