import { BASE_URL } from "../config/api.js";
import logger from "../middleware/logger.js";

export async function fetchNotifications(userId) {
  logger.info("api", `Fetching notifications for userId: ${userId}`);
  const res = await fetch(`${BASE_URL}/notifications/${userId}`);
  if (!res.ok) {
    logger.error("api", `Failed to fetch notifications for userId: ${userId} - status ${res.status}`);
    throw new Error("Failed to fetch notifications");
  }
  const data = await res.json();
  logger.info("api", `Fetched ${data.length} notifications for userId: ${userId}`);
  return data;
}

export async function markAsRead(id) {
  logger.info("api", `Marking notification as read: ${id}`);
  const res = await fetch(`${BASE_URL}/notifications/${id}/read`, { method: "PATCH" });
  if (!res.ok) {
    logger.error("api", `Failed to mark notification as read: ${id}`);
    throw new Error("Failed to mark as read");
  }
  return res.json();
}

export async function deleteNotification(id) {
  logger.info("api", `Deleting notification: ${id}`);
  const res = await fetch(`${BASE_URL}/notifications/${id}`, { method: "DELETE" });
  if (!res.ok) {
    logger.error("api", `Failed to delete notification: ${id}`);
    throw new Error("Failed to delete notification");
  }
  return res.json();
}

export async function fetchUnreadCount(userId) {
  const res = await fetch(`${BASE_URL}/notifications/${userId}/unread-count`);
  if (!res.ok) throw new Error("Failed to fetch unread count");
  return res.json();
}
