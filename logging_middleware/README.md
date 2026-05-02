# Logging Middleware

A reusable logging package that sends structured logs to the AffordMed evaluation test server.

## Usage

```js
import { setAuthToken, Log, logger } from './logger.js';

// Set your Bearer token (obtained from /evaluation-service/auth)
setAuthToken("your_access_token_here");

// Use the core Log function
await Log("frontend", "info", "component", "App component mounted successfully");
await Log("frontend", "error", "api", "Failed to fetch notifications - 500 Internal Server Error");

// Or use convenience wrappers
await logger.info("page", "Notifications page loaded");
await logger.error("hook", "useNotifications: fetch failed");
await logger.debug("state", "Notification state updated: 3 unread");
```

## API

### `setAuthToken(token)`
Set the Bearer token before making any log calls.

### `Log(stack, level, package, message)`
| Parameter | Valid Values |
|-----------|-------------|
| stack     | `"frontend"`, `"backend"` |
| level     | `"debug"`, `"info"`, `"warn"`, `"error"`, `"fatal"` |
| package   | `"api"`, `"component"`, `"hook"`, `"page"`, `"state"`, `"style"`, `"auth"`, `"config"`, `"middleware"`, `"utils"` |
| message   | Any descriptive string |

### `logger` convenience object
- `logger.debug(pkg, message)`
- `logger.info(pkg, message)`
- `logger.warn(pkg, message)`
- `logger.error(pkg, message)`
- `logger.fatal(pkg, message)`

All convenience methods default to `stack: "frontend"`.
