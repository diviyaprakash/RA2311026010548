import React from "react";
import {
  Card, CardContent, Typography, Chip, Box, Button,
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import EventIcon from "@mui/icons-material/Event";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const TYPE_CONFIG = {
  Placement: {
    bg: "#e8f5e9",
    border: "#43a047",
    chipColor: "success",
    icon: <WorkIcon fontSize="small" />,
  },
  Result: {
    bg: "#fff8e1",
    border: "#fb8c00",
    chipColor: "warning",
    icon: <AssignmentIcon fontSize="small" />,
  },
  Event: {
    bg: "#e3f2fd",
    border: "#1e88e5",
    chipColor: "info",
    icon: <EventIcon fontSize="small" />,
  },
};

export default function NotificationCard({ notification, onMarkRead }) {
  const cfg = TYPE_CONFIG[notification.type] ?? {
    bg: "#f5f5f5", border: "#9e9e9e", chipColor: "default", icon: null,
  };
  const isNew = !notification.isRead;

  const date = notification.createdAt
    ? new Date(notification.createdAt).toLocaleString()
    : "";

  return (
    <Card
      elevation={isNew ? 2 : 0}
      sx={{
        mb: 1.5,
        borderRadius: 2,
        border: "1px solid",
        borderColor: isNew ? cfg.border : "#e0e0e0",
        backgroundColor: isNew ? cfg.bg : "#fafafa",
        transition: "all 0.2s",
        "&:hover": { elevation: 4, transform: "translateY(-1px)" },
      }}
    >
      <CardContent sx={{ p: "14px 16px !important" }}>
        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
          <Chip
            icon={cfg.icon}
            label={notification.type}
            color={cfg.chipColor}
            size="small"
            sx={{ fontWeight: 600 }}
          />
          {isNew && (
            <Box display="flex" alignItems="center" gap={0.3}>
              <FiberManualRecordIcon sx={{ fontSize: 10, color: "#1e88e5" }} />
              <Typography variant="caption" color="primary" fontWeight={700}>
                NEW
              </Typography>
            </Box>
          )}
          <Typography variant="caption" color="text.secondary" ml="auto">
            {date}
          </Typography>
        </Box>

        <Typography
          variant="body1"
          fontWeight={isNew ? 600 : 400}
          mt={1}
          color={isNew ? "text.primary" : "text.secondary"}
        >
          {notification.message}
        </Typography>

        {isNew && onMarkRead && (
          <Button
            size="small"
            variant="outlined"
            sx={{ mt: 1.5, textTransform: "none", borderRadius: 2 }}
            onClick={() => onMarkRead(notification.id)}
          >
            Mark as Read
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
