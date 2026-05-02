/**
 * Frontend Logger
 * Uses the shared logging_middleware Log function.
 * Sets frontend stack by default.
 */

const LOG_API_URL = "http://20.207.122.201/evaluation-service/logs";

let authToken = null;

export function setAuthToken(token) {
  authToken = token;
  localStorage.setItem("log_token", token);
}

export function initTokenFromStorage() {
  const stored = localStorage.getItem("log_token");
  if (stored) authToken = stored;
}

export async function Log(stack, level, pkg, message) {
  if (!authToken) {
    console.warn(`[Logger] No token. Skipping: [${level}] ${pkg} - ${message}`);
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
    console.log(`[Logger] ${level.toUpperCase()} [${pkg}] ${message}`);
    return data;
  } catch (err) {
    console.error("[Logger] Failed:", err.message);
  }
}

const logger = {
  debug: (pkg, msg) => Log("frontend", "debug", pkg, msg),
  info:  (pkg, msg) => Log("frontend", "info",  pkg, msg),
  warn:  (pkg, msg) => Log("frontend", "warn",  pkg, msg),
  error: (pkg, msg) => Log("frontend", "error", pkg, msg),
  fatal: (pkg, msg) => Log("frontend", "fatal", pkg, msg),
};

export default logger;
