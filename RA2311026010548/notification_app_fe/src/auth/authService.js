import { AFFORDMED_BASE } from "../config/api.js";
import { setAuthToken } from "../middleware/logger.js";
import logger from "../middleware/logger.js";

/**
 * Register with the AffordMed test server.
 * Only call once — save the clientID and clientSecret returned.
 */
export async function register({ email, name, mobileNo, githubUsername, rollNo, accessCode }) {
  logger.info("auth", `Registering user: ${email}`);
  const res = await fetch(`${AFFORDMED_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name, mobileNo, githubUsername, rollNo, accessCode }),
  });
  const data = await res.json();
  if (!res.ok) {
    logger.error("auth", `Registration failed: ${JSON.stringify(data)}`);
    throw new Error(data.message || "Registration failed");
  }
  logger.info("auth", "Registration successful - save clientID and clientSecret");
  return data;
}

/**
 * Obtain Bearer token from the AffordMed test server.
 */
export async function authenticate({ email, name, rollNo, accessCode, clientID, clientSecret }) {
  logger.info("auth", `Authenticating user: ${email}`);
  const res = await fetch(`${AFFORDMED_BASE}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name, rollNo, accessCode, clientID, clientSecret }),
  });
  const data = await res.json();
  if (!res.ok) {
    logger.error("auth", `Authentication failed: ${JSON.stringify(data)}`);
    throw new Error(data.message || "Authentication failed");
  }
  const token = data.access_token;
  setAuthToken(token);
  localStorage.setItem("access_token", token);
  logger.info("auth", "Authentication successful - token saved");
  return data;
}

export function getStoredToken() {
  return localStorage.getItem("access_token");
}
