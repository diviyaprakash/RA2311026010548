import React from "react";
import {
  Card, CardContent, Typography, Chip, Box, Button, Divider,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import EventIcon from "@mui/icons-material/Event";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentIcon from "@mui/icons-material/Assignment";

const TYPE_CONFIG = {
  Placement: { color: "success", icon: <SchoolIcon fontSize="small" /> },
  Result:    { color: "warning", icon: <AssignmentIcon fontSize="small" /> },
  Event:     { color: "info",    icon: <EventIcon fontSize="small" /> },
};

export default function NotificationCard({ notification, onMarkRead }) {
  const cfg = TYPE_CONFIG[notification.type] ?? { color: "default", icon: <NotificationsActiveIcon fontSize="small" /> };
  const isNew = !notification.isRead;

  return (
    <Card
      elevation={isNew ? 3 : 1}
      sx={{
        mb: 1.5,
        borderLeft: isNew ? "4px solid" : "4px solid transparent",
        borderLeftColor: isNew ? `${cfg.color}.main` : "transparent",
        opacity: isNew ? 1 : 0.72,
        transition: "all 0.2s",
      }}
    >
      <CardContent sx={{ pb: "12px !important" }}>
        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
          <Chip
            icon={cfg.icon}
            label={notification.type}
            color={cfg.color}
            size="small"
            variant="outlined"
          />
          {isNew && (
            <Chip label="NEW" color="primary" size="small" sx={{ fontWeight: 700, fontSize: 10 }} />
          )}
          <Typography variant="caption" color="text.secondary" ml="auto">
            {new Date(notification.createdAt).toLocaleString()}
          </Typography>
        </Box>

        <Typography variant="subtitle1" fontWeight={600} mt={0.5}>
          {notification.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {notification.message}
        </Typography>

        {isNew && onMarkRead && (
          <>
            <Divider sx={{ mt: 1.5, mb: 1 }} />
            <Button size="small" onClick={() => onMarkRead(notification.id)}>
              Mark as Read
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
