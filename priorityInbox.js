/**
 * Stage 1 – Priority Inbox Algorithm
 * Fetches notifications from the AffordMed evaluation service and returns
 * the top-10 highest-priority notifications.
 *
 * Priority order (descending): Placement > Result > Event
 * Tie-breaking: most recent first (createdAt)
 */

import { Log, setAuthToken } from "./logging_middleware/logger.js";

const BASE_URL = "http://20.207.122.201/evaluation-service";

const TYPE_PRIORITY = {
  Placement: 3,
  Result:    2,
  Event:     1,
};

/**
 * Fetches all notifications for the authenticated user, then returns
 * the top 10 sorted by priority category then recency.
 *
 * @param {string} accessToken  – JWT from /auth
 * @returns {Promise<Array>}    – up to 10 notification objects
 */
export async function getPriorityInbox(accessToken) {
  setAuthToken(accessToken);

  Log("frontend", "info", "api", "Fetching notifications from evaluation service");

  const response = await fetch(`${BASE_URL}/notifications`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    Log("frontend", "error", "api", `Failed to fetch notifications: ${response.status}`);
    throw new Error(`Fetch failed (${response.status}): ${text}`);
  }

  const data = await response.json();

  // Support both array responses and { notifications: [] } shapes
  const notifications = Array.isArray(data) ? data : (data.notifications ?? []);

  Log("frontend", "info", "api", `Fetched ${notifications.length} notifications`);

  const sorted = notifications
    .slice()
    .sort((a, b) => {
      const pa = TYPE_PRIORITY[a.type] ?? 0;
      const pb = TYPE_PRIORITY[b.type] ?? 0;
      if (pb !== pa) return pb - pa;
      // Same priority → newer first
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const top10 = sorted.slice(0, 10);

  Log("frontend", "info", "component", `Priority inbox computed – returning ${top10.length} items`);

  return top10;
}

// ── Quick manual test (run with: node priorityInbox.js) ──────────────────────
if (process.argv[1].endsWith("priorityInbox.js")) {
  const token = process.env.ACCESS_TOKEN;
  if (!token) {
    console.error("Set ACCESS_TOKEN env var before running.");
    process.exit(1);
  }

  getPriorityInbox(token)
    .then((items) => {
      console.log(`\nTop ${items.length} priority notifications:`);
      items.forEach((n, i) =>
        console.log(`  ${i + 1}. [${n.type}] ${n.title} – ${n.message} (${n.createdAt})`)
      );
    })
    .catch(console.error);
}
