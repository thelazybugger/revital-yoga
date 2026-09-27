import { Router } from "express";
import {
  adminLoginController,
  dashboardStatsController,
  bookingsController,
  bookingDetailController,
  bookingStatusController,
  contactsController,
  contactStatusController,
} from "../controllers/admin.controller.js";
import { requireAdmin } from "../middleware/admin-auth.middleware.js";
import {
  bookingRateLimiter,
  contactRateLimiter,
} from "../middleware/rate-limit.middleware.js";

const router = Router();

router.post("/login", bookingRateLimiter, adminLoginController);

router.get("/dashboard", requireAdmin, dashboardStatsController);

router.get("/bookings", requireAdmin, bookingsController);
router.get("/bookings/:id", requireAdmin, bookingDetailController);
router.patch("/bookings/:id/status", requireAdmin, bookingStatusController);

router.get("/contacts", requireAdmin, contactsController);
router.patch(
  "/contacts/:id/status",
  requireAdmin,
  contactRateLimiter,
  contactStatusController,
);

export default router;
