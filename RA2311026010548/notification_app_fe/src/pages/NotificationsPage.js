import {
  Container, Typography, Box, CircularProgress,
  Alert, Badge, Button, Divider
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNotifications } from "../hooks/useNotifications.js";
import { useNotificationContext } from "../state/NotificationContext.js";
import { NotificationCard } from "../components/NotificationCard.js";
import logger from "../middleware/logger.js";
import { useEffect } from "react";

export function NotificationsPage() {
  const { userId, logout } = useNotificationContext();
  const { notifications, loading, error, unreadCount, handleMarkRead, handleDelete, reload } =
    useNotifications(userId);

  useEffect(() => {
    logger.info("page", `NotificationsPage mounted for userId: ${userId}`);
  }, [userId]);

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon fontSize="large" />
          </Badge>
          <Typography variant="h5" fontWeight={700}>
            Notifications
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Button size="small" onClick={reload} variant="outlined">Refresh</Button>
          <Button size="small" onClick={logout} variant="text" color="error">Logout</Button>
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary" mb={2}>
        User: <strong>{userId}</strong> · {unreadCount} unread
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {loading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {!loading && notifications.length === 0 && (
        <Alert severity="info">No notifications yet.</Alert>
      )}

      {notifications.map((n) => (
        <NotificationCard
          key={n.id}
          notification={n}
          onMarkRead={handleMarkRead}
          onDelete={handleDelete}
        />
      ))}
    </Container>
  );
}
