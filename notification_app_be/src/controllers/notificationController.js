import * as store from "../db/notificationStore.js";
import { createNotification } from "../domain/notification.js";
import { Log } from "../middleware/logger.js";

export async function createNotificationHandler(req, res) {
  const { userId, type, title, message } = req.body;

  if (!userId || !type || !title || !message) {
    Log("backend", "warn", "handler", "Create notification failed - missing required fields");
    return res.status(400).json({ error: "userId, type, title, and message are required" });
  }

  const notification = createNotification(userId, type, title, message);
  store.insert(notification);

  Log("backend", "info", "service", `Notification created for userId: ${userId}, type: ${type}`);
  return res.status(201).json(notification);
}

export async function getUserNotifications(req, res) {
  const { userId } = req.params;
  const notifications = store.getAllByUser(userId);

  Log("backend", "info", "controller", `Fetched ${notifications.length} notifications for userId: ${userId}`);
  return res.json(notifications);
}

export async function markNotificationRead(req, res) {
  const { id } = req.params;
  const updated = store.markRead(id);

  if (!updated) {
    Log("backend", "warn", "controller", `Mark-read failed - notification not found: ${id}`);
    return res.status(404).json({ error: "Notification not found" });
  }

  Log("backend", "info", "controller", `Notification marked as read: ${id}`);
  return res.json(updated);
}

export async function deleteNotification(req, res) {
  const { id } = req.params;
  const deleted = store.remove(id);

  if (!deleted) {
    Log("backend", "warn", "controller", `Delete failed - notification not found: ${id}`);
    return res.status(404).json({ error: "Notification not found" });
  }

  Log("backend", "info", "controller", `Notification deleted: ${id}`);
  return res.json({ message: "Notification deleted" });
}

export async function getUnreadCount(req, res) {
  const { userId } = req.params;
  const count = store.unreadCount(userId);

  Log("backend", "debug", "controller", `Unread count for userId ${userId}: ${count}`);
  return res.json({ userId, unreadCount: count });
}
