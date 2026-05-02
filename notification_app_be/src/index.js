import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import notificationRoutes from "./routes/notificationRoutes.js";
import {Log, setAuthToken } from "./middleware/logger.js";

dotenv.config();
setAuthToken(process.env.ACCESS_TOKEN);  

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  Log("backend", "info", "route", "Health check endpoint called");
  res.json({ message: "Notification Service running", status: "ok" });
});

app.listen(PORT, () => {
  Log("backend", "info", "config", `Notification backend started on port ${PORT}`);
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
