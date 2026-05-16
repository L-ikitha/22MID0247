"use client";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const path = usePathname();
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "linear-gradient(90deg,#0f172a 0%,#1e293b 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Toolbar>
        <NotificationsActiveIcon sx={{ mr: 1, color: "#fbbf24" }} />
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 0.3 }}>
          Campus Notifications
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            component={Link}
            href="/"
            color="inherit"
            variant={path === "/" ? "outlined" : "text"}
            sx={{ borderColor: "rgba(255,255,255,0.3)" }}
          >
            All
          </Button>
          <Button
            component={Link}
            href="/priority"
            color="inherit"
            variant={path === "/priority" ? "outlined" : "text"}
            sx={{ borderColor: "rgba(255,255,255,0.3)" }}
          >
            Priority Inbox
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
