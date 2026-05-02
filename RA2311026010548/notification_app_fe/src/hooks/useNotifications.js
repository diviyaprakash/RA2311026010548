import { useState, useEffect, useCallback } from "react";
import { fetchNotifications, markAsRead, deleteNotification } from "../api/notificationApi.js";
import logger from "../middleware/logger.js";

export function useNotifications(userId) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    logger.debug("hook", `useNotifications: loading for userId ${userId}`);
    try {
      const data = await fetchNotifications(userId);
      setNotifications(data);
      logger.info("hook", `useNotifications: loaded ${data.length} notifications`);
    } catch (err) {
      setError(err.message);
      logger.error("hook", `useNotifications: fetch failed - ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      logger.info("hook", `useNotifications: marked read ${id}`);
    } catch (err) {
      logger.error("hook", `useNotifications: markRead failed - ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      logger.info("hook", `useNotifications: deleted ${id}`);
    } catch (err) {
      logger.error("hook", `useNotifications: delete failed - ${err.message}`);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return { notifications, loading, error, unreadCount, handleMarkRead, handleDelete, reload: load };
}
