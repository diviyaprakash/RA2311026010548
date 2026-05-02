/**
 * Logger Middleware - Backend
 * Reusable Log function that sends logs to the AffordMed test server.
 */

const LOG_API_URL = "http://20.207.122.201/evaluation-service/logs";

let authToken = null;

export function setAuthToken(token) {
  authToken = token;
}

export async function Log(stack, level, pkg, message) {
  if (!authToken) {
    console.warn(`[Logger] No token set. Log skipped: [${level}] ${pkg} - ${message}`);
    return;
  }

  try {
    const res = await fetch(LOG_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ stack, level, package: pkg, message }),
    });
    const data = await res.json();
    console.log(`[Logger] ${level.toUpperCase()} [${pkg}] ${message} → LogID: ${data.logID}`);
  } catch (err) {
    console.error("[Logger] Failed to send log:", err.message);
  }
}

export default Log;
