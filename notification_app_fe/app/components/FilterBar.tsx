"use client";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

export type TypeFilter = "All" | "Placement" | "Result" | "Event";

export default function FilterBar({
  type,
  onType,
  limit,
  onLimit,
  showLimit = true,
}: {
  type: TypeFilter;
  onType: (t: TypeFilter) => void;
  limit?: number;
  onLimit?: (n: number) => void;
  showLimit?: boolean;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "center",
        p: 2,
        mb: 2,
        borderRadius: 2,
        backgroundColor: "#f8fafc",
        border: "1px solid #e2e8f0",
      }}
    >
      <Typography sx={{ fontWeight: 600 }}>Type:</Typography>
      <ToggleButtonGroup
        size="small"
        value={type}
        exclusive
        onChange={(_, v) => v && onType(v)}
      >
        {(["All", "Placement", "Result", "Event"] as TypeFilter[]).map((t) => (
          <ToggleButton key={t} value={t}>
            {t}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      {showLimit && onLimit !== undefined && limit !== undefined && (
        <>
          <Typography sx={{ fontWeight: 600, ml: 2 }}>Show top:</Typography>
          <Select
            size="small"
            value={limit}
            onChange={(e) => onLimit(Number(e.target.value))}
          >
            {[10, 15, 20, 25].map((n) => (
              <MenuItem key={n} value={n}>
                {n}
              </MenuItem>
            ))}
          </Select>
        </>
      )}
    </Box>
  );
}
