import { Router } from "express";
import { createBookingController } from "../controllers/booking.controller.js";
import { bookingRateLimiter } from "../middleware/rate-limit.middleware.js";

const router = Router();

router.post("/", bookingRateLimiter, createBookingController);

export default router;
