import express from "express";
import {
  createNotificationHandler,
  getUserNotifications,
  markNotificationRead,
  deleteNotification,
  getUnreadCount,
} from "../controllers/notificationController.js";

const router = express.Router();

router.post("/", createNotificationHandler);
router.get("/:userId", getUserNotifications);
router.get("/:userId/unread-count", getUnreadCount);
router.patch("/:id/read", markNotificationRead);
router.delete("/:id", deleteNotification);

export default router;
