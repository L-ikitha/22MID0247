"use client";
import { Card, CardContent, Chip, Typography, Box } from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EventIcon from "@mui/icons-material/Event";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import { Notification } from "../lib/api";

const TYPE_META: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  Placement: { color: "#065f46", bg: "#d1fae5", icon: <WorkIcon fontSize="small" /> },
  Result:    { color: "#9a3412", bg: "#ffedd5", icon: <AssignmentIcon fontSize="small" /> },
  Event:     { color: "#1e3a8a", bg: "#dbeafe", icon: <EventIcon fontSize="small" /> },
};

export default function NotificationCard({
  n,
  isNew,
  rank,
}: {
  n: Notification;
  isNew: boolean;
  rank?: number;
}) {
  const meta = TYPE_META[n.Type] ?? TYPE_META.Event;
  return (
    <Card
      variant="outlined"
      sx={{
        mb: 1.5,
        borderLeft: `4px solid ${meta.color}`,
        backgroundColor: isNew ? "#fffbeb" : "#ffffff",
        transition: "transform .15s ease, box-shadow .15s ease",
        "&:hover": { transform: "translateY(-1px)", boxShadow: 3 },
      }}
    >
      <CardContent sx={{ "&:last-child": { pb: 2 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, flexWrap: "wrap" }}>
          {rank !== undefined && (
            <Chip
              label={`#${rank}`}
              size="small"
              sx={{ fontWeight: 700, backgroundColor: "#0f172a", color: "#fff" }}
            />
          )}
          <Chip
            icon={meta.icon as any}
            label={n.Type}
            size="small"
            sx={{ backgroundColor: meta.bg, color: meta.color, fontWeight: 600 }}
          />
          {isNew && (
            <Chip
              icon={<FiberNewIcon />}
              label="NEW"
              size="small"
              color="warning"
              sx={{ fontWeight: 700 }}
            />
          )}
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="caption" color="text.secondary">
            {n.Timestamp}
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ fontWeight: isNew ? 600 : 400 }}>
          {n.Message}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 0.5, wordBreak: "break-all" }}
        >
          ID: {n.ID}
        </Typography>
      </CardContent>
    </Card>
  );
}
