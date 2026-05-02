import { v4 as uuidv4 } from "uuid";

/**
 * Creates a new Notification object.
 * @param {string} userId
 * @param {string} type - "info" | "success" | "warning" | "error"
 * @param {string} title
 * @param {string} message
 * @returns {object} notification
 */
export function createNotification(userId, type, title, message) {
  return {
    id: uuidv4(),
    userId,
    type,
    title,
    message,
    isRead: false,
    channel: "in_app",
    createdAt: new Date().toISOString(),
    readAt: null,
  };
}
