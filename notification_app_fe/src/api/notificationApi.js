import { BASE_URL } from "../config/api";
import { Log } from "../middleware/logger";

export async function fetchNotifications(token) {
  Log("frontend", "info", "api", "Fetching all notifications");
  const res = await fetch(`${BASE_URL}/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    Log("frontend", "error", "api", `fetchNotifications failed: ${res.status}`);
    throw new Error(`Failed to fetch: ${res.status}`);
  }
  const data = await res.json();
  Log("frontend", "info", "api", "Fetched notifications successfully");
  const raw = Array.isArray(data) ? data : (data.notifications ?? data.data ?? []);

  // Normalize capitalized field names from the API
  return raw.map((n) => ({
    id: n.ID ?? n.id,
    type: n.Type ?? n.type,
    message: n.Message ?? n.message,
    title: n.Type ?? n.type,
    createdAt: n.Timestamp ?? n.createdAt,
    isRead: n.isRead ?? false,
  }));
}

export async function markAsRead(token, id) {
  Log("frontend", "info", "handler", `Marking notification ${id} as read`);
  const res = await fetch(`${BASE_URL}/notifications/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ isRead: true }),
  });
  if (!res.ok) {
    Log("frontend", "warn", "handler", `markAsRead failed for ${id}: ${res.status}`);
  }
  return res.ok;
}
