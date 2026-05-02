# RA2311026010548

AffordMed Campus Hiring Evaluation — Frontend Track

## Repository Structure

```
RA2311026010548/
├── logging_middleware/          # Reusable Log(stack, level, package, message) function
├── notification_system_design.md  # Architecture & design document
├── notification_app_be/         # Express.js backend for notification service
├── notification_app_fe/         # React frontend for notification UI
└── .gitignore
```

## Setup

### 1. Register with AffordMed Test Server
Send a POST to `http://20.207.122.201/evaluation-service/register` with your credentials.
Save the `clientID` and `clientSecret` from the response.

### 2. Start Backend
```bash
cd notification_app_be
npm install
cp .env.example .env   # fill in PORT and ACCESS_TOKEN
npm run dev
```

### 3. Start Frontend
```bash
cd notification_app_fe
npm install
npm start
```

### 4. Login
Open `http://localhost:3000`, enter your credentials including the `clientID` and `clientSecret` to authenticate and start using the notification app.
