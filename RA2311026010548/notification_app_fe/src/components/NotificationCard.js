import {
  Card, CardContent, Typography, IconButton,
  Chip, Box, Tooltip
} from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DeleteIcon from "@mui/icons-material/Delete";
import logger from "../middleware/logger.js";

const TYPE_COLORS = {
  info: "info",
  success: "success",
  warning: "warning",
  error: "error",
};

export function NotificationCard({ notification, onMarkRead, onDelete }) {
  const { id, type, title, message, isRead, createdAt } = notification;

  const handleMarkRead = () => {
    logger.info("component", `NotificationCard: user marked read for ${id}`);
    onMarkRead(id);
  };

  const handleDelete = () => {
    logger.info("component", `NotificationCard: user deleted notification ${id}`);
    onDelete(id);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 1.5,
        opacity: isRead ? 0.6 : 1,
        borderLeft: isRead ? "4px solid #ccc" : `4px solid`,
        borderLeftColor: isRead ? "divider" : `${TYPE_COLORS[type] || "primary"}.main`,
        transition: "opacity 0.3s",
      }}
    >
      <CardContent sx={{ display: "flex", alignItems: "flex-start", gap: 2, pb: "12px !important" }}>
        <Box flex={1}>
          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
            <Chip label={type} color={TYPE_COLORS[type] || "default"} size="small" />
            {!isRead && <Chip label="Unread" size="small" color="primary" variant="outlined" />}
          </Box>
          <Typography variant="subtitle1" fontWeight={600}>{title}</Typography>
          <Typography variant="body2" color="text.secondary">{message}</Typography>
          <Typography variant="caption" color="text.disabled" mt={0.5} display="block">
            {new Date(createdAt).toLocaleString()}
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column">
          {!isRead && (
            <Tooltip title="Mark as read">
              <IconButton size="small" onClick={handleMarkRead} color="primary">
                <DoneAllIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Delete">
            <IconButton size="small" onClick={handleDelete} color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
}
