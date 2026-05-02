# Notification System Design

**Author:** Diviyaprakash G B  
**Roll No:** RA2311026010548  
**Track:** Frontend

---

## Overview

The system is composed of two stages:

1. **Stage 1 – Priority Inbox Algorithm**: A standalone JavaScript module that fetches notifications from the AffordMed evaluation service and returns the top-10 highest-priority items.
2. **Stage 2 – React Frontend**: A full-featured notification viewer built with React and Material UI, consuming the evaluation service API directly.

---

## Stage 1 – Priority Inbox Algorithm

### File
`priorityInbox.js`

### Logic

```
Priority weights:
  Placement → 3  (highest)
  Result    → 2
  Event     → 1  (lowest)

Sort order:
  1. By priority weight (descending)
  2. Tie-break: createdAt (descending – most recent first)

Return: top 10 items from the sorted list
```

### API Used
```
GET http://20.207.122.201/evaluation-service/notifications
Authorization: Bearer <JWT>
```

### Flow
```
getPriorityInbox(token)
  │
  ├─► fetch /notifications  (GET, Bearer token)
  │
  ├─► sort by TYPE_PRIORITY desc, then createdAt desc
  │
  └─► return top 10 items
```

---

## Stage 2 – React Frontend Architecture

### Tech Stack
| Layer | Choice |
|---|---|
| UI Framework | React 18 (Create React App) |
| Component Library | Material UI v5 |
| State Management | React Context + useReducer |
| HTTP Client | fetch (native) |
| Logging | Custom logging middleware |

### Component Tree
```
App
├── AuthContext (global auth state)
├── NotificationContext (global notification state)
│
├── LoginPage
│   └── LoginForm (email + token input)
│
└── NotificationsPage
    ├── AppBar (title + logout)
    ├── TabPanel: All Notifications
    │   ├── FilterBar (Placement / Result / Event / All)
    │   ├── NotificationCard (×N)  – NEW badge on unread
    │   └── Pagination
    └── TabPanel: Priority Inbox
        ├── (top-10 by priority algorithm)
        └── NotificationCard (×10)
```

### Key Features
- **All Notifications tab** – full list with filter by type (Placement / Result / Event) and pagination (10 per page)
- **Priority Inbox tab** – top-10 computed using Stage 1 algorithm
- **Read vs Unread** – unread cards show a blue NEW chip; read cards are visually dimmed
- **Mark as Read** – button on each card posts to the evaluation service
- **Logging** – every API call, page load, and user action is logged via `Log()` with correct stack/level/package values

### Data Flow
```
User opens app
  └─► LoginPage: enter email + access token
        └─► setAuthToken(token)  →  AuthContext

User views notifications
  └─► GET /notifications  →  NotificationContext stores list
        ├─► All tab: filter + paginate from context
        └─► Priority tab: run getPriorityInbox() → top 10

User clicks "Mark as Read"
  └─► PUT /notifications/{id}/read
        └─► update local state (isRead: true)
```

### API Endpoints Used
```
GET  /evaluation-service/notifications          – fetch all
PUT  /evaluation-service/notifications/{id}     – mark as read
```

---

## Logging Strategy

Every action logs to `http://20.207.122.201/evaluation-service/logs` with:

| Action | stack | level | package |
|---|---|---|---|
| App startup | frontend | info | config |
| Login | frontend | info | auth |
| Fetch notifications | frontend | info | api |
| API error | frontend | error | api |
| Render page | frontend | info | page |
| User clicks filter | frontend | debug | component |
| Mark as read | frontend | info | handler |
| Priority inbox computed | frontend | info | component |

---

## Scalability Considerations

- **Pagination** prevents loading thousands of notifications at once.
- **Priority algorithm** is O(n log n) — easily handles large lists.
- **Token-based auth** (JWT) means the system is stateless and horizontally scalable.
- **Context + useReducer** allows state to be lifted without Redux for this scale.

---

## Security Considerations

- JWT token stored in React state only (not localStorage) — cleared on refresh.
- All API requests include `Authorization: Bearer <token>` header.
- No sensitive credentials committed to the repository (`.gitignore` covers `.env`).
