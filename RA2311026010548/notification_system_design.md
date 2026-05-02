# Notification System Design

## Overview

A scalable, real-time notification system that delivers alerts and updates to users across web and mobile clients. This document covers architecture, data flow, API design, and technology decisions for the notification platform.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTS                              │
│   React Frontend (Web)  │  Mobile App  │  Other Services    │
└────────────┬────────────┴──────┬───────┴────────────────────┘
             │                   │
             ▼                   ▼
┌─────────────────────────────────────────────────────────────┐
│                      API GATEWAY                            │
│              (Auth, Rate Limiting, Routing)                  │
└──────────────────────────┬──────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
┌─────────────────┐ ┌────────────┐ ┌───────────────────┐
│  Notification   │ │   User     │ │   Auth Service    │
│    Service      │ │  Service   │ │   (JWT/OAuth)     │
└────────┬────────┘ └────────────┘ └───────────────────┘
         │
         ▼
┌─────────────────┐       ┌─────────────────────────────┐
│  Message Queue  │──────▶│    Notification Workers     │
│  (Redis/RabbitMQ│       │  (Email, SMS, Push, In-App) │
└─────────────────┘       └─────────────────────────────┘
         │
         ▼
┌─────────────────┐       ┌─────────────────────────────┐
│   PostgreSQL    │       │        WebSocket Server     │
│  (Persistence)  │       │   (Real-time delivery)      │
└─────────────────┘       └─────────────────────────────┘
```

---

## Components

### 1. Notification Service (Backend)
- Receives notification trigger events from other services
- Validates payload and persists to DB
- Publishes events to the message queue
- Exposes REST APIs for CRUD operations on notifications

### 2. Message Queue (Redis Pub/Sub)
- Decouples notification creation from delivery
- Enables async, fault-tolerant processing
- Supports retry logic for failed deliveries

### 3. Notification Workers
- Subscribe to queue channels
- Handle delivery by type: In-App, Email, SMS, Push
- Update delivery status in DB after each attempt

### 4. WebSocket Server
- Maintains persistent connections per user session
- Pushes real-time in-app notifications instantly
- Falls back gracefully if connection drops

### 5. React Frontend
- Connects to WebSocket on login
- Displays unread count badge in real-time
- Fetches notification history via REST API
- Marks notifications as read

---

## Data Models

### Notification
```json
{
  "id": "uuid",
  "userId": "uuid",
  "type": "info | warning | error | success",
  "title": "string",
  "message": "string",
  "isRead": false,
  "channel": "in_app | email | sms | push",
  "createdAt": "ISO8601",
  "readAt": "ISO8601 | null"
}
```

### User Preferences
```json
{
  "userId": "uuid",
  "emailEnabled": true,
  "pushEnabled": true,
  "smsEnabled": false,
  "quietHoursStart": "22:00",
  "quietHoursEnd": "08:00"
}
```

---

## API Endpoints

### Backend (notification_app_be)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/notifications` | Create and dispatch a notification |
| GET | `/api/notifications/:userId` | Fetch all notifications for user |
| PATCH | `/api/notifications/:id/read` | Mark a notification as read |
| DELETE | `/api/notifications/:id` | Delete a notification |
| GET | `/api/notifications/:userId/unread-count` | Get unread count |

### WebSocket Events

| Event | Direction | Payload |
|-------|-----------|---------|
| `notification:new` | Server → Client | Full notification object |
| `notification:read` | Client → Server | `{ id }` |
| `connect` | Client → Server | `{ userId, token }` |

---

## Technology Choices

| Layer | Technology | Reason |
|-------|------------|--------|
| Frontend | React (JavaScript) | Component-based, fast re-renders for real-time UI |
| Styling | Material UI | Rich component library, consistent design system |
| Backend | Node.js + Express | Non-blocking I/O ideal for real-time systems |
| Database | PostgreSQL | Reliable, supports complex queries for notification history |
| Cache/Queue | Redis | Fast Pub/Sub, TTL support, session storage |
| Real-time | Socket.IO | Abstraction over WebSocket with fallback support |
| Auth | JWT (Bearer tokens) | Stateless, scalable authentication |

---

## Scalability Considerations

- **Horizontal scaling**: Notification workers are stateless and can scale independently
- **Database indexing**: Index on `userId`, `isRead`, `createdAt` for fast queries
- **Rate limiting**: API Gateway enforces per-user rate limits to prevent spam
- **Batching**: Workers batch email/SMS sends to reduce third-party API costs
- **Pagination**: Notification history API uses cursor-based pagination

---

## Security

- All API routes are protected with JWT Bearer token authentication
- User can only access their own notifications (authorization check on userId)
- Input validation on all POST/PATCH endpoints
- WebSocket connections authenticated on handshake
- Sensitive fields (email, phone) are masked in logs

---

## Logging Strategy

Using the `logging_middleware` package throughout the system:

```js
// On new notification created
Log("backend", "info", "service", "Notification created for userId: abc123, type: info");

// On delivery failure
Log("backend", "error", "service", "Email delivery failed for notificationId: xyz - SMTP timeout");

// On frontend WebSocket connection
Log("frontend", "info", "hook", "WebSocket connected for userId: abc123");

// On frontend marking read
Log("frontend", "info", "api", "Notification marked as read: notificationId xyz");
```
