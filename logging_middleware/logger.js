/**
 * Logging Middleware
 * Reusable logging package for Frontend applications.
 * Sends structured logs to the AffordMed evaluation test server.
 */

const LOG_API_URL = "http://20.207.122.201/evaluation-service/logs";

// Valid enum values (must be lowercase)
const VALID_STACKS = ["backend", "frontend"];
const VALID_LEVELS = ["debug", "info", "warn", "error", "fatal"];
const VALID_PACKAGES_FRONTEND = ["api", "component", "hook", "page", "state", "style"];
const VALID_PACKAGES_SHARED = ["auth", "config", "middleware", "utils"];
const VALID_PACKAGES = [...VALID_PACKAGES_FRONTEND, ...VALID_PACKAGES_SHARED];

let authToken = null;

/**
 * Set the Bearer token for authenticated log API calls.
 * Call this after obtaining the token from /evaluation-service/auth
 * @param {string} token - Bearer access token
 */
export function setAuthToken(token) {
  authToken = token;
}

/**
 * Core reusable Log function.
 * Makes a POST request to the test server log API.
 *
 * @param {string} stack   - "frontend" | "backend"
 * @param {string} level   - "debug" | "info" | "warn" | "error" | "fatal"
 * @param {string} package - e.g. "component" | "hook" | "api" | "page" | "state" | "style" | "auth" | "config" | "middleware" | "utils"
 * @param {string} message - Descriptive log message
 */
export async function Log(stack, level, pkg, message) {
  // Validate inputs
  if (!VALID_STACKS.includes(stack)) {
    console.error(`[Logger] Invalid stack "${stack}". Must be one of: ${VALID_STACKS.join(", ")}`);
    return;
  }
  if (!VALID_LEVELS.includes(level)) {
    console.error(`[Logger] Invalid level "${level}". Must be one of: ${VALID_LEVELS.join(", ")}`);
    return;
  }
  if (!VALID_PACKAGES.includes(pkg)) {
    console.error(`[Logger] Invalid package "${pkg}". Must be one of: ${VALID_PACKAGES.join(", ")}`);
    return;
  }
  if (!authToken) {
    console.warn("[Logger] No auth token set. Call setAuthToken(token) before logging.");
    return;
  }

  const body = {
    stack,
    level,
    package: pkg,
    message,
  };

  try {
    const response = await fetch(LOG_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error(`[Logger] API error ${response.status}:`, err);
      return;
    }

    const data = await response.json();
    console.log(`[Logger] Log sent successfully. LogID: ${data.logID}`);
    return data;
  } catch (error) {
    console.error("[Logger] Failed to send log:", error.message);
  }
}

// Convenience wrappers for each log level
export const logger = {
  debug: (pkg, message) => Log("frontend", "debug", pkg, message),
  info:  (pkg, message) => Log("frontend", "info",  pkg, message),
  warn:  (pkg, message) => Log("frontend", "warn",  pkg, message),
  error: (pkg, message) => Log("frontend", "error", pkg, message),
  fatal: (pkg, message) => Log("frontend", "fatal", pkg, message),
};

export default Log;
