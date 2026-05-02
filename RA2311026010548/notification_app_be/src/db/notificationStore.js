/**
 * In-memory notifications store (simulates a database).
 * In production, replace with PostgreSQL / MongoDB.
 */

let notifications = [];

export function getAllByUser(userId) {
  return notifications.filter((n) => n.userId === userId);
}

export function getById(id) {
  return notifications.find((n) => n.id === id) || null;
}

export function insert(notification) {
  notifications.push(notification);
  return notification;
}

export function markRead(id) {
  const n = notifications.find((n) => n.id === id);
  if (!n) return null;
  n.isRead = true;
  n.readAt = new Date().toISOString();
  return n;
}

export function remove(id) {
  const index = notifications.findIndex((n) => n.id === id);
  if (index === -1) return false;
  notifications.splice(index, 1);
  return true;
}

export function unreadCount(userId) {
  return notifications.filter((n) => n.userId === userId && !n.isRead).length;
}
