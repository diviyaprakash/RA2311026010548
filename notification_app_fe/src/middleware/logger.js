const LOG_URL = "http://20.207.122.201/evaluation-service/logs";

const VALID_STACKS   = ["frontend", "backend"];
const VALID_LEVELS   = ["debug", "info", "warn", "error", "fatal"];
const VALID_PACKAGES = [
  "api", "auth", "component", "config", "controller",
  "db", "handler", "hook", "middleware", "page",
  "route", "service", "state",
];

let _token = null;

export function setAuthToken(token) {
  _token = token;
}

export async function Log(stack, level, pkg, message) {
  if (!_token) return;
  if (!VALID_STACKS.includes(stack) || !VALID_LEVELS.includes(level) || !VALID_PACKAGES.includes(pkg)) return;

  try {
    await fetch(LOG_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${_token}`,
      },
      body: JSON.stringify({ stack, level, package: pkg, message }),
    });
  } catch {
    // silently fail – logging must not break the app
  }
}

export const logger = {
  debug: (pkg, msg) => Log("frontend", "debug", pkg, msg),
  info:  (pkg, msg) => Log("frontend", "info",  pkg, msg),
  warn:  (pkg, msg) => Log("frontend", "warn",  pkg, msg),
  error: (pkg, msg) => Log("frontend", "error", pkg, msg),
  fatal: (pkg, msg) => Log("frontend", "fatal", pkg, msg),
};

export default logger;
